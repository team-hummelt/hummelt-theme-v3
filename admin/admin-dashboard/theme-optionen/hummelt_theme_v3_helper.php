<?php

namespace Hummelt\ThemeV3;
/**
 * The admin-specific functionality of the theme.
 *
 * @link       https://wiecker.eu
 * @since      3.0.0
 *
 * @package    Hummelt_Theme_v3
 * @subpackage Hummelt_Theme_v3/admin
 */

defined('ABSPATH') or die();

use Exception;
use Hummelt_Theme_V3;
use InvalidArgumentException;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

use stdClass;
use Behat\Transliterator\Transliterator;

class hummelt_theme_v3_helper
{

    use hummelt_theme_v3_options;
    use hummelt_theme_v3_selects;
    use hummelt_theme_v3_settings;

    private static $instance;
    /**
     * Store plugin main class to allow admin access.
     *
     * @since    2.0.0
     * @access   private
     * @var Hummelt_Theme_V3 $main The main class.
     */
    protected Hummelt_Theme_V3 $main;

    /**
     * @return static
     */
    public static function instance(Hummelt_Theme_V3 $main): self
    {
        if (is_null(self::$instance)) {
            self::$instance = new self($main);
        }

        return self::$instance;
    }

    public function __construct(Hummelt_Theme_V3 $main)
    {
        $this->main = $main;

    }

    public function fn_hummelt_theme_v3_add_favicon($attachment_id): void
    {
        if (!function_exists('wp_get_image_editor')) {
            require_once ABSPATH . 'wp-includes/media.php';
        }
        $image_path = get_attached_file($attachment_id);
        if (!file_exists($image_path)) {
            error_log('Bild nicht gefunden.');
            return;
        }
        $mime_type = get_post_mime_type($attachment_id);
        if (!str_contains($mime_type, 'image/')) {
            return;
        }
        $ext = strtolower(pathinfo($image_path, PATHINFO_EXTENSION));
        $image_editor = wp_get_image_editor($image_path);
        if (is_wp_error($image_editor)) {
            error_log('Fehler beim Laden des Bildeditors: ' . $image_editor->get_error_message());
            return;
        }
        $sizes = [
            ['width' => 16, 'height' => 16],
            ['width' => 32, 'height' => 32],
            ['width' => 180, 'height' => 180]
        ];

        $paths = [];
        $wpUpload = wp_upload_dir();
        foreach ($sizes as $size) {
            // Bild skalieren
            $image_editor = wp_get_image_editor($image_path);
            $image_editor->resize($size['width'], $size['height'], true);
            $filename = sprintf('favicon-%dx%d.%s', $size['width'], $size['height'], $ext);
            $filePath = $wpUpload['path'] . '/' . $filename;
            $image_editor->save($filePath);
            $fileUrl = $wpUpload['url'] . '/' . $filename;
            $item = [
                'width' => $size['width'],
                'height' => $size['height'],
                'url' => $fileUrl,
                'path' => $filePath,
            ];
            $paths[] = $item;
        }

        update_option(HUMMELT_THEME_V3_SLUG . '/favicon_files', $paths);

    }

    public function fn_hummelt_theme_v3_delete_custom_favicon(): void
    {
        if (get_option(HUMMELT_THEME_V3_SLUG . '/favicon_files')) {
            global $wp_filesystem;
            // create a file interaction object, if it is not already created
            if (!$wp_filesystem) {
                require_once ABSPATH . 'wp-admin/includes/file.php';
                WP_Filesystem();
            }
            $paths = get_option(HUMMELT_THEME_V3_SLUG . '/favicon_files');
            foreach ($paths as $file) {
                if ($wp_filesystem->is_file($file['path'])) {
                    $wp_filesystem->delete($file['path']);
                }
            }
        }
        delete_option(HUMMELT_THEME_V3_SLUG . '/favicon_files');
    }

    public function fn_hummelt_theme_v3_set_custom_favicon(): void
    {
        if (!has_site_icon() && get_option(HUMMELT_THEME_V3_SLUG . '/favicon_files')) {
            $favicon = get_option(HUMMELT_THEME_V3_SLUG . '/favicon_files');
            $meta_tags = [];
            foreach ($favicon as $size) {
                $meta_tags[] = sprintf(
                    '<link rel="icon" href="%s" sizes="%dx%d" />',
                    esc_url($size['url']),
                    $size['width'],
                    $size['height']
                );
                if ($size['width'] == 180) {
                    $meta_tags[] = sprintf(
                        '<link rel="apple-touch-icon" href="%s" />',
                        esc_url($size['url']),
                    );
                }
            }

            $meta_tags[] = sprintf(
                '<meta name="application-name" content="%s" />',
                esc_attr(get_bloginfo('name'))
            );

            $meta_tags[] = sprintf(
                '<meta name="theme-color" content="%s" />',
                esc_attr(apply_filters('site_icon_theme_color', '#ffffff'))
            );

            echo implode("\n", $meta_tags);
        }
    }

    public function fn_check_is_font_installed($family, $localName): bool
    {
        $args = sprintf('WHERE designation="%s"', $family);
        $fonts = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_font_data', $args);
        if ($fonts->status) {
            $fonts = $fonts->record;
            $localNameArr = json_decode($fonts->localName, true);
            if (in_array($localName, $localNameArr)) {
                return true;
            }
        }
        return false;
    }

    public function fn_extract_font_data($data): array
    {
        if (!$data || !is_object($data)) {
            return [];
        }
        return [
            'id' => (int)$data->id,
            'designation' => $data->designation,
            'localName' => json_decode($data->localName, true),
            'fontInfo' => json_decode($data->fontInfo, true),
            'fontData' => json_decode($data->fontData, true),
            'isTtf' => (bool)$data->isTtf,
            'isWoff' => (bool)$data->isWoff,
            'isWoff2' => (bool)$data->isWoff2,
            'fontType' => $data->fontType
        ];
    }

    /**
     * @throws Exception
     */
    public function move_file($file, $to, $unlink = false): void
    {
        if (copy($file, $to)) {
            if ($unlink) {
                if (!unlink($file)) {
                    throw new Exception('File konnte nicht gelöscht gefunden.');
                }
            }
        }
    }

    public function fn_theme_hummelt_v3_font_face($site_url = false, $file_name = '', $family = ''): void
    {
        global $wp_filesystem;
        $args = 'WHERE fontType="intern"';
        $fonts = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_font_by_args',null,  $args);
       // $fonts = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_font_by_args', '');
        $url = '';
        if ($site_url) {
            $url = HUMMELT_THEME_V3_FONTS_URL;
        }

        $file = 'theme-font-face.css';
        if ($file_name) {
            $file = $file_name;
        }

        $cssFilePath = HUMMELT_THEME_V3_FONTS_DIR . $file;
        $wp_filesystem->delete($cssFilePath);
        $defaultCss = HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/font-upload/default.css.txt';
        if ($wp_filesystem->is_file($defaultCss)) {
            $css = $wp_filesystem->get_contents($defaultCss);
            if ($fonts) {
                foreach ($fonts as $font) {
                    if ($family && $font['designation'] != $family) {
                        continue;
                    }
                    //$add = '';
                    $urlLoop = '';
                    foreach ($font['fontData'] as $data) {
                        $add = str_replace('###FAMILY###', $data['family'], $css);
                        $add = str_replace('###FULL_NAME###', $data['full_name'], $add);
                        $add = str_replace('###LOCAL_NAME###', $data['local_name'], $add);
                        $add = str_replace('###FONT_WEIGHT###', $data['font_weight'], $add);
                        $add = str_replace('###FONT_STYLE###', $data['font_style'], $add) . "\n";
                        if ($font['isWoff']) {
                            $urlLoop = "url('" . $url . $data['family'] . "/" . $data['local_name'] . ".woff') format('woff')," . "\n";
                        }
                        if ($font['isTtf']) {
                            $urlLoop .= "\t" . "url('" . $url . $data['family'] . "/" . $data['local_name'] . ".ttf') format('truetype');";
                        }
                        $add = str_replace('###URL_LOOP###', $urlLoop, $add);
                        file_put_contents($cssFilePath, $add, FILE_APPEND | LOCK_EX);
                    }
                }
            }
        }
    }

    public function fn_theme_hummelt_add_font_theme_json($family = '', $serif = ''): void
    {
        global $wp_filesystem;
        $themeJson = HUMMELT_THEME_V3_JSON;
        $slug = Transliterator::urlize($family, '-');
        if ($wp_filesystem->is_file($themeJson)) {
            $editorJson = json_decode($wp_filesystem->get_contents($themeJson), true);
            $fontFamilies = $editorJson['settings']['typography']['fontFamilies'];
            if($fontFamilies){
                foreach ($fontFamilies as $tmp) {
                    if($tmp['slug'] == $slug) {
                      return;
                    }
                }
            }
            $item = [
               'fontFamily' => "'$family', $serif",
               'name' => $family,
               'slug' => $slug
            ];
            $fontFamilies = array_merge_recursive($fontFamilies, [$item]);
            $editorJson['settings']['typography']['fontFamilies'] = $fontFamilies;
            $editorJson = json_encode($editorJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);
            $wp_filesystem->put_contents($themeJson, $editorJson);
        }
    }

    public function fn_get_register_adobe_fonts():array
    {
        $args = 'WHERE fontType="adobe"';
        $adobeFonts = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_font_data', $args, false);
        $fontArr = [];
        if($adobeFonts->status) {
            foreach ($adobeFonts->record as $tmp) {
                $fontInfo = json_decode($tmp->fontInfo, true);
                if($fontInfo['register_font'] && $fontInfo['url']) {
                    $item = [
                        'id' => 'adobe-fonts-'.$tmp->id,
                        'url' => $fontInfo['url'],
                    ];
                    $fontArr[] = $item;
                }
            }
        }
        return $fontArr;
    }

    public function fn_theme_hummelt_delete_font_theme_json($family): void
    {
        global $wp_filesystem;
        $themeJson = HUMMELT_THEME_V3_JSON;
        if ($wp_filesystem->is_file($themeJson)) {
            $editorJson = json_decode($wp_filesystem->get_contents($themeJson), true);
            $fontFamilies = $editorJson['settings']['typography']['fontFamilies'];
            $styleElements = $editorJson['styles']['elements'];
            $familyArr = [];
            foreach ($fontFamilies as $tmp) {
                if($tmp['name'] == $family) {
                    continue;
                }
                $familyArr[] = $tmp;
            }
           $typoArr = [];
            foreach ($styleElements as $key =>  $element) {
                if(!isset($element['typography'])) {
                    continue;
                }
                if(!isset($element['typography']['fontFamily'])) {
                    continue;
                }
                if($element['typography']['fontFamily'] == $family){
                    $element['typography']['fontFamily'] = '';
                }
                $typoArr[$key] = $element;
            }

            $editorJson['styles']['elements'] = $typoArr;
            $editorJson['settings']['typography']['fontFamilies'] = $familyArr;
            $editorJson = json_encode($editorJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);
            $wp_filesystem->put_contents($themeJson, $editorJson);
        }
    }

    public function fn_theme_hummelt_headlines_theme_json($headlines): void
    {
        global $wp_filesystem;
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $themeJson =HUMMELT_THEME_V3_JSON;


        if ($wp_filesystem->is_file($themeJson)) {
            $editorJson = json_decode($wp_filesystem->get_contents($themeJson), true);
            $elements = $editorJson['styles']['elements'];

            $setElements = function ($el) use ($elements, $settings) {
                $return = [
                    'typography' => [
                        'fontFamily' => '',
                        'fontSize' => '',
                        'lineHeight' => '',
                        'fontStyle' => '',
                        'fontWeight' => ''
                    ],
                    'color' => [
                        'text' => ''
                    ]
                ];
                foreach ($elements as $key => $val) {
                    if($key == $el['id']) {
                        if($el['show_editor'] && !$el['standard'] && !$el['display']  && $settings['theme_wp_optionen']['gutenberg_active']){
                           $font = $this->get_font_by_id($el['font-family'], $el['font-style']);
                           if($font['family']) {
                               $family = $font['family'];
                               $serif = $font['font_serif'];
                               $return['typography']['fontFamily'] = "$family, $serif";
                               $return['typography']['fontStyle'] = (string) $font['font_style'];
                               $return['typography']['fontWeight'] = (string) $font['font_weight'];
                           }
                            $size = sprintf("%spx", $el['size']);
                            $return['typography']['fontSize'] = "$size";
                            $return['typography']['lineHeight'] = (string) $el['line-height'];
                            $return['color']['text'] = $el['color'];
                        }
                    }
                }

                return $return;
            };
            $fontArr = [];
            $fontsEditArr = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
            foreach ($headlines as $tmp) {
                $editElement = $setElements($tmp);
                if(in_array($tmp['id'], $fontsEditArr)) {
                    $fontArr[$tmp['id']] = $editElement;
                }
            }

          if($fontArr) {
              $editorJson['styles']['elements'] = $fontArr;
              $editorJson = json_encode($editorJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);
              $wp_filesystem->put_contents($themeJson, $editorJson);
          }
        }
    }

    public function get_font_by_id($id, $style):array
    {
        $return = [
            'family' => '',
            'font_weight' => '',
            'font_style' => '',
            'font_serif' => ''
        ];
        $font = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_font_by_args', $id);
        if($font && isset($font['fontData'])){
            foreach ($font['fontData'] as $data) {
               if($data['id'] == $style) {
                   $return['family'] = $data['family'];
                   $return['font_weight'] = $data['font_weight'];
                   $return['font_style'] = $data['font_style'];
                   $return['font_serif'] = $data['font_serif'];
               }
            }
        }
       return $return;
    }

    public function fn_theme_hummelt_v3_font_demo($family): void
    {
        if (!$family) {
            exit();
        }
        $args = sprintf('WHERE designation="%s"', $family);
        $font = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_font_data', $args);
        if (!$font->status) {
            exit();
        }
        global $wp_filesystem;
        $font = $font->record;
        $fontData = json_decode($font->fontData, true);

        $loop = HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/font-upload/default.html';
        $htmlLoop = $wp_filesystem->get_contents($loop);
        $htmlLayout = HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/font-upload/font-demo.html';
        $layout = $wp_filesystem->get_contents($htmlLayout);
        $this->fn_theme_hummelt_v3_font_face(true, 'font-demo.css', $family);
        $outLoop = '';
        foreach ($fontData as $tmp) {

            $out = str_replace('###FAMILY###', $tmp['family'], $htmlLoop);
            $out = str_replace('###FONT_WEIGHT###', $tmp['font_weight'], $out);
            $out = str_replace('###FONT_STYLE###', $tmp['font_style'], $out);
            $out = str_replace('###FULL_NAME###', $tmp['full_name'], $out);
            $out = str_replace('###SITE_NAME###', 'Hummelt und partner v' . HUMMELT_THEME_V3_VERSION, $out);
            $out = str_replace('###FONT_LOCAL###', $tmp['local_name'], $out);

            $outLoop .= $out;
        }
        $html = str_replace('###FONT-LOOP###', $outLoop, $layout);
        $html = str_replace('###DEMO-FONT-CSS###', HUMMELT_THEME_V3_FONTS_URL . 'font-demo.css', $html);
        $html = str_replace('###TITLE###', '  Hummelt und partner Theme v' . HUMMELT_THEME_V3_VERSION, $html);
        echo $this->fn_compress_string($html);
    }

    public function fn_theme_hummelt_v3_get_sortable_post_types(): array
    {
        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $getOptionen = function ($name) use ($optionen) {
            foreach ($optionen['sortable_post_types'] as $tmp) {
                if ($tmp['name'] == $name) {
                    if (!$tmp['value']) {
                        return 'show';
                    }
                    return $tmp['value'];
                }
            }
            return 'show';
        };
        $post_types = get_post_types();
        $postTypes = [];
        foreach ($post_types as $post_type_name) {
            if (in_array($post_type_name, $this->ignore_post_types)) {
                continue;
            }
            $post_type_data = get_post_type_object($post_type_name);
            if ($post_type_data->show_ui === FALSE) {
                continue;
            }
            $value = $getOptionen($post_type_data->name);
            $item = [
                'name' => $post_type_data->name,
                'label' => $post_type_data->label,
                'value' => $value
            ];
            $postTypes[] = $item;
        }

        return $postTypes;
    }

    public function fn_theme_hummelt_v3_get_duplicate_post_types(): array
    {
        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $getOptionen = function ($name) use ($optionen) {
            foreach ($optionen['duplicate_post_types'] as $tmp) {
                if ($tmp['name'] == $name) {
                    if (!$tmp['value']) {
                        return 'show';
                    }
                    return $tmp['value'];
                }
            }
            return 'show';
        };
        $post_types = get_post_types();
        $postTypes = [];
        foreach ($post_types as $post_type_name) {
            if (in_array($post_type_name, $this->ignore_duplicate_post_types)) {
                continue;
            }
            $post_type_data = get_post_type_object($post_type_name);
            if ($post_type_data->show_ui === FALSE) {
                continue;
            }
            $value = $getOptionen($post_type_data->name);
            $item = [
                'name' => $post_type_data->name,
                'label' => $post_type_data->label,
                'value' => $value

            ];
            $postTypes[] = $item;
        }

        return $postTypes;
    }

    public function add_wp_config_put($slash, $const, $bool): void
    {
        global $wp_filesystem;
        $config = $wp_filesystem->get_contents(ABSPATH . "wp-config.php");
        $config = preg_replace("/^([\r\n\t ]*)(\<\?)(php)?/i", "<?php define('$const', $bool);", $config);
        $wp_filesystem->put_contents(ABSPATH . $slash . "wp-config.php", $config);
    }

    public function wp_config_delete($slash, $const, $bool): void
    {
        global $wp_filesystem;
        $config = $wp_filesystem->get_contents(ABSPATH . "wp-config.php");
        $config = preg_replace("@( ?)(define)( ?)(\()( ?)([\'\"])$const([\'\"])( ?)(,)( ?)(0|1|true|false|\d{1,10})( ?)(\))( ?);@i", "", $config);
        $config = $this->clean_lines_wp_config($config);

        $wp_filesystem->put_contents(ABSPATH . $slash . "wp-config.php", $config);
    }

    public function add_create_config_put($method, $msg, $bool): object
    {
        global $wp_filesystem;
        $return = new stdClass();
        $return->status = true;
        $this->delete_config_put($method, $msg, $bool);

        if ($wp_filesystem->exists(ABSPATH . "wp-config.php") && is_writable(ABSPATH . "wp-config.php")) {
            $this->add_wp_config_put('', "$method", $bool);

        } else if ($wp_filesystem->exists(dirname(ABSPATH) . "/wp-config.php") && is_writable(dirname(ABSPATH) . "/wp-config.php")) {
            $this->add_wp_config_put('', "$method", $bool);
        } else {
            $return->msg = "$msg konnte nicht erstellt werden!";
            $return->status = false;
            return $return;
        }
        return $return;
    }

    public function delete_config_put($method, $msg, $bool): object
    {
        global $wp_filesystem;
        $return = new stdClass();
        $return->status = true;

        if ($wp_filesystem->exists(ABSPATH . "wp-config.php") && is_writable(ABSPATH . "wp-config.php")) {
            $this->wp_config_delete('', "$method", $bool);
        } else if ($wp_filesystem->exists(dirname(ABSPATH) . "/wp-config.php") && is_writable(dirname(ABSPATH) . "/wp-config.php")) {
            $this->wp_config_delete('/', "$method", $bool);
        } else if ($wp_filesystem->exists(ABSPATH . "wp-config.php") && !is_writable(ABSPATH . "wp-config.php")) {
            $return->msg = "$msg konnte nicht gelöscht werden!";
            $return->status = false;
            return $return;
        } else if ($wp_filesystem->exists(dirname(ABSPATH) . "/wp-config.php") && !is_writable(dirname(ABSPATH) . "/wp-config.php")) {
            $return->msg = "$msg konnte nicht gelöscht werden!";
            $return->status = false;
            return $return;
        } else {
            $return->msg = "$msg konnte nicht gelöscht werden!";
            $return->status = false;
            return $return;
        }

        return $return;
    }

    public function clean_lines_wp_config($config): string
    {
        return preg_replace('/^[\t ]*\n/im', '', $config);
    }

    public function theme_activate_mu_plugin(): void
    {
        global $wp_filesystem;
        if( ! $wp_filesystem ){
            require_once ABSPATH . 'wp-admin/includes/file.php';
            WP_Filesystem();
        }
        $muDir = ABSPATH . 'wp-content' . DIRECTORY_SEPARATOR . 'mu-plugins';
        if (!$wp_filesystem->is_dir($muDir)) {
            $wp_filesystem->mkdir($muDir, 0777);
        }
        $filePath = $muDir . DIRECTORY_SEPARATOR . '000-set-debug-level.php';
        if (!$wp_filesystem->exists($filePath)) {
            $wp_filesystem->put_contents($filePath, $this->create_mu_plugin());
        }
    }

    public function theme_deactivate_mu_plugin(): void
    {
        global $wp_filesystem;
        $muDir = ABSPATH . 'wp-content' . DIRECTORY_SEPARATOR . 'mu-plugins';
        $filePath = $muDir . DIRECTORY_SEPARATOR . '000-set-debug-level.php';
        if ($wp_filesystem->exists($filePath)) {
            $wp_filesystem->delete($filePath);
        }
    }

    protected function create_mu_plugin(): string
    {
        return '
      <?php
      /**
      * Plugin Name: Hummelt Theme v3 Control debug level
      */
      error_reporting( E_ALL & ~E_NOTICE & ~E_DEPRECATED );';
    }

    public function fn_get_osm_json_data($query = '', $format = 'json', $polygon_geojson = 1, $addressdetails = 0, $limit = 1): object
    {
        $return = new stdClass();
        $return->status = false;

        // Prüfen, ob eine Query übergeben wurde
        if (!$query) {
            return $return;
        }

        // URL erstellen
        $url = sprintf(
            'https://nominatim.openstreetmap.org/search?q=%s&format=%s&polygon_geojson=%d&addressdetails=%d&limit=%d',
            urlencode($query),
            $format,
            $polygon_geojson,
            $addressdetails,
            $limit
        );

        // HTTP-Request mit wp_remote_get
        $response = wp_remote_get($url, [
            'headers' => [
                'User-Agent' => 'XlsxReaderAddressScript 3.7.6',
            ],
        ]);

        // Überprüfen, ob die Anfrage erfolgreich war
        if (is_wp_error($response)) {
            return $return;
        }

        // HTTP-Statuscode prüfen
        $status_code = wp_remote_retrieve_response_code($response);
        if ($status_code !== 200) {
            return $return;
        }

        // Antwortdaten extrahieren
        $body = wp_remote_retrieve_body($response);
        if (!$body) {
            return $return;
        }

        // JSON-Daten dekodieren
        $data = json_decode($body, true);
        if (!$data) {
            return $return;
        }

        // GeoJSON erstellen
        if ($limit == 1) {
            if (isset($data[0])) {
                $geo_json = json_encode($data[0]);
            } else {
                return $return;
            }
        } else {
            $geo_json = json_encode($data);
        }

        // Rückgabe vorbereiten
        $return->geo_json = $geo_json;
        $return->status = true;

        return $return;
    }



   public function hashPassword(string $password): string
    {
        return password_hash($password, PASSWORD_DEFAULT);
    }

   public function verifyPassword(string $password, string $passwordHash): bool
    {
        return password_verify($password, $passwordHash);
    }

    public function fn_compress_string(string $string): string
    {
        if (!$string) {
            return $string;
        }
        return preg_replace(['/<!--(.*)-->/Uis', "/[[:blank:]]+/"], ['', ' '], str_replace(["\n", "\r", "\t"], '', $string));
    }

    public function fnValidateGeoJSON($geojson): bool
    {
        // Prüfen, ob die Basisfelder vorhanden sind
        if (!isset($geojson['geojson']['type']) || !isset($geojson['geojson']['coordinates'])) {
            return false;
        }

        $type = $geojson['geojson']['type'];
        $coordinates = $geojson['geojson']['coordinates'];

        switch ($type) {
            case 'Point':
                // Ein einzelnes Koordinatenpaar [lon, lat]
                return is_array($coordinates) && count($coordinates) === 2 && is_numeric($coordinates[0]) && is_numeric($coordinates[1]);

            case 'MultiPoint':
                // Ein Array von Koordinatenpaaren [[lon, lat], ...]
                return is_array($coordinates) && array_reduce($coordinates, function ($carry, $point) {
                        return $carry && is_array($point) && count($point) === 2 && is_numeric($point[0]) && is_numeric($point[1]);
                    }, true);

            case 'LineString':
                // Ein Array von mindestens zwei Koordinatenpaaren [[lon, lat], ...]
                return is_array($coordinates) && count($coordinates) >= 2 && array_reduce($coordinates, function ($carry, $point) {
                        return $carry && is_array($point) && count($point) === 2 && is_numeric($point[0]) && is_numeric($point[1]);
                    }, true);

            case 'MultiLineString':
                // Ein Array von LineStrings [[[lon, lat], ...], ...]
                return is_array($coordinates) && array_reduce($coordinates, function ($carry, $line) {
                        return $carry && is_array($line) && count($line) >= 2 && array_reduce($line, function ($carryLine, $point) {
                                return $carryLine && is_array($point) && count($point) === 2 && is_numeric($point[0]) && is_numeric($point[1]);
                            }, true);
                    }, true);

            case 'Polygon':
                // Ein Array von Ringen [[[lon, lat], ...], ...]
                return is_array($coordinates) && array_reduce($coordinates, function ($carry, $ring) {
                        return $carry && is_array($ring) && count($ring) >= 4 && $ring[0] === end($ring) && array_reduce($ring, function ($carryRing, $point) {
                                return $carryRing && is_array($point) && count($point) === 2 && is_numeric($point[0]) && is_numeric($point[1]);
                            }, true);
                    }, true);

            case 'MultiPolygon':
                // Ein Array von Polygonen [[[[lon, lat], ...], ...], ...]
                return is_array($coordinates) && array_reduce($coordinates, function ($carry, $polygon) {
                        return $carry && is_array($polygon) && array_reduce($polygon, function ($carryPolygon, $ring) {
                                return $carryPolygon && is_array($ring) && count($ring) >= 4 && $ring[0] === end($ring) && array_reduce($ring, function ($carryRing, $point) {
                                        return $carryRing && is_array($point) && count($point) === 2 && is_numeric($point[0]) && is_numeric($point[1]);
                                    }, true);
                            }, true);
                    }, true);

            default:
                return false; // Typ nicht unterstützt
        }
    }

    public function fnFormatGeoJSONCoordinates(array $coordinates, string $type): array
    {
        switch ($type) {
            case 'Point':
                // Einzelnes Koordinatenpaar [lon, lat]
                if (count($coordinates) === 2 && isset($coordinates[0], $coordinates[1])) {
                    return [$coordinates[1], $coordinates[0]]; // Umkehrung von [lat, lon] zu [lon, lat]
                }
                throw new InvalidArgumentException("Ungültige Koordinaten für Point.");

            case 'MultiPoint':
                // Mehrere Koordinaten [[lat, lon], ...]
                return array_map(function ($point) {
                    if (count($point) === 2 && isset($point[0], $point[1])) {
                        return [$point[1], $point[0]]; // Umkehrung von [lat, lon] zu [lon, lat]
                    }
                    throw new InvalidArgumentException("Ungültige Koordinaten für MultiPoint.");
                }, $coordinates);

            case 'LineString':
                // Eine Linie mit mehreren Punkten [[lat, lon], [lat, lon], ...]
                return array_map(function ($point) {
                    if (count($point) === 2 && isset($point[0], $point[1])) {
                        return [$point[1], $point[0]]; // Umkehrung von [lat, lon] zu [lon, lat]
                    }
                    throw new InvalidArgumentException("Ungültige Koordinaten für LineString.");
                }, $coordinates);

            case 'MultiLineString':
                // Mehrere Linien [[[lat, lon], ...], [[lat, lon], ...]]
                return array_map(function ($line) {
                    return array_map(function ($point) {
                        if (count($point) === 2 && isset($point[0], $point[1])) {
                            return [$point[1], $point[0]]; // Umkehrung von [lat, lon] zu [lon, lat]
                        }
                        throw new InvalidArgumentException("Ungültige Koordinaten für MultiLineString.");
                    }, $line);
                }, $coordinates);

            case 'Polygon':
                // Ein Polygon mit Ringen [[[lat, lon], ...]]
                return array_map(function ($ring) {
                    // Jeder Ring sollte geschlossen sein (erster und letzter Punkt identisch)
                    $formattedRing = array_map(function ($point) {
                        if (count($point) === 2 && isset($point[0], $point[1])) {
                            return [$point[1], $point[0]]; // Umkehrung von [lat, lon] zu [lon, lat]
                        }
                        throw new InvalidArgumentException("Ungültige Koordinaten für Polygon.");
                    }, $ring);

                    // Schließe den Ring, falls nicht geschlossen
                    if ($formattedRing[0] !== end($formattedRing)) {
                        $formattedRing[] = $formattedRing[0];
                    }

                    return $formattedRing;
                }, $coordinates);

            case 'MultiPolygon':
                // Mehrere Polygone [[[[lat, lon], ...]], [[[lat, lon], ...]]]
                return array_map(function ($polygon) {
                    return array_map(function ($ring) {
                        // Jeder Ring sollte geschlossen sein (erster und letzter Punkt identisch)
                        $formattedRing = array_map(function ($point) {
                            if (count($point) === 2 && isset($point[0], $point[1])) {
                                return [$point[1], $point[0]]; // Umkehrung von [lat, lon] zu [lon, lat]
                            }
                            throw new InvalidArgumentException("Ungültige Koordinaten für MultiPolygon.");
                        }, $ring);

                        // Schließe den Ring, falls nicht geschlossen
                        if ($formattedRing[0] !== end($formattedRing)) {
                            $formattedRing[] = $formattedRing[0];
                        }

                        return $formattedRing;
                    }, $polygon);
                }, $coordinates);

            default:
                throw new InvalidArgumentException("Unbekannter GeoJSON-Typ: $type");
        }
    }

    public function fn_hummelt_theme_theme_caps():array
    {
        $current_user = wp_get_current_user();
        $administrator = false;
        if(in_array('administrator', $current_user->roles)) {
            $administrator = true;
        }
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $capabilities = $settings['theme_capabilities'];
        $caps = [];
        foreach ($capabilities as $key => $val) {
            if($administrator){
                $caps[$key] = true;
            } else {
                $caps[$key] = current_user_can($val);
            }
        }

        return $caps;
    }

    public function fn_dashboard_scss_compiler($src, $dest): void
    {
        ///theme-style/scss/theme-custom.scss
        ///theme-style/css/theme-custom.css
        global $themeV3ScssCompiler;
        $themeV3ScssCompiler->scssFile($src)
            ->cssFile($dest)
            ->addModifiedCheckTheme()
            ->addModifiedCheck(get_template_directory() . $src, false)
            ->compile();
    }

    public function order_by_args($array, $key, $order)
    {
        switch ($order) {
            case'1':
                usort($array, fn($a, $b) => $a[$key] - $b[$key]);
                return array_reverse($array);
            case '2':
                usort($array, fn($a, $b) => $a[$key] - $b[$key]);
                break;
        }

        return $array;
    }

    public function generate_callback_pw($passwordlength = 8, $numNonAlpha = 1, $numNumberChars = 3, $useCapitalLetter = true): string
    {
        $numberChars = '123456789';
        $specialChars = '!$&=;%?*-.+@_';
        //$specialChars = '!$%&=?*-:;.,+~@_';
        $secureChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
        $stack = '';
        $stack = $secureChars;
        if ($useCapitalLetter) {
            $stack .= strtoupper($secureChars);
        }
        $count = $passwordlength - $numNonAlpha - $numNumberChars;
        $temp = str_shuffle($stack);
        $stack = substr($temp, 0, $count);
        if ($numNonAlpha > 0) {
            $temp = str_shuffle($specialChars);
            $stack .= substr($temp, 0, $numNonAlpha);
        }
        if ($numNumberChars > 0) {
            $temp = str_shuffle($numberChars);
            $stack .= substr($temp, 0, $numNumberChars);
        }
        return str_shuffle($stack);
    }

    public function trim_string($string): string
    {
        if (!$string) {
            return '';
        }
        return trim(preg_replace('/\s+/', '', $string));
    }

    public function pregWhitespace($string): string
    {
        if (!$string) {
            return '';
        }
        return trim(preg_replace('/\s+/', ' ', $string));
    }

    public function fn_create_slug($string): string
    {
        return sanitize_title($string);
    }

    public function fn_hummelt_theme_v3_smtp_test(): array
    {
        if(!class_exists('PHPMailer\PHPMailer\SMTP')) {
            require_once ABSPATH . WPINC . '/PHPMailer/PHPMailer.php';
            require_once ABSPATH . WPINC . '/PHPMailer/SMTP.php';
        }
        $conf = get_option(HUMMELT_THEME_V3_SLUG . '/smtp_settings');

        // Validierung der SMTP-Optionen
        if (empty($conf['smtp_host']) || empty($conf['smtp_port']) || empty($conf['email_username']) || empty($conf['email_password'])) {
            return ["status" => false, "msg" => "SMTP-Einstellungen sind unvollständig."];
        }

        $status = false;
        $msg = '';
        $smtp = new SMTP;

        // Debugging aktivieren (optional)
        $smtp->do_debug = SMTP::DEBUG_OFF; // Für mehr Debugging: SMTP::DEBUG_CONNECTION
        $smtp->Debugoutput = function ($str, $level) {
            error_log("SMTP Debug [$level]: $str");
        };

        try {
            // Verbindung herstellen
            if (!$smtp->connect($conf['smtp_host'], $conf['smtp_port'])) {
                throw new Exception('Connect failed');
            }

            // EHLO senden
            if (!$smtp->hello(gethostname())) { // Oder `gethostname()`
                throw new Exception('EHLO failed: ' . $smtp->getError()['error']);
            }

            $e = $smtp->getServerExtList();

            // TLS starten, falls verfügbar
            if (is_array($e) && array_key_exists('STARTTLS', $e)) {
                if (!$smtp->startTLS()) {
                    throw new Exception('Failed to start encryption: ' . $smtp->getError()['error']);
                }
                if (!$smtp->hello(gethostname())) { // EHLO nach STARTTLS wiederholen
                    throw new Exception('EHLO (2) failed: ' . $smtp->getError()['error']);
                }
                $e = $smtp->getServerExtList();
            }

            // Authentifizierung, falls unterstützt
            if (is_array($e) && array_key_exists('AUTH', $e)) {
                if ($smtp->authenticate($conf['email_username'], $conf['email_password'])) {
                    $msg = "Connected successfully!";
                    $status = true;
                } else {
                    throw new Exception('Authentication failed: ' . $smtp->getError()['error']);
                }
            }
        } catch (Exception $e) {
            $msg = 'SMTP error: ' . $e->getMessage();
        }

        // Verbindung beenden
        $smtp->quit(true);

        return ["status" => $status, "msg" => $msg];
    }

    public function fn_get_forms_examples($getFile = ''): array
    {
        global $wp_filesystem;
        $realDirectory  = realpath(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/react-theme-forms/examples');
        if (!$realDirectory || !$wp_filesystem->is_dir($realDirectory)) {
            return [];
        }
        $jsonFiles = [];
        $files = scandir($realDirectory);
        foreach ($files as $file) {
            if (!$wp_filesystem->is_file($realDirectory . DIRECTORY_SEPARATOR . $file)) {
                continue;
            }
            if (pathinfo($file, PATHINFO_EXTENSION) === 'json') {
                $basename = pathinfo($file, PATHINFO_FILENAME);
                $item = [
                    'id' => $basename,
                    'label' => ucwords($basename),
                    'builder' => []
                ];
                if($getFile && strtolower($getFile) == $basename) {
                    $jf = $wp_filesystem->get_contents($realDirectory . DIRECTORY_SEPARATOR . $file);
                    $jf = json_decode($jf, true);
                    $item['builder'] = $jf;
                    return $item;
                }
                $jsonFiles[] = $item;
            }
        }
        $select = [
            'id' => '',
            'label' => 'auswählen',
            'builder' => []
        ];
        return array_merge_recursive([$select], $jsonFiles);
    }

    public function fn_check_local_test_url($url): bool
    {
        // Zerlege die URL in ihre Bestandteile
        $parsed_url = parse_url($url);
        // Host und Pfad extrahieren
        $host = $parsed_url['host'] ?? '';
        $path = $parsed_url['path'] ?? '';

        // Überprüfen, ob die URL `localhost`, eine Subdomain `test`, oder den Ordner `test` enthält
        if ($host === 'localhost') {
            return true;
        } elseif (str_starts_with($host, 'test.')) {
            return true;
        } elseif (str_contains($path, '/test')) {
            return true;
        } else {
            return false;
        }
    }

    public function fn_check_theme_v3_installed_plugins($slug):bool
    {
        $dsSettings = get_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses');
        $plugins = $dsSettings['plugins'];

        foreach ($plugins as $tmp) {
            if($tmp['slug'] == $slug) {
                return $tmp['aktiv'];
            }
        }
        return false;
    }

    public function fn_get_image_attachment($attachment_id):array
    {
        if (!function_exists('wp_get_attachment')) {
            $attachment = get_post($attachment_id);
            return array(
                'alt' => get_post_meta($attachment->ID, '_wp_attachment_image_alt', true),
                'caption' => $attachment->post_excerpt,
                'description' => $attachment->post_content,
                'href' => get_permalink($attachment->ID),
                'src' => $attachment->guid,
                'title' => $attachment->post_title
            );
        }

        return [];
    }

    public function fn_theme_v3_create_sitemap(): void
    {
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $theme_wp_general = $settings['theme_wp_general'];
        $postTypes = ['post', 'page'];
        if($theme_wp_general['sitemap_custom_post_active'] && $theme_wp_general['sitemap_custom_post']) {
            $sitemap_custom_post = explode(';', $theme_wp_general['sitemap_custom_post']);
            $postTypes = array_merge($postTypes, $sitemap_custom_post);
        }

        $posts_for_sitemap = get_posts(array(
            'numberposts' => -1,
            'orderby' => 'modified',
            'order' => 'DESC',
            'post_status' => 'publish',
            'post_type' => $postTypes
        ));
        $sitemap = '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($posts_for_sitemap as $post) {
            setup_postdata($post);
            $lastmod = get_the_modified_time('Y-m-d', $post->ID);
            $sitemap .= "\t" . '<url>' . "\n" .
                "\t\t" . '<loc>' . get_permalink($post->ID) . '</loc>' .
                "\n\t\t" . '<lastmod>' . esc_html($lastmod) . '</lastmod>' .
                "\n\t\t" . '<changefreq>monthly</changefreq>' .
                "\n\t" . '</url>' . "\n";
        }
        $sitemap .= '</urlset>';

        global $wp_filesystem;
        $file = ABSPATH . "sitemap.xml";
        $wp_filesystem->put_contents($file, $sitemap);
    }

    public function get_attachment_image_array($image_id, $size): array
    {
        $return = [];
        if (!$image_id) {
            return $return;
        }
        $image_src = wp_get_attachment_image_src($image_id, $size); // 'large' Größe
        $image_srcset = wp_get_attachment_image_srcset($image_id, $size); // srcset für 'large'
        $image_sizes = wp_get_attachment_image_sizes($image_id, $size); // sizes für 'large'

        if ($image_src) {
            $return = [
                'url' => esc_url($image_src[0]),
                'srcset' => esc_attr($image_srcset),
                'sizes' => esc_attr($image_sizes),
                'alt' => esc_attr(get_post_meta($image_id, '_wp_attachment_image_alt', true))
            ];
        }

        return $return;
    }

}