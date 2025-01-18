<?php

namespace Hummelt\ThemeV3;

use Behat\Transliterator\Transliterator;
use Hummelt_Theme_V3;
use WP_HTTP_Response;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_Error;


class hummelt_theme_v3_dashboard_endpoint extends WP_REST_Controller
{
    use hummelt_theme_v3_options;
    use hummelt_theme_v3_selects;
    use hummelt_theme_v3_settings;

    protected array $capabilities = [];
    protected WP_REST_Request $request;

    private object $responseJson;

    /**
     * Store plugin main class to allow admin access.
     *
     * @since    2.0.0
     * @access   private
     * @var Hummelt_Theme_V3 $main The main class.
     */
    protected Hummelt_Theme_V3 $main;

    public function __construct(Hummelt_Theme_V3 $main)
    {
        $this->main = $main;
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        if ($settings['theme_capabilities']) {
            $this->capabilities = $settings['theme_capabilities'];
        } else {
            $this->capabilities = [];
        }
    }

    /**
     * Register the routes for the objects of the controller.
     */
    public function register_routes(): void
    {
        $namespace = 'theme-v3-dashboard/v' . HUMMELT_THEME_V3_VERSION;
        $base = '/';


        @register_rest_route(
            $namespace,
            $base,
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_registered_items'),
                'permission_callback' => array($this, 'permissions_check')
            )
        );
        @register_rest_route(
            $namespace,
            $base . '(?P<settings>[\S^/]+)',
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'hummelt_theme_v3_get_settings_api_rest_endpoint'),
                'permission_callback' => array($this, 'permissions_check')
            )
        );
    }

    public function get_registered_items(): WP_Error|WP_REST_Response|WP_HTTP_Response
    {
        $data = [];
        return rest_ensure_response($data);
    }

    public function hummelt_theme_v3_get_settings_api_rest_endpoint(WP_REST_Request $request): WP_Error|WP_HTTP_Response|WP_REST_Response
    {
        //$response = new WP_REST_Response();
        $isNonce = wp_verify_nonce(
            $request->get_header('X-WP-Nonce'),
            'wp_rest'
        );

        if (!$isNonce) {
            return new WP_Error(
                'rest_permission_error',
                'Sorry Sie haben keine Berechtigung Theme-Einstellungen zu bearbeiten. (rest-' . __LINE__ . ')',
                array('status' => 403)
            );
        }

        $method = $request->get_param('method');
        if (!$method) {
            return new WP_Error('rest_update_failed', __('Method not found.'), array('status' => 404));
        }
        $this->responseJson = (object)['status' => false, 'msg' => gmdate('H:i:s', current_time('timestamp')), 'type' => $method];


        if (!method_exists($this, $method)) {
            return new WP_Error('rest_failed', __('API Method not found.'), array('status' => 404, 'msg' => gmdate('H:i:s', current_time('timestamp')), 'type' => $method));
        }
        $this->request = $request;
        $return = call_user_func_array(self::class . '::' . $method, []);
        return rest_ensure_response($return);
    }


    private function get_optionen_settings(): object
    {

        if (!$this->main->current_user_can_by_role('theme-settings')) {
            return new WP_Error(
                'rest_permission_error',
                'Sorry Sie haben keine Berechtigung Theme-Einstellungen zu bearbeiten. (rest-' . __LINE__ . ')',
                array('status' => 403)
            );
        }

        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $logo_image = $settings['theme_wp_general']['logo_image'];
        $login_image = $settings['theme_wp_general']['login_image'];
        $favicon_id = $settings['theme_wp_general']['favicon_id'];
        $handy_menu_image_id = $settings['theme_wp_general']['handy_menu_image_id'];
        $settings['theme_wp_general']['logo_image_url'] = '';
        $settings['theme_wp_general']['login_image_url'] = '';
        $settings['theme_wp_general']['favicon_image_url'] = '';
        $settings['theme_wp_general']['handy_menu_image_url'] = '';


        // print_r($user->roles);

        $editor = [
            'palette' => [],
            'layout' => []

        ];
        global $wp_filesystem;
        $palette = [];
        $themeJson = HUMMELT_THEME_V3_JSON;
        if ($wp_filesystem->is_file($themeJson)) {
            $editorJson = json_decode($wp_filesystem->get_contents($themeJson), true);
            $editorJson = $editorJson['settings'] ?? [];
            $color = $editorJson['color'] ?? null;
            if ($color) {
                $palette = $color['palette'] ?? [];
            }
            $editor = [
                'palette' => $palette,
                'layout' => $editorJson['layout']

            ];
        }
        if ($logo_image) {
            $logo = wp_get_attachment_image_src($logo_image, 'medium');
            if ($logo) {
                $settings['theme_wp_general']['logo_image_url'] = $logo[0];
            }
        }
        if ($login_image) {
            $logo = wp_get_attachment_image_src($login_image, 'medium');
            $settings['theme_wp_general']['login_image_url'] = $logo[0];
        }
        if ($favicon_id) {
            $logo = wp_get_attachment_image_src($favicon_id, 'large');
            $settings['theme_wp_general']['favicon_image_url'] = $logo[0];
        }
        if ($handy_menu_image_id) {
            $logo = wp_get_attachment_image_src($handy_menu_image_id, 'large');
            $settings['theme_wp_general']['handy_menu_image_url'] = $logo[0];
        }
        $theme_capabilities = $this->get_theme_default_settings('theme_capabilities');
        $capabilities = [];
        foreach ($theme_capabilities as $key => $val) {
            $label = str_replace('-', ' ', $key);
            $item = [
                'type' => $key,
                'label' => ucwords($label),
            ];
            $capabilities[] = $item;
        }

        $fontArr = ['font_headline', 'theme_font', 'top_footer'];
        $themeDesign = [];
        foreach ($settings['theme_design'] as $key => $design) {
            $designArr = [];
            if (in_array($key, $fontArr)) {
                foreach ($design as $tmp) {
                    if ($tmp['font-family']) {
                        $fontStil = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_font_by_args', $tmp['font-family']);
                        if ($fontStil) {
                            $tmp['stil_select'] = $fontStil['fontData'];
                        } else {
                            $tmp['stil_select'] = [];
                        }
                    } else {
                        $tmp['stil_select'] = [];
                    }
                    $designArr[] = $tmp;
                }
            } else {
                $designArr = $design;
            }
            $themeDesign[$key] = $designArr;
        }
        $selects = [
            'sidebar' => apply_filters(HUMMELT_THEME_V3_SLUG . '/get_sidebars', null),
            'pages' => apply_filters(HUMMELT_THEME_V3_SLUG . '/get_pages', null),
            'header' => apply_filters(HUMMELT_THEME_V3_SLUG . '/get_header', null),
            'footer' => apply_filters(HUMMELT_THEME_V3_SLUG . '/get_footer', null),
            'breakpoints' => $this->menu_breakpoints_select()
        ];

        $menu = $this->option_sidebar_menu();
        $menuArr = [];
        foreach ($menu as $tmp) {
            if (isset($tmp['cap']) && !$this->main->current_user_can_by_role($tmp['cap'])) {
                continue;
            }
            $subArr = [];
            foreach ($tmp['sub'] as $sub) {
                if (isset($sub['cap']) && !$this->main->current_user_can_by_role($sub['cap'])) {
                    continue;
                }
                $subArr[] = $sub;
            }
            $tmp['sub'] = $subArr;
            $menuArr[] = $tmp;
        }
        $settings['theme_design'] = $themeDesign;
        $this->responseJson->selects = $selects;
        $this->responseJson->fonts = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_font_by_args', null);
        $this->responseJson->record = $settings;
        $this->responseJson->capabilities = $capabilities;
        $this->responseJson->select_user_role = $this->select_user_role();
        $this->responseJson->menu = $menuArr;
        $this->responseJson->editor = $editor;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function set_editor_layout(): object
    {
        $data = $this->request->get_param('data');
        if (!$data) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        global $wp_filesystem;
        $themeJson = HUMMELT_THEME_V3_JSON;
        if ($wp_filesystem->is_file($themeJson)) {
            $editorJson = json_decode($wp_filesystem->get_contents($themeJson), true);
            $layout = $editorJson['settings']['layout'];
            $layout['contentSize'] = filter_var($data['contentSize'], FILTER_UNSAFE_RAW);
            $layout['wideSize'] = filter_var($data['wideSize'], FILTER_UNSAFE_RAW);
            $editorJson['settings']['layout'] = $layout;
            $editorJson = json_encode($editorJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);
            $wp_filesystem->put_contents($themeJson, $editorJson);
            $this->responseJson->status = true;
        }
        return $this->responseJson;
    }

    private function gutenberg_color_handle(): object
    {
        $bezeichnung = filter_var($this->request->get_param('bezeichnung'), FILTER_UNSAFE_RAW);
        $handle = filter_var($this->request->get_param('handle'), FILTER_UNSAFE_RAW);
        $slug = filter_var($this->request->get_param('slug'), FILTER_UNSAFE_RAW);
        $inColor = filter_var($this->request->get_param('color'), FILTER_UNSAFE_RAW);
        if (!$bezeichnung || !$handle) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        global $wp_filesystem;
        $themeJson = HUMMELT_THEME_V3_JSON;
        if (!$wp_filesystem->is_file($themeJson)) {
            $this->responseJson->msg = 'theme.json nicht gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }

        $editorJson = json_decode($wp_filesystem->get_contents($themeJson), true);
        $settings = $editorJson['settings'];
        $color = $settings['color'] ?? null;
        if (!$color) {
            $this->responseJson->msg = 'theme.json nicht gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        if (!isset($color['palette'])) {
            $this->responseJson->msg = 'theme.json nicht gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }


        $palette = $color['palette'];

        if ($handle == 'insert') {
            $colorSlug = Transliterator::urlize($bezeichnung, '-');
            foreach ($palette as $tmp) {
                if ($tmp['slug'] == $colorSlug) {
                    $bez = $bezeichnung . '_' . uniqid();
                    $colorSlug = Transliterator::urlize($bez, '-');
                    break;
                }
            }
            $add = [
                'slug' => $colorSlug,
                'color' => '#42445a',
                'name' => $bezeichnung
            ];
            $palette = array_merge_recursive($palette, [$add]);
        } else {
            $paletteArr = [];
            foreach ($palette as $tmp) {
                if ($tmp['slug'] == $slug) {
                    $tmp['name'] = $bezeichnung;
                    $tmp['color'] = $inColor;
                }
                $paletteArr[] = $tmp;
            }
            $palette = $paletteArr;
        }
        $editorJson['settings']['color']['palette'] = $palette;
        $editorJson = json_encode($editorJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);
        $wp_filesystem->put_contents($themeJson, $editorJson);

        $this->responseJson->palette = $palette;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function reset_gutenberg_settings(): object
    {
        $src = HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg' . DIRECTORY_SEPARATOR . 'theme.json';
        $dest = HUMMELT_THEME_V3_JSON;
        global $wp_filesystem;
        if ($wp_filesystem->is_file($src)) {
            $wp_filesystem->copy($src, $dest, true);
        }
        $editor = [
            'palette' => [],
            'layout' => []
        ];
        $palette = [];
        if ($wp_filesystem->is_file($dest)) {
            $editorJson = json_decode($wp_filesystem->get_contents($dest), true);
            $editorJson = $editorJson['settings'] ?? [];
            $color = $editorJson['color'] ?? null;
            if ($color) {
                $palette = $color['palette'] ?? [];
            }
            $editor = [
                'palette' => $palette,
                'layout' => $editorJson['layout']

            ];
        }
        $this->responseJson->editor = $editor;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_gutenberg_color(): object
    {
        $slug = filter_var($this->request->get_param('slug'), FILTER_UNSAFE_RAW);

        if (!$slug) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        global $wp_filesystem;
        $themeJson = HUMMELT_THEME_V3_JSON;
        if (!$wp_filesystem->is_file($themeJson)) {
            $this->responseJson->msg = 'theme.json nicht gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }

        $editorJson = json_decode($wp_filesystem->get_contents($themeJson), true);
        $settings = $editorJson['settings'];
        $color = $settings['color'] ?? null;
        if (!$color) {
            $this->responseJson->msg = 'theme.json nicht gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        if (!isset($color['palette'])) {
            $this->responseJson->msg = 'theme.json nicht gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }

        $palette = $color['palette'];
        $updPal = [];
        foreach ($palette as $tmp) {
            if ($tmp['slug'] == $slug) {
                continue;
            }
            $updPal[] = $tmp;
        }
        $palette = $updPal;
        $editorJson['settings']['color']['palette'] = $palette;
        $editorJson = json_encode($editorJson, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);
        $wp_filesystem->put_contents($themeJson, $editorJson);
        $this->responseJson->slug = $slug;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function set_general_options(): object
    {
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $data = $this->request->get_param('data');
        if (!$data) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        $theme_wp_general = $settings['theme_wp_general'];
        $favicon_id = 0;

        //print_r($data);
        $theme_wp_general['logo_image'] = filter_var($data['logo_image'], FILTER_VALIDATE_INT);
        $theme_wp_general['top_menu_aktiv'] = filter_var($data['top_menu_aktiv'], FILTER_VALIDATE_BOOLEAN);

        $theme_wp_general['logo_menu_option'] = filter_var($data['logo_menu_option'], FILTER_VALIDATE_INT);
        $theme_wp_general['logo_menu_text'] = filter_var($data['logo_menu_text'], FILTER_UNSAFE_RAW);

        $theme_wp_general['top_area_container'] = filter_var($data['top_area_container'], FILTER_UNSAFE_RAW);
        $theme_wp_general['menu_container'] = filter_var($data['menu_container'], FILTER_UNSAFE_RAW);
        $theme_wp_general['main_container'] = filter_var($data['main_container'], FILTER_UNSAFE_RAW);
        $theme_wp_general['info_footer_container'] = filter_var($data['info_footer_container'], FILTER_UNSAFE_RAW);
        $theme_wp_general['menu_breakpoint'] = filter_var($data['menu_breakpoint'], FILTER_UNSAFE_RAW);
        $theme_wp_general['menu_vertical'] = filter_var($data['menu_vertical'], FILTER_UNSAFE_RAW);
        $theme_wp_general['login_image'] = filter_var($data['login_image'], FILTER_VALIDATE_INT);
        $theme_wp_general['fix_header'] = filter_var($data['fix_header'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_general['fix_footer'] = filter_var($data['fix_footer'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_general['info_footer_active'] = filter_var($data['info_footer_active'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_general['widget_footer_active'] = filter_var($data['widget_footer_active'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_general['widget_footer_container'] = filter_var($data['widget_footer_container'], FILTER_UNSAFE_RAW);
        $theme_wp_general['widget_footer_breakpoint'] = filter_var($data['widget_footer_breakpoint'], FILTER_UNSAFE_RAW);
        $theme_wp_general['scroll_top'] = filter_var($data['scroll_top'], FILTER_VALIDATE_BOOLEAN);

        $theme_wp_general['handy_menu_image_active'] = filter_var($data['handy_menu_image_active'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_general['handy_menu_image_id'] = filter_var($data['handy_menu_image_id'], FILTER_VALIDATE_INT);
        $theme_wp_general['handy_menu_option'] = filter_var($data['handy_menu_option'], FILTER_VALIDATE_INT);
        $theme_wp_general['handy_menu_text'] = filter_var($data['handy_menu_text'], FILTER_UNSAFE_RAW);
        $theme_wp_general['logo_size_mobil_menu'] = filter_var($data['logo_size_mobil_menu'], FILTER_VALIDATE_INT);

        $theme_wp_general['login_img_aktiv'] = filter_var($data['login_img_aktiv'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_general['login_img_width'] = filter_var($data['login_img_width'], FILTER_VALIDATE_INT);
        $theme_wp_general['login_img_height'] = filter_var($data['login_img_height'], FILTER_VALIDATE_INT);
        $theme_wp_general['logo_size'] = filter_var($data['logo_size'], FILTER_VALIDATE_INT);
        $theme_wp_general['logo_size_mobil'] = filter_var($data['logo_size_mobil'], FILTER_VALIDATE_INT);
        $theme_wp_general['logo_size_login'] = filter_var($data['logo_size_login'], FILTER_VALIDATE_INT);
        $theme_wp_general['logo_breakpoint'] = filter_var($data['logo_breakpoint'], FILTER_VALIDATE_INT);
        $favicon_id = filter_var($data['favicon_id'], FILTER_VALIDATE_INT);
        $theme_wp_general['menu'] = filter_var($data['menu'], FILTER_VALIDATE_INT);
        $theme_wp_general['edit_link'] = filter_var($data['edit_link'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_general['fw_top'] = filter_var($data['fw_top'], FILTER_VALIDATE_INT);
        $theme_wp_general['fw_bottom'] = filter_var($data['fw_bottom'], FILTER_VALIDATE_INT);
        $theme_wp_general['fw_left'] = filter_var($data['fw_left'], FILTER_VALIDATE_INT);
        $theme_wp_general['fw_right'] = filter_var($data['fw_right'], FILTER_VALIDATE_INT);
        $theme_wp_general['login_logo_url'] = filter_var($data['login_logo_url'], FILTER_VALIDATE_URL);
        $theme_wp_general['bottom_area_text'] = filter_var($data['bottom_area_text'], FILTER_UNSAFE_RAW);
        $theme_wp_general['bottom_area_css'] = filter_var($data['bottom_area_css'], FILTER_UNSAFE_RAW);
        $theme_wp_general['preloader_aktiv'] = filter_var($data['preloader_aktiv'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_general['sitemap_post'] = filter_var($data['sitemap_post'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_general['sitemap_page'] = filter_var($data['sitemap_page'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_general['woocommerce_aktiv'] = filter_var($data['woocommerce_aktiv'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_general['woocommerce_sidebar'] = filter_var($data['woocommerce_sidebar'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_general['social_type'] = filter_var($data['social_type'], FILTER_VALIDATE_INT);
        $theme_wp_general['social_symbol_color'] = filter_var($data['social_symbol_color'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_general['social_extra_css'] = filter_var($data['social_extra_css'], FILTER_UNSAFE_RAW);
        $theme_wp_general['social_kategorie'] = filter_var($data['social_kategorie'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_general['social_author'] = filter_var($data['social_author'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_general['social_archiv'] = filter_var($data['social_archiv'] ?? false, FILTER_VALIDATE_BOOLEAN);

        $template_options = $data['template_options'];
        //  print_r($template_options);
        $template_options = array_map(function ($a) {
            $a['active'] = filter_var($a['active'], FILTER_VALIDATE_BOOLEAN);
            $a['id'] = filter_var($a['id'], FILTER_UNSAFE_RAW);
            $a['type'] = filter_var($a['type'], FILTER_UNSAFE_RAW);
            $a['label'] = filter_var($a['label'], FILTER_UNSAFE_RAW);
            $a['show_sidebar'] = filter_var($a['show_sidebar'], FILTER_VALIDATE_BOOLEAN);
            $a['select_sidebar'] = filter_var($a['select_sidebar'], FILTER_VALIDATE_INT);
            $a['show_kategorie'] = filter_var($a['show_kategorie'], FILTER_VALIDATE_BOOLEAN);
            $a['show_post_date'] = filter_var($a['show_post_date'], FILTER_VALIDATE_BOOLEAN);
            $a['show_post_author'] = filter_var($a['show_post_author'], FILTER_VALIDATE_BOOLEAN);
            $a['show_post_kommentar'] = filter_var($a['show_post_kommentar'], FILTER_VALIDATE_BOOLEAN);
            $a['show_post_tags'] = filter_var($a['show_post_tags'], FILTER_VALIDATE_BOOLEAN);
            $a['show_post_image'] = filter_var($a['show_post_image'], FILTER_VALIDATE_BOOLEAN);
            $a['select_header'] = filter_var($a['select_header'], FILTER_VALIDATE_INT);
            $a['select_footer'] = filter_var($a['select_footer'], FILTER_VALIDATE_INT);
            return $a;
        }, $template_options);

        $theme_wp_general['template_options'] = $template_options;
        $theme_wp_general['hupa_select_404'] = filter_var($data['hupa_select_404'], FILTER_VALIDATE_INT);
        $theme_wp_general['post_breadcrumb'] = filter_var($data['post_breadcrumb'], FILTER_VALIDATE_BOOLEAN);

        if ($favicon_id) {
            if ($favicon_id != $theme_wp_general['favicon_id']) {
                do_action(HUMMELT_THEME_V3_SLUG . '/hummelt_theme_v3_add_favicon', $favicon_id);
            }
        } else {
            do_action(HUMMELT_THEME_V3_SLUG . '/hummelt_theme_v3_delete_custom_favicon');
        }
        $theme_wp_general['favicon_id'] = $favicon_id;

        $settings['theme_wp_general'] = $theme_wp_general;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function set_wp_options(): object
    {
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $data = $this->request->get_param('data');
        if (!$data) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        $dataOptions = $data['theme_wp_optionen'];
        $dataCapabilities = $data['theme_capabilities'];


        $theme_wp_optionen = $settings['theme_wp_optionen'];
        $theme_capabilities = $settings['theme_capabilities'];

        $theme_wp_optionen['svg_upload'] = filter_var($dataOptions['svg_upload'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_optionen['disabled_wp_layout'] = filter_var($dataOptions['disabled_wp_layout'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_optionen['gutenberg_active'] = filter_var($dataOptions['gutenberg_active'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_optionen['gutenberg_widget_active'] = filter_var($dataOptions['gutenberg_widget_active'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_optionen['pdf_custom_dir_active'] = filter_var($dataOptions['pdf_custom_dir_active'], FILTER_VALIDATE_BOOLEAN);

        $theme_wp_optionen['disabled_comments'] = filter_var($dataOptions['disabled_comments'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_optionen['disabled_comments_admin_bar'] = filter_var($dataOptions['disabled_comments_admin_bar'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_optionen['disabled_comments_admin_menu'] = filter_var($dataOptions['disabled_comments_admin_menu'], FILTER_VALIDATE_BOOLEAN);

        $theme_wp_optionen['fa_icons_active'] = filter_var($dataOptions['fa_icons_active'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_optionen['material_icons_active'] = filter_var($dataOptions['material_icons_active'], FILTER_VALIDATE_BOOLEAN);
        $theme_wp_optionen['bootscore_fontawesome'] = filter_var($dataOptions['bootscore_fontawesome'], FILTER_VALIDATE_BOOLEAN);

        $theme_capabilities['theme-settings'] = filter_var($dataCapabilities['theme-settings'], FILTER_UNSAFE_RAW);
        $theme_capabilities['theme-tools'] = filter_var($dataCapabilities['theme-tools'], FILTER_UNSAFE_RAW);
        $theme_capabilities['template-settings'] = filter_var($dataCapabilities['template-settings'], FILTER_UNSAFE_RAW);
        $theme_capabilities['wordpress-optionen'] = filter_var($dataCapabilities['wordpress-optionen'], FILTER_UNSAFE_RAW);
        $theme_capabilities['custom-header'] = filter_var($dataCapabilities['custom-header'], FILTER_UNSAFE_RAW);
        $theme_capabilities['custom-footer'] = filter_var($dataCapabilities['custom-footer'], FILTER_UNSAFE_RAW);
        $theme_capabilities['design-vorlagen'] = filter_var($dataCapabilities['design-vorlagen'], FILTER_UNSAFE_RAW);
        $theme_capabilities['font-settings'] = filter_var($dataCapabilities['font-settings'], FILTER_UNSAFE_RAW);
        $theme_capabilities['farben'] = filter_var($dataCapabilities['farben'], FILTER_UNSAFE_RAW);
        $theme_capabilities['gutenberg-layout'] = filter_var($dataCapabilities['gutenberg-layout'], FILTER_UNSAFE_RAW);
        $theme_capabilities['einstellungen'] = filter_var($dataCapabilities['einstellungen'], FILTER_UNSAFE_RAW);
        $theme_capabilities['plugins'] = filter_var($dataCapabilities['plugins'], FILTER_UNSAFE_RAW);
        $theme_capabilities['import'] = filter_var($dataCapabilities['import'], FILTER_UNSAFE_RAW);
        $theme_capabilities['formulare'] = filter_var($dataCapabilities['formulare'], FILTER_UNSAFE_RAW);
        $theme_capabilities['lizenzen'] = filter_var($dataCapabilities['lizenzen'], FILTER_UNSAFE_RAW);
        $theme_capabilities['font-upload'] = filter_var($dataCapabilities['font-upload'], FILTER_UNSAFE_RAW);
        $theme_capabilities['maps-datenschutz'] = filter_var($dataCapabilities['maps-datenschutz'], FILTER_UNSAFE_RAW);
        $theme_capabilities['google-maps-api'] = filter_var($dataCapabilities['google-maps-api'], FILTER_UNSAFE_RAW);
        $theme_capabilities['leaflet'] = filter_var($dataCapabilities['leaflet'], FILTER_UNSAFE_RAW);

        $settings['theme_wp_optionen'] = $theme_wp_optionen;
        $settings['theme_capabilities'] = $theme_capabilities;

        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function set_theme_colors(): object
    {
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $data = $this->request->get_param('data');
        if (!$data) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        $colors = $settings['theme_design']['theme_color'] ?? null;
        if (!$colors) {
            $this->responseJson->msg = 'Farbeinstellungen nicht gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }

        $notString = ['menu_uppercase', 'scroll_btn_active', 'widget_border_aktiv', 'nav_shadow_aktiv'];
        $colors['menu_uppercase'] = filter_var($data['menu_uppercase'], FILTER_VALIDATE_BOOLEAN);
        $colors['scroll_btn_active'] = filter_var($data['scroll_btn_active'], FILTER_VALIDATE_BOOLEAN);
        $colors['widget_border_aktiv'] = filter_var($data['widget_border_aktiv'], FILTER_VALIDATE_BOOLEAN);
        $colors['nav_shadow_aktiv'] = filter_var($data['nav_shadow_aktiv'], FILTER_VALIDATE_BOOLEAN);
        foreach ($data as $key => $val) {
            if (!in_array($key, $notString)) {
                $colors[$key] = filter_var($val, FILTER_UNSAFE_RAW);
            }
        }

        $settings['theme_design']['theme_color'] = $colors;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);
        $this->responseJson->status = true;


        return $this->responseJson;
    }

    private function set_theme_fonts(): object
    {
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $data = $this->request->get_param('data');
        if (!$data) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        $dataHandle = filter_var($data['handle'], FILTER_UNSAFE_RAW);
        $handle = $settings['theme_design'][$dataHandle];
        $handleId = filter_var($data['id'], FILTER_UNSAFE_RAW);
        $fontArr = [];
        if ($handle) {
            foreach ($handle as $tmp) {
                if ($tmp['id'] == $handleId) {
                    if (isset($data['font']['size'])) {
                        $tmp['size'] = filter_var($data['font']['size'], FILTER_VALIDATE_INT);
                    }
                    if (isset($data['font']['size_sm'])) {
                        $tmp['size_sm'] = filter_var($data['font']['size_sm'], FILTER_VALIDATE_INT);
                    }
                    if (isset($data['font']['color'])) {
                        $tmp['color'] = filter_var($data['font']['color'], FILTER_UNSAFE_RAW);
                    }
                    if (isset($data['font']['display'])) {
                        $tmp['display'] = filter_var($data['font']['display'], FILTER_VALIDATE_BOOLEAN);
                    }
                    if (isset($data['font']['show_editor'])) {
                        $tmp['show_editor'] = filter_var($data['font']['show_editor'], FILTER_VALIDATE_BOOLEAN);
                    }
                    if (isset($data['font']['standard'])) {
                        $tmp['standard'] = filter_var($data['font']['standard'], FILTER_VALIDATE_BOOLEAN);
                    }
                    if (isset($data['font']['font-family'])) {
                        $tmp['font-family'] = filter_var($data['font']['font-family'], FILTER_VALIDATE_INT);
                    }
                    if (isset($data['font']['font-style'])) {
                        $tmp['font-style'] = filter_var($data['font']['font-style'], FILTER_UNSAFE_RAW);
                    }
                    if (isset($data['font']['line-height'])) {
                        $tmp['line-height'] = (float)$data['font']['line-height'];
                    }
                }
                $fontArr[] = $tmp;
            }
        }
        $settings['theme_design'][$dataHandle] = $fontArr;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);
        if ($dataHandle == 'font_headline') {
            do_action(HUMMELT_THEME_V3_SLUG . '/headlines_theme_json', $fontArr);
        }


        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_font_style(): object
    {
        $this->responseJson->record = [];
        $family = filter_var($this->request->get_param('family'), FILTER_VALIDATE_INT);
        $this->responseJson->id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        $this->responseJson->handle = filter_var($this->request->get_param('handle'), FILTER_UNSAFE_RAW);
        if (!$family) {
            $this->responseJson->msg = 'Schriftfamilie nicht gefunden';
            return $this->responseJson;
        }
        $font = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_font_by_args', $family);
        if (!$font['fontData']) {
            return $this->responseJson;
        }

        $this->responseJson->family = $family;
        $this->responseJson->status = true;
        $this->responseJson->record = $font['fontData'];
        return $this->responseJson;
    }

    private function font_edit(): object
    {
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $data = $this->request->get_param('data');
        $id = $this->request->get_param('id');
        if (!$data || !$id) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $fonts = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_font_by_args', $id);
        if (!$fonts) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        $fontsData = $fonts['fontData'] ?? null;
        if (!$fontsData) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }

        $fontArr = [];
        foreach ($fontsData as $tmp) {
            if ($tmp['id'] == $data['id']) {
                $tmp['font_weight'] = filter_var($data['font_weight'], FILTER_UNSAFE_RAW);
                $tmp['font_style'] = filter_var($data['font_style'], FILTER_UNSAFE_RAW);
            }
            $fontArr[] = $tmp;
        }
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_data', json_encode($fontArr), (int)$id);
        do_action(HUMMELT_THEME_V3_SLUG . '/theme_hummelt_v3_font_face');
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_font(): object
    {
        $id = filter_var($this->request->get_param('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = 'keine Daten zum löschen gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $args = sprintf('WHERE id=%d', $id);
        $font = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_font_data', $args);
        if (!$font->status) {
            $this->responseJson->msg = 'keine Daten zum löschen gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $font = $font->record;
        $deleteDir = HUMMELT_THEME_V3_FONTS_DIR . $font->designation;
        do_action(HUMMELT_THEME_V3_SLUG . '/delete_font_theme_json', $font->designation);

        apply_filters(HUMMELT_THEME_V3_SLUG . '/delete_font_data', $id);
        global $wp_filesystem;
        $wp_filesystem->rmdir($deleteDir, true);
        do_action(HUMMELT_THEME_V3_SLUG . '/theme_hummelt_v3_font_face');

        $this->responseJson->status = true;
        $this->responseJson->id = $id;
        return $this->responseJson;
    }

    private function get_theme_tools_plugins(): object
    {
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $mapDs = $settings['google_maps_datenschutz'];
        $mapDsArr = [];
        global $themeV3Helper;
        foreach ($mapDs as $tmp) {
            $tmp['map_img_url'] = '';
            if ($tmp['map_img_id']) {
                $image = wp_get_attachment_image_src($tmp['map_img_id'], 'medium');
                if ($image) {
                    $tmp['map_img_url'] = $image[0];
                }
            }
            $mapDsArr[] = $tmp;
        }
        if ($settings['google_maps_api']['map_standard_pin']) {
            $image = wp_get_attachment_image_src($settings['google_maps_api']['map_standard_pin'], 'medium');
            $settings['google_maps_api']['map_standard_url'] = $image[0];
        }
        $pinArr = [];
        foreach ($settings['google_maps_api']['map_pins'] as $pin) {
            if ($pin['custom_pin_img']) {
                $image = wp_get_attachment_image_src($pin['custom_pin_img'], 'medium');
                $pin['custom_pin_url'] = $image[0];
            }
            $pinArr[] = $pin;
        }
        $jsonArr = $settings['google_maps_api']['map_color_schema'];
        if ($jsonArr) {
            $jsonArr = json_decode($jsonArr, true);
            $settings['google_maps_api']['map_color_schema'] = json_encode($jsonArr, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);
        }

        $settings['google_maps_api']['map_pins'] = $pinArr;
        $settings['google_maps_datenschutz'] = $mapDsArr;
        $this->responseJson->menu = $this->tools_plugins_menu();
        $this->responseJson->pages = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_pages', null);
        $this->responseJson->settings = $settings;
        $this->responseJson->osm_tile_layers = $this->osm_tile_layers();
        $this->responseJson->top_area_widgets = $this->top_area_widget_types($settings['theme_top_area']);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_position_top_area(): object
    {
        $data = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        if (!$data) {
            return $this->responseJson;
        }

        $i = 1;
        $data = json_decode($data, true);
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $topArea = $settings['theme_top_area'];
        foreach ($data as $tmp) {
            $slug = filter_var($tmp['slug'], FILTER_UNSAFE_RAW);
            if(isset($topArea[$slug])) {
                $topArea[$slug]['order'] = $i;
            }
             $i++;
        }
        $settings['theme_top_area'] = $topArea;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_top_area(): object
    {
        $slug = filter_var($this->request->get_param('slug'), FILTER_UNSAFE_RAW);
        $data = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        if (!$data || !$slug) {
            return $this->responseJson;
        }
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $topArea = $settings['theme_top_area'];
        $data = json_decode($data, true);
        $css = filter_var($data['css'], FILTER_UNSAFE_RAW);
        $active = filter_var($data['active'], FILTER_VALIDATE_BOOLEAN);
        if (isset($topArea[$slug])) {
            $topArea[$slug]['css'] = $css;
            $topArea[$slug]['active'] = $active;
        }
        $settings['theme_top_area'] = $topArea;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_theme_slider(): object
    {
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $this->responseJson->slider = $settings['slider'];
        $this->responseJson->gallery = $settings['gallery'];
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function add_slider_gallery(): object
    {
        $handle = filter_var($this->request->get_param('handle'), FILTER_UNSAFE_RAW);
        $designation = filter_var($this->request->get_param('designation'), FILTER_UNSAFE_RAW);

        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        if (!isset($settings[$handle])) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }

        if (!$designation) {
            $designation = uniqid();
        }
        $add = [];
        $this->responseJson->handle = $handle;
        if ($handle == 'slider') {
            $add = $this->add_default_slider($designation);
            $this->responseJson->record = $add;
        }
        if ($handle == 'gallery') {
            $add = $this->gallery_default_breakpoints($designation);
            $this->responseJson->record = $add;
        }

        $update = array_merge_recursive($settings[$handle], [$add]);
        $settings[$handle] = $update;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);
        $this->responseJson->msg = 'Element erfolgreich gespeichert.';
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_slider_gallery(): object
    {
        $handle = filter_var($this->request->get_param('handle'), FILTER_UNSAFE_RAW);
        $id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        if (!$handle || !$id) {
            $this->responseJson->msg = 'keine Daten zum löschen gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        if (!isset($settings[$handle])) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $upd = [];
        foreach ($settings[$handle] as $tmp) {
            if ($tmp['id'] == $id) {
                continue;
            }
            $upd[] = $tmp;
        }
        $settings[$handle] = $upd;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);
        $this->responseJson->id = $id;
        $this->responseJson->status = true;
        $this->responseJson->msg = 'Element erfolgreich gelöscht.';
        return $this->responseJson;
    }

    private function get_custom_fields(): object
    {
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $this->responseJson->custom_fields = $settings['custom_fields'];
        $this->responseJson->select_custom_types = $this->select_custom_types();
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function add_custom_field(): object
    {
        $designation = filter_var($this->request->get_param('designation'), FILTER_UNSAFE_RAW);
        $type = filter_var($this->request->get_param('type'), FILTER_UNSAFE_RAW);
        if (!$type || !$designation) {
            $this->responseJson->msg = 'keine Daten gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $custom_fields = $settings['custom_fields'];
        global $themeV3Helper;
        $designation = $themeV3Helper->pregWhitespace($designation);
        $slug = Transliterator::urlize($designation, '-');
        $cfArr = [];
        foreach ($custom_fields as $tmp) {
            if ($tmp['slug'] == $slug) {
                $tmp['slug'] = $tmp['slug'] . '-' . uniqid();
            }
            $cfArr[] = $tmp;
        }
        $add = $this->default_custom_field($designation, $slug, $type);
        $custom_fields = array_merge_recursive($cfArr, [$add]);
        $settings['custom_fields'] = $custom_fields;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);

        $this->responseJson->record = $add;
        $this->responseJson->status = true;
        $this->responseJson->msg = 'Benutzerdefiniertes Feld hinzugefügt.';

        return $this->responseJson;
    }

    private function update_custom_field(): object
    {
        $custom = filter_var($this->request->get_param('custom'), FILTER_UNSAFE_RAW);
        $id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        if (!$custom) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $custom = json_decode($custom, true);
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');

        $checkSlug = function ($slug, $id) use ($settings) {
            $check = false;
            foreach ($settings['custom_fields'] as $tmp) {
                if ($tmp['id'] == $id && $tmp['slug'] != $slug) {
                    $check = true;
                    break;
                }
            }
            if ($check) {
                foreach ($settings['custom_fields'] as $tmp) {
                    if ($tmp['slug'] == $slug) {
                        return true;
                    }
                }
            }
            return false;
        };
        $customArr = [];
        $resSlug = '';
        global $themeV3Helper;
        foreach ($custom as $tmp) {
            $designation = $themeV3Helper->pregWhitespace($tmp['designation']);
            $tmp['slug'] = Transliterator::urlize($designation, '-');
            if ($id && $tmp['id'] == $id) {
                if ($checkSlug($tmp['slug'], $id)) {
                    $tmp['slug'] = $tmp['slug'] . '-' . uniqid();
                }
                $resSlug = $tmp['slug'];
            }

            $customArr[] = $this->sanitize_custom_field($tmp);
        }

        $settings['custom_fields'] = $customArr;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);
        $this->responseJson->status = true;
        $this->responseJson->id = $id;
        $this->responseJson->slug = $resSlug;
        return $this->responseJson;
    }

    private function delete_custom_field(): object
    {
        $id = filter_var($this->request->get_param('field_id'), FILTER_UNSAFE_RAW);
        if (!$id) {
            $this->responseJson->msg = 'keine Daten zum löschen gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');

        $updArr = [];
        foreach ($settings['custom_fields'] as $tmp) {
            if ($tmp['id'] == $id) {
                continue;
            }
            $updArr[] = $tmp;
        }
        $settings['custom_fields'] = $updArr;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);
        $this->responseJson->status = true;
        $this->responseJson->id = $id;
        $this->responseJson->msg = 'Feld erfolgreich gelöscht.';
        return $this->responseJson;

    }

    private function get_icons(): object
    {
        $dir = HUMMELT_THEME_V3_ADMIN_DIR . 'Icons' . DIRECTORY_SEPARATOR;
        global $wp_filesystem;
        $bs = [];
        $md = [];
        $fa = [];

        if ($wp_filesystem->is_file($dir . 'bootstrap-icons.json')) {
            $fontFile = json_decode($wp_filesystem->get_contents($dir . 'bootstrap-icons.json'), true);
            foreach ($fontFile as $key => $val) {
                $id = dechex($val);
                $item = [
                    'id' => $id,
                    'icon' => 'bi bi-' . $key,
                    'title' => $id . '-' . $key,
                ];
                $bs[] = $item;
            }
        }

        if ($wp_filesystem->is_file($dir . 'material-design.json')) {
            $fontFile = json_decode($wp_filesystem->get_contents($dir . 'material-design.json'), true);
            $i = 0;
            foreach ($fontFile as $tmp) {
                $id = $tmp['hex'];
                if ($i < 57) {
                    $name = '_' . $tmp['name'];
                } else {
                    $name = $tmp['name'];
                }
                $item = [
                    'id' => $id,
                    'icon' => 'material-icons ' . $name,
                    'title' => $tmp['category'] . '-' . $id . '-' . $name,
                    'category' => $tmp['category']
                ];
                $md[] = $item;
                $i++;
            }
        }

        if ($wp_filesystem->is_file($dir . 'fa-icons.json')) {
            $fontFile = json_decode($wp_filesystem->get_contents($dir . 'fa-icons.json'), true);
            foreach ($fontFile as $tmp) {
                $id = $tmp['code'];
                $item = [
                    'id' => $id,
                    'icon' => $tmp['icon'],
                    'title' => $id . '-' . $tmp['icon'],
                ];
                $fa[] = $item;
            }
        }
        $this->responseJson->bs = $bs;
        $this->responseJson->md = $md;
        $this->responseJson->fa = $fa;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function add_breakpoint(): object
    {
        $id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        if (!$id) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $slider = $settings['slider'];
        $updArr = [];
        $addBreakpoint = $this->add_default_breakpoint();
        foreach ($slider as $tmp) {
            if ($tmp['id'] == $id) {
                $tmp['breakpoints'] = array_merge_recursive($tmp['breakpoints'], [$addBreakpoint]);
            }
            $updArr[] = $tmp;
        }
        $settings['slider'] = $updArr;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);
        $this->responseJson->id = $id;
        $this->responseJson->breakpoint = $addBreakpoint;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_breakpoint(): object
    {
        $id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        $breakpoint = filter_var($this->request->get_param('breakpoint'), FILTER_UNSAFE_RAW);
        if (!$id || !$breakpoint) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $slider = $settings['slider'];
        $updArr = [];
        foreach ($slider as $tmp) {
            $breakArr = [];
            if ($tmp['id'] == $id) {
                foreach ($tmp['breakpoints'] as $break) {
                    if ($break['id'] == $breakpoint) {
                        continue;
                    }
                    $breakArr[] = $break;
                }
                $tmp['breakpoints'] = $breakArr;
            }
            $updArr[] = $tmp;
        }
        $settings['slider'] = $updArr;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);

        $this->responseJson->id = $id;
        $this->responseJson->breakpoint = $breakpoint;
        $this->responseJson->status = true;
        $this->responseJson->msg = 'Breakpoint gelöscht.';
        return $this->responseJson;
    }

    private function update_slider(): object
    {
        $id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        $data = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        if (!$id || !$data) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }

        $data = json_decode($data, true);
        $data = $this->sanitize_slider($data);
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $slider = $settings['slider'];
        $updArr = [];
        foreach ($slider as $tmp) {
            if ($tmp['id'] == $id) {
                $tmp = $data;
            }
            $updArr[] = $tmp;
        }
        $settings['slider'] = $updArr;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_theme_gallery(): object
    {
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $gallery = $settings['gallery'];
        $this->responseJson->gallery = $gallery;
        $this->responseJson->status = true;
        $this->responseJson->animate_selects = $this->get_animate_option();
        $this->responseJson->select_media_size = $this->selects_image_size();
        return $this->responseJson;
    }

    private function update_gallery(): object
    {
        $id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        $data = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        if (!$id || !$data) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        $data = $this->gallery_sanitize($data);
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $gallery = $settings['gallery'];
        $galUpd = [];
        foreach ($gallery as $tmp) {
            if ($tmp['id'] == $id) {
                $tmp = $data;
            }
            $galUpd[] = $tmp;
        }
        $settings['gallery'] = $galUpd;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    //Todo MAPS
    private function maps_ds_handle(): object
    {
        $handle = filter_var($this->request->get_param('handle'), FILTER_UNSAFE_RAW);
        $data = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        if (!$handle || !$data) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $this->responseJson->handle = $handle;
        $data = json_decode($data, true);
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $mapDs = $settings['google_maps_datenschutz'];

        $map_img_id = filter_var($data['map_img_id'], FILTER_VALIDATE_INT);
        $map_bg_grayscale = filter_var($data['map_bg_grayscale'], FILTER_VALIDATE_BOOLEAN);
        $map_ds_page = filter_var($data['map_ds_page'], FILTER_VALIDATE_INT);
        $button_css = filter_var($data['button_css'], FILTER_UNSAFE_RAW);
        $map_ds_btn_text = filter_var($data['map_ds_btn_text'], FILTER_UNSAFE_RAW);
        $map_ds_text = filter_var($data['map_ds_text'], FILTER_UNSAFE_RAW);
        $ds_bezeichnung = filter_var($data['ds_bezeichnung'], FILTER_UNSAFE_RAW);
        if (!$map_ds_page || !$map_ds_btn_text || !$map_ds_text || !$ds_bezeichnung) {
            $this->responseJson->msg = 'Bitte Eingaben überprüfen. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }

        if ($handle == 'insert') {
            $item = [
                'id' => uniqid(),
                'delete' => true,
                'map_img_id' => $map_img_id,
                'map_bg_grayscale' => $map_bg_grayscale,
                'map_ds_page' => $map_ds_page,
                'button_css' => $button_css,
                'map_ds_btn_text' => $map_ds_btn_text,
                'map_ds_text' => $map_ds_text,
                'ds_bezeichnung' => $ds_bezeichnung
            ];
            $mapDs = array_merge_recursive($mapDs, [$item]);
            $settings['google_maps_datenschutz'] = $mapDs;
            $this->responseJson->record = $item;
        } else {
            $id = filter_var($data['id'], FILTER_UNSAFE_RAW);
            $mapDsArr = [];
            foreach ($mapDs as $tmp) {
                if ($tmp['id'] == $id) {
                    $tmp['map_img_id'] = $map_img_id;
                    $tmp['map_bg_grayscale'] = $map_bg_grayscale;
                    $tmp['map_ds_page'] = $map_ds_page;
                    $tmp['button_css'] = $button_css;
                    $tmp['map_ds_btn_text'] = $map_ds_btn_text;
                    $tmp['map_ds_text'] = $map_ds_text;
                    $tmp['ds_bezeichnung'] = $ds_bezeichnung;
                }
                $mapDsArr[] = $tmp;
                $settings['google_maps_datenschutz'] = $mapDsArr;
            }
            $this->responseJson->id = $id;
        }
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);
        $this->responseJson->status = true;
        $this->responseJson->msg = 'Datenschutz-Einstellungen gespeichert';
        return $this->responseJson;
    }

    private function delete_ds(): object
    {
        $id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        if (!$id) {
            $this->responseJson->msg = 'keine Daten zum Löschen gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $mapDs = $settings['google_maps_datenschutz'];
        $mapDsArr = [];
        foreach ($mapDs as $tmp) {
            if ($tmp['id'] == $id) {
                continue;
            }
            $mapDsArr[] = $tmp;
        }
        $settings['google_maps_datenschutz'] = $mapDsArr;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);
        $this->responseJson->msg = 'Datenschutz erfolgreich gelöscht.';
        $this->responseJson->id = $id;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function gmaps_add_api_pin(): object
    {
        $item = [
            'id' => uniqid(),
            'delete' => true,
            'coords' => '',
            'info_text' => '',
            'custom_pin_check' => false,
            'custom_pin_img' => 0,
            'custom_pin_url' => '',
        ];
        $this->responseJson->record = $item;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function gmaps_api_handle(): object
    {
        $data = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        if (!$data) {
            $this->responseJson->msg = 'keine Daten zum Löschen gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);

        $data['map_apikey'] = filter_var($data['map_apikey'], FILTER_UNSAFE_RAW);
        $data['map_color_schema_check'] = filter_var($data['map_color_schema_check'], FILTER_VALIDATE_BOOLEAN);
        $data['map_color_schema'] = filter_var($data['map_color_schema'], FILTER_UNSAFE_RAW);
        $data['map_standard_pin'] = filter_var($data['map_standard_pin'], FILTER_VALIDATE_INT);
        $data['map_standard_url'] = '';

        if (!$data['map_apikey']) {
            $this->responseJson->msg = 'API-Key überprüfen. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }

        global $themeV3Helper;
        $data['map_color_schema'] = (string)$themeV3Helper->fn_compress_string($data['map_color_schema']);
        if ($data['map_color_schema']) {
            $json = json_decode($data['map_color_schema'], true);
            if (json_last_error() !== JSON_ERROR_NONE || !is_array($json)) {
                $this->responseJson->msg = 'Ungültiges Farbschema (rest-' . __LINE__ . ')';
                return $this->responseJson;
            }
        }

        $data['map_pins'] = array_map(function ($a) {
            $a['id'] = filter_var($a['id'], FILTER_UNSAFE_RAW);
            $a['delete'] = filter_var($a['delete'], FILTER_VALIDATE_BOOLEAN);
            $a['coords'] = filter_var($a['coords'], FILTER_UNSAFE_RAW);
            $a['info_text'] = filter_var($a['info_text'], FILTER_UNSAFE_RAW);
            $a['custom_pin_check'] = filter_var($a['custom_pin_check'], FILTER_VALIDATE_BOOLEAN);
            $a['custom_pin_img'] = filter_var($a['custom_pin_img'], FILTER_VALIDATE_INT);
            $a['custom_pin_url'] = '';
            return $a;
        }, $data['map_pins']);


        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $settings['google_maps_api'] = $data;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);
        $this->responseJson->status = true;
        $this->responseJson->msg = 'Google Maps API erfolgreich gespeichert.';
        return $this->responseJson;
    }

    private function osm_leaflet_handle(): object
    {
        $data = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        $handle = filter_var($this->request->get_param('handle'), FILTER_UNSAFE_RAW);
        if (!$handle || !$data) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $this->responseJson->handle = $handle;
        $data = json_decode($data, true);
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $leaflet = $settings['leaflet'];
        $designation = filter_var($data['designation'], FILTER_UNSAFE_RAW);
        $tile_layer = filter_var($data['tile_layer'], FILTER_UNSAFE_RAW);
        if (!$tile_layer) {
            $tile_layer = 'original';
        }
        if (!$designation) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }

        if ($handle == 'insert') {
            $leaflet = array_merge_recursive($leaflet, [$this->get_leaflet_default($designation)]);
        } else {
            $id = filter_var($data['id'], FILTER_UNSAFE_RAW);
            if (!$id) {
                $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
                return $this->responseJson;
            }

            $leafArr = [];
            foreach ($leaflet as $tmp) {
                if ($tmp['id'] == $id) {
                    $tmp['designation'] = $designation;
                    $tmp['tile_layer'] = $tile_layer;
                }
                $leafArr[] = $tmp;
            }
            $leaflet = $leafArr;
        }
        $settings['leaflet'] = $leaflet;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);
        $this->responseJson->status = true;
        $this->responseJson->msg = 'OSM leaflet erfolgreich gespeichert.';
        $this->responseJson->leaflet = $leaflet;
        return $this->responseJson;
    }

    private function delete_osm_leaflet(): object
    {
        $id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        if (!$id) {
            $this->responseJson->msg = 'keine Daten zum löschen gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }

        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $leaflet = $settings['leaflet'];
        $updArr = [];
        foreach ($leaflet as $tmp) {
            if ($tmp['id'] == $id) {
                continue;
            }
            $updArr[] = $tmp;
        }
        $settings['leaflet'] = $updArr;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);
        $this->responseJson->id = $id;
        $this->responseJson->msg = 'Karte erfolgreich gelöscht.';
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function osm_search_json(): object
    {
        $data = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        $id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        if (!$data || !$id) {
            $this->responseJson->msg = 'keine Daten gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $leaflet = $settings['leaflet'];

        $data = json_decode($data, true);
        $zip = filter_var($data['zip'], FILTER_UNSAFE_RAW);
        $city = filter_var($data['city'], FILTER_UNSAFE_RAW);
        $street = filter_var($data['street'], FILTER_UNSAFE_RAW);
        $hnr = filter_var($data['hnr'], FILTER_UNSAFE_RAW);
        $query = sprintf('%s %s,%s', $street, $hnr, $zip . ' ' . $city);

        $osm = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_osm_json_data', $query);
        if (!$osm->status) {
            $this->responseJson->msg = 'keine Daten gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }

        $osmJson = json_decode($osm->geo_json, true);
        $checkPlaceId = function () use ($leaflet, $id, $osmJson) {
            foreach ($leaflet as $tmp) {
                if ($tmp['id'] == $id) {
                    foreach ($tmp['pins'] as $pin) {
                        if ($pin['geo_json']['place_id'] == $osmJson['geo_json']['place_id']) {
                            return false;
                        }
                    }
                }
            }
            return true;
        };
        if (!$checkPlaceId) {
            $this->responseJson->msg = 'Place ID schon vorhanden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $leafletPin = $this->get_leaflet_default_pin($osmJson);

        $leafletArr = [];
        foreach ($leaflet as $tmp) {
            if ($tmp['id'] == $id) {
                $tmp['pins'] = array_merge_recursive($tmp['pins'], [$leafletPin]);
            }
            $leafletArr[] = $tmp;
        }
        $settings['leaflet'] = $leafletArr;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);

        $this->responseJson->record = $leafletPin;
        $this->responseJson->id = $id;
        $this->responseJson->status = true;
        $this->responseJson->msg = 'GeoJson erfolgreich gespeichert.';

        return $this->responseJson;
    }

    private function leaflet_update_pin(): object
    {
        $data = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        if (!$data) {
            $this->responseJson->msg = 'keine Daten gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }

        $data = json_decode($data, true);
        $leaflet_id = filter_var($data['leaflet_id'], FILTER_UNSAFE_RAW);
        if (!$leaflet_id) {
            $this->responseJson->msg = 'keine Daten gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $pinId = filter_var($data['pin']['id'], FILTER_UNSAFE_RAW);
        if (!$pinId) {
            $this->responseJson->msg = 'keine Daten gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $pinData = $data['pin'];
        $textbox = filter_var($pinData['textbox'], FILTER_UNSAFE_RAW);
        $show_pin = filter_var($pinData['show_pin'], FILTER_VALIDATE_BOOLEAN);
        $polygone_show = filter_var($pinData['polygone_show'], FILTER_VALIDATE_BOOLEAN);
        $active = filter_var($pinData['active'], FILTER_VALIDATE_BOOLEAN);
        $tile_layer = filter_var($pinData['tile_layer'], FILTER_UNSAFE_RAW);
        $polygone_border = filter_var($pinData['polygone_border'], FILTER_UNSAFE_RAW);
        $polygone_fill = filter_var($pinData['polygone_fill'], FILTER_UNSAFE_RAW);
        $polygone_border_width = filter_var($pinData['polygone_border_width'], FILTER_VALIDATE_FLOAT);
        $marker_color = filter_var($pinData['marker_color'], FILTER_UNSAFE_RAW);
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $leaflet = $settings['leaflet'];

        $leafletArr = [];
        foreach ($leaflet as $tmp) {
            if ($tmp['id'] == $leaflet_id) {
                $pinArr = [];
                foreach ($tmp['pins'] as $pin) {
                    if ($pin['id'] == $pinId) {
                        $pin['textbox'] = $textbox;
                        $pin['active'] = $active;
                        $pin['show_pin'] = $show_pin;
                        $pin['polygone_show'] = $polygone_show;
                        $pin['polygone_border'] = $polygone_border;
                        $pin['polygone_fill'] = $polygone_fill;
                        $pin['polygone_border_width'] = $polygone_border_width;
                        $pin['marker_color'] = $marker_color;
                        $pin['tile_layer'] = $tile_layer;
                    }
                    $pinArr[] = $pin;
                }
                $tmp['pins'] = $pinArr;
            }
            $leafletArr[] = $tmp;
        }

        $settings['leaflet'] = $leafletArr;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_leaflet_pin(): object
    {
        $pin_id = filter_var($this->request->get_param('pin_id'), FILTER_UNSAFE_RAW);
        $leaflet_id = filter_var($this->request->get_param('leaflet_id'), FILTER_UNSAFE_RAW);
        if (!$pin_id || !$leaflet_id) {
            $this->responseJson->msg = 'keine Daten zum löschen gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $leaflet = $settings['leaflet'];

        $leafletArr = [];
        foreach ($leaflet as $tmp) {
            if ($tmp['id'] == $leaflet_id) {
                $pinArr = [];
                foreach ($tmp['pins'] as $pin) {
                    if ($pin['id'] == $pin_id) {
                        continue;
                    }
                    $pinArr[] = $pin;
                }
                $tmp['pins'] = $pinArr;
            }
            $leafletArr[] = $tmp;
        }
        $settings['leaflet'] = $leafletArr;
        update_option(HUMMELT_THEME_V3_SLUG . '/settings', $settings);
        $this->responseJson->pin_id = $pin_id;
        $this->responseJson->leaflet_id = $leaflet_id;
        $this->responseJson->status = true;
        $this->responseJson->msg = 'Pin erfolgreich gelöscht.';
        return $this->responseJson;
    }

    //Todo OPTIONEN
    private function get_theme_optionen(): object
    {
        if (!current_user_can($this->capabilities['einstellungen'])) {
            return new WP_Error(
                'rest_permission_error',
                'Sorry Sie haben keine Berechtigung Theme-Einstellungen zu bearbeiten. (rest-' . __LINE__ . ')',
                array('status' => 403)
            );
        }
        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $sortablePosts = apply_filters(HUMMELT_THEME_V3_SLUG . '/sortable_post_types', null);
        $optionen['sortable_post_types'] = $sortablePosts;
        $duplicatePosts = apply_filters(HUMMELT_THEME_V3_SLUG . '/duplicate_post_types', null);
        $optionen['duplicate_post_types'] = $duplicatePosts;
        $optionen['wp_optionen']['wp_optionen_disabled'] = $this->wp_optionen_disabled;
        $optionen['wp_config']['wp_config_disabled'] = $this->wp_config_disabled;
        $optionen['update_msg']['update_msg_disabled'] = $this->update_msg_disabled;
        $optionen['theme_sort_options']['backend_sortable_disabled'] = $this->backend_sortable_disabled;
        $optionen['theme_duplicate_options']['backend_duplicate_disabled'] = $this->backend_duplicate_disabled;
        update_option(HUMMELT_THEME_V3_SLUG . '/optionen', $optionen);
        $this->responseJson->menu = $this->theme_optionen_sidebar();
        $this->responseJson->settings = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $this->responseJson->status = true;
        $this->responseJson->roles = $this->select_user_role();
        return $this->responseJson;
    }

    private function wp_optionen_handle(): object
    {
        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $wpOptionen = $optionen['wp_optionen'];
        $data = $this->request->get_param('data');
        if (!$data) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        $disabled = $data['wp_optionen_disabled'];
        if ($disabled) {
            $this->responseJson->msg = 'keine Berechtigung. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $wpOptionen['wp_disable_wp_cron'] = filter_var($data['wp_disable_wp_cron'], FILTER_VALIDATE_BOOLEAN);
        $wpOptionen['wp_disabled_automatic_update'] = filter_var($data['wp_disabled_automatic_update'], FILTER_VALIDATE_BOOLEAN);
        $wpOptionen['wp_disallow_file_edit'] = filter_var($data['wp_disallow_file_edit'], FILTER_VALIDATE_BOOLEAN);
        $wpOptionen['wp_disallow_file_mods'] = filter_var($data['wp_disallow_file_mods'], FILTER_VALIDATE_BOOLEAN);
        $optionen['wp_optionen'] = $wpOptionen;
        update_option(HUMMELT_THEME_V3_SLUG . '/optionen', $optionen);

        global $themeV3Helper;
        $error = '';
        if ($wpOptionen['wp_disable_wp_cron']) {
            $themeV3Helper->add_create_config_put('DISABLE_WP_CRON', 'DISABLE WP CRON', 1);
        } else {
            $themeV3Helper->delete_config_put('DISABLE_WP_CRON', 'DISABLE WP CRON', 1);
        }
        if ($wpOptionen['wp_disabled_automatic_update']) {
            $themeV3Helper->add_create_config_put('AUTOMATIC_UPDATER_DISABLED', 'AUTOMATIC UPDATER DISABLED CACHE', 1);
        } else {
            $themeV3Helper->delete_config_put('AUTOMATIC_UPDATER_DISABLED', 'AUTOMATIC UPDATER DISABLED', 1);
        }
        if ($wpOptionen['wp_disallow_file_edit']) {
            $themeV3Helper->add_create_config_put('DISALLOW_FILE_EDIT', 'DISALLOW FILE EDIT', 1);
        } else {
            $themeV3Helper->delete_config_put('DISALLOW_FILE_EDIT', 'DISALLOW FILE EDIT', 1);
        }
        if ($wpOptionen['wp_disallow_file_mods']) {
            $themeV3Helper->add_create_config_put('DISALLOW_FILE_MODS', 'DISALLOW FILE MODS', 1);
        } else {
            $themeV3Helper->delete_config_put('DISALLOW_FILE_MODS', 'DISALLOW FILE MODS', 1);
        }

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function wp_config_handle(): object
    {
        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $wpConfig = $optionen['wp_config'];
        $data = $this->request->get_param('data');
        if (!$data) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        $disabled = $data['wp_config_disabled'];
        if ($disabled) {
            $this->responseJson->msg = 'keine Berechtigung. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }

        $wpConfig['wp_cache_active'] = filter_var($data['wp_cache_active'], FILTER_VALIDATE_BOOLEAN);
        $wpConfig['show_fatal_error'] = filter_var($data['show_fatal_error'], FILTER_VALIDATE_BOOLEAN);
        $wpConfig['debug'] = filter_var($data['debug'], FILTER_VALIDATE_INT) ?? 2;
        $wpConfig['wp_script_debug'] = filter_var($data['wp_script_debug'], FILTER_VALIDATE_BOOLEAN);
        $wpConfig['wp_debug_display'] = filter_var($data['wp_debug_display'], FILTER_VALIDATE_BOOLEAN);
        $wpConfig['wp_debug_log'] = filter_var($data['wp_debug_log'], FILTER_VALIDATE_BOOLEAN);
        $wpConfig['mu_plugin_active'] = filter_var($data['mu_plugin_active'], FILTER_VALIDATE_BOOLEAN);
        $wpConfig['revision_anzahl'] = filter_var($data['revision_anzahl'], FILTER_VALIDATE_INT) ?? 10;
        $wpConfig['revision_interval'] = filter_var($data['revision_interval'], FILTER_VALIDATE_INT) ?? 60;
        $wpConfig['rev_wp_aktiv'] = filter_var($data['rev_wp_aktiv'], FILTER_VALIDATE_BOOLEAN);
        $wpConfig['trash_days'] = filter_var($data['trash_days'], FILTER_VALIDATE_INT) ?? 30;
        $wpConfig['trash_wp_aktiv'] = filter_var($data['trash_wp_aktiv'], FILTER_VALIDATE_BOOLEAN);
        $wpConfig['ssl_login_active'] = filter_var($data['ssl_login_active'], FILTER_VALIDATE_BOOLEAN);
        $wpConfig['admin_ssl_login_active'] = filter_var($data['admin_ssl_login_active'], FILTER_VALIDATE_BOOLEAN);
        $wpConfig['db_repair'] = filter_var($data['db_repair'], FILTER_VALIDATE_BOOLEAN);
        $optionen['wp_config'] = $wpConfig;
        update_option(HUMMELT_THEME_V3_SLUG . '/optionen', $optionen);

        global $themeV3Helper;
        if ($wpConfig['wp_cache_active']) {
            $themeV3Helper->add_create_config_put('WP_CACHE', 'WP CACHE', 1);
        } else {
            $themeV3Helper->delete_config_put('WP_CACHE', 'WP CACHE', 1);
        }
        if ($wpConfig['show_fatal_error']) {
            $themeV3Helper->add_create_config_put('WP_DISABLE_FATAL_ERROR_HANDLER', 'WP FATAL ERROR', 1);
        } else {
            $themeV3Helper->delete_config_put('WP_DISABLE_FATAL_ERROR_HANDLER', 'WP FATAL ERROR', 1);
        }
        if ($wpConfig['debug'] == 1) {
            $themeV3Helper->add_create_config_put('WP_DEBUG', 'WP DEBUG', 1);

        }
        if ($wpConfig['debug'] == 2) {
            $themeV3Helper->add_create_config_put('WP_DEBUG', 'WP DEBUG', 0);
        }
        if ($wpConfig['wp_script_debug']) {
            $themeV3Helper->add_create_config_put('SCRIPT_DEBUG', 'WP SCRIPT_DEBUG', 1);
        } else {
            $themeV3Helper->delete_config_put('SCRIPT_DEBUG', 'WP SCRIPT_DEBUG', 1);
        }
        if ($wpConfig['wp_debug_display']) {
            $themeV3Helper->add_create_config_put('WP_DEBUG_DISPLAY', 'WP DEBUG DISPLAY', 1);
        } else {
            $themeV3Helper->delete_config_put('WP_DEBUG_DISPLAY', 'WP DEBUG DISPLAY', 1);
        }
        if ($wpConfig['wp_debug_log']) {
            $themeV3Helper->add_create_config_put('WP_DEBUG_LOG', 'WP DEBUG LOG', 1);
            $themeV3Helper->add_create_config_put('WP_DEBUG_DISPLAY', 'WP DEBUG DISPLAY', 0);
        } else {
            $themeV3Helper->delete_config_put('WP_DEBUG_LOG', 'WP DEBUG LOG', 1);
            $themeV3Helper->add_create_config_put('WP_DEBUG_DISPLAY', 'WP DEBUG DISPLAY', 0);
        }
        if ($wpConfig['mu_plugin_active']) {
            $themeV3Helper->theme_activate_mu_plugin();
        } else {
            $themeV3Helper->theme_deactivate_mu_plugin();
        }
        if ($wpConfig['rev_wp_aktiv']) {
            $themeV3Helper->delete_config_put('WP_POST_REVISIONS', 'POST REVISIONS', $wpConfig['revision_anzahl']);
            $themeV3Helper->delete_config_put('AUTOSAVE_INTERVAL', 'AUTOSAVE INTERVAL', $wpConfig['revision_interval']);
        } else {
            $themeV3Helper->add_create_config_put('WP_POST_REVISIONS', 'POST REVISIONS', $wpConfig['revision_anzahl']);
            $themeV3Helper->add_create_config_put('AUTOSAVE_INTERVAL', 'AUTOSAVE INTERVAL', $wpConfig['revision_interval']);
        }
        if ($wpConfig['rev_wp_aktiv']) {
            $themeV3Helper->delete_config_put('EMPTY_TRASH_DAYS', 'TRASH DAYS', $wpConfig['trash_days']);
        } else {
            $themeV3Helper->add_create_config_put('EMPTY_TRASH_DAYS', 'TRASH DAYS', $wpConfig['trash_days']);
        }
        if ($wpConfig['ssl_login_active']) {
            $themeV3Helper->add_create_config_put('FORCE_SSL_LOGIN', 'SSL LOGIN', 1);
        } else {
            $themeV3Helper->delete_config_put('FORCE_SSL_LOGIN', 'SSL LOGIN', 1);
        }
        if ($wpConfig['admin_ssl_login_active']) {
            $themeV3Helper->add_create_config_put('FORCE_SSL_ADMIN', 'ADMIN SSL LOGIN', 1);
        } else {
            $themeV3Helper->delete_config_put('FORCE_SSL_ADMIN', 'ADMIN SSL LOGIN', 1);
        }
        if ($wpConfig['db_repair']) {
            $themeV3Helper->add_create_config_put('WP_ALLOW_REPAIR', 'WP REPAIR', 1);
        } else {
            $themeV3Helper->delete_config_put('WP_ALLOW_REPAIR', 'WP REPAIR', 1);
        }

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_debug_log(): object
    {
        $handle = filter_var($this->request->get_param('handle'), FILTER_UNSAFE_RAW);
        if (!$handle) {
            $this->responseJson->msg = 'kein Handle gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        global $wp_filesystem;
        $logFile = ABSPATH . 'wp-content' . DIRECTORY_SEPARATOR . 'debug.log';
        if ($handle == 'add') {
            if ($wp_filesystem->is_file($logFile)) {
                $lines = file($logFile);
                //$log = '';
                $log = '<div class="d-flex- flex-wrap">';
                $re = '@\[.*?].+:\s@i';
                $i = 0;
                foreach ($lines as $line) {
                    if (preg_match($re, $line, $matches)) {
                        $log .= '<div class="d-flex flex-column">';
                        $log .= '<div class="d-block fw-bold mt-3">' . $matches[0] . '</div>';
                        $line = str_replace($matches[0], '', $line);
                        $log .= '<div style="margin-left: 2rem" class="d-block text-unicode">' . substr($line, 0, 230) . '</div>';
                        $log .= '</div>';
                    } else {
                        $log .= '<div style="margin-left: 2rem" class="d-block text-unicode word-wrap">' . substr($line, 0, 230) . '</div>';
                    }
                }
                $log .= '</div>';
                $this->responseJson->log = $log;
                $this->responseJson->status = true;
            } else {
                $this->responseJson->msg = 'kein debug.log File gefunden!';
            }
        }
        if ($handle == 'delete') {
            if ($wp_filesystem->is_file($logFile)) {
                $wp_filesystem->delete($logFile);
                $this->responseJson->msg = 'Logfile erfolgreich gelöscht.';
                $this->responseJson->status = true;
            }
        }
        $this->responseJson->handle = $handle;
        return $this->responseJson;
    }

    private function update_msg_handle(): object
    {

        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $wpUpdMsg = $optionen['update_msg'];
        $data = $this->request->get_param('data');
        if (!$data) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        $disabled = $data['update_msg_disabled'];
        if ($disabled) {
            $this->responseJson->msg = 'keine Berechtigung. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }

        $wpUpdMsg['core_upd_msg_disabled'] = filter_var($data['core_upd_msg_disabled'], FILTER_VALIDATE_BOOLEAN);
        $wpUpdMsg['plugin_upd_msg_disabled'] = filter_var($data['plugin_upd_msg_disabled'], FILTER_VALIDATE_BOOLEAN);
        $wpUpdMsg['theme_upd_msg_disabled'] = filter_var($data['theme_upd_msg_disabled'], FILTER_VALIDATE_BOOLEAN);
        $wpUpdMsg['dashboard_update_anzeige'] = filter_var($data['dashboard_update_anzeige'], FILTER_VALIDATE_INT);
        $wpUpdMsg['send_error_email_disabled'] = filter_var($data['send_error_email_disabled'], FILTER_VALIDATE_BOOLEAN);
        $wpUpdMsg['email_err_msg'] = filter_var($data['email_err_msg'], FILTER_VALIDATE_EMAIL);
        if (!$wpUpdMsg['email_err_msg']) {
            $wpUpdMsg['email_err_msg'] = get_option('admin_email');
        }

        $optionen['update_msg'] = $wpUpdMsg;
        update_option(HUMMELT_THEME_V3_SLUG . '/optionen', $optionen);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function sortable_post_types_handle(): object
    {
        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $data = $this->request->get_param('data');
        if (!$data) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        if ($data['disabled']) {
            $this->responseJson->msg = 'keine Berechtigung. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = array_map(function ($a) {
            $a['value'] = filter_var($a['value'], FILTER_UNSAFE_RAW);
            return $a;
        }, $data['record']);
        $optionen['sortable_post_types'] = $data;
        update_option(HUMMELT_THEME_V3_SLUG . '/optionen', $optionen);

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function theme_sort_options_handle(): object
    {

        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $updOption = $optionen['theme_sort_options'];
        $data = $this->request->get_param('data');
        if (!$data) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        if ($data['backend_sortable_disabled']) {
            $this->responseJson->msg = 'keine Berechtigung. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $updOption['autosort'] = filter_var($data['autosort'], FILTER_VALIDATE_BOOLEAN);
        $updOption['adminsort'] = filter_var($data['adminsort'], FILTER_VALIDATE_BOOLEAN);
        $updOption['use_query_ASC_DESC'] = filter_var($data['use_query_ASC_DESC'], FILTER_VALIDATE_BOOLEAN);
        $updOption['archive_drag_drop'] = filter_var($data['archive_drag_drop'], FILTER_VALIDATE_BOOLEAN);
        $updOption['capability'] = filter_var($data['capability'], FILTER_UNSAFE_RAW);
        $updOption['navigation_sort_apply'] = filter_var($data['navigation_sort_apply'], FILTER_VALIDATE_BOOLEAN);
        $updOption['backend_sortable_disabled'] = filter_var($data['backend_sortable_disabled'], FILTER_VALIDATE_BOOLEAN);
        $optionen['theme_sort_options'] = $updOption;
        update_option(HUMMELT_THEME_V3_SLUG . '/optionen', $optionen);

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function duplicate_post_types_handle(): object
    {

        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $data = $this->request->get_param('data');
        if (!$data) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        if ($data['disabled']) {
            $this->responseJson->msg = 'keine Berechtigung. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = array_map(function ($a) {
            $a['value'] = filter_var($a['value'], FILTER_UNSAFE_RAW);
            return $a;
        }, $data['record']);
        $optionen['duplicate_post_types'] = $data;
        update_option(HUMMELT_THEME_V3_SLUG . '/optionen', $optionen);

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function theme_duplicate_options_handle(): object
    {

        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $uptOpt = $optionen['theme_duplicate_options'];
        $data = $this->request->get_param('data');
        if (!$data) {
            $this->responseJson->msg = 'keine Daten zum speichern gefunden. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        if ($data['backend_duplicate_disabled']) {
            $this->responseJson->msg = 'keine Berechtigung. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $uptOpt['capability'] = filter_var($data['capability'], FILTER_UNSAFE_RAW);
        $optionen['theme_duplicate_options'] = $uptOpt;
        update_option(HUMMELT_THEME_V3_SLUG . '/optionen', $optionen);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function edit_config(): object
    {
        $pin = filter_var($this->request->get_param('pin'), FILTER_UNSAFE_RAW);
        $handle = filter_var($this->request->get_param('handle'), FILTER_UNSAFE_RAW);
        if (!$handle) {
            $this->responseJson->msg = 'keine Berechtigung. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }
        $this->responseJson->handle = $handle;
        global $themeV3Helper;
        if (!$themeV3Helper->verifyPassword($pin, get_option(HUMMELT_THEME_V3_SLUG . '/config_pin'))) {
            $this->responseJson->msg = 'falscher PIN. (rest-' . __LINE__ . ')';
            return $this->responseJson;
        }

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_dashboard_settings(): object
    {
        // delete_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses');
        if (is_user_logged_in()) {
            $dsSettings = get_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses');
            $isTestUrl = apply_filters(HUMMELT_THEME_V3_SLUG . '/test_url', site_url());

            $isPlugin = function ($slug) use ($dsSettings) {
                foreach ($dsSettings['plugins'] as $plugin) {
                    if ($plugin['slug'] == $slug) {
                        return $plugin;
                    }
                }
                return [];
            };

            $plugins = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_plugins', null);

            foreach ($plugins as $tmp) {
                if (!$isPlugin($tmp['slug'])) {
                    if ($isTestUrl) {
                        $tmp['aktiv'] = true;
                    } else {
                        $tmp['aktiv'] = false;
                    }
                    $tmp['license'] = '';
                    $dsSettings['plugins'] = array_merge_recursive($dsSettings['plugins'], [$tmp]);
                    update_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses', $dsSettings);

                }
            }

            if ($isTestUrl) {
                if (!$dsSettings['theme']['license']) {
                    $license = '';
                } else {
                    $license = $dsSettings['theme']['license'];
                }
                $theme = [
                    'aktiv' => true,
                    'license' => $license,
                ];
                $dsSettings['theme'] = $theme;
                update_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses', $dsSettings);
            }

            $this->responseJson->cron_aktiv = $this->main->check_wp_cron();
            $this->responseJson->local = $isTestUrl;
            $this->responseJson->license = $dsSettings;
            $this->responseJson->status = true;
        }
        return $this->responseJson;
    }

    private function activate_theme(): object
    {
        $id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        if (!$id) {
            $this->responseJson->msg = 'Ungültige Lizenz (' . __LINE__ . ')';
            return $this->responseJson;
        }
        $dsSettings = get_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses');
        $hemeLicense = $dsSettings['theme'];
        $themeApi = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_license', $id);
        $hemeLicense['aktiv'] = false;
        $hemeLicense['license'] = '';
        if ($themeApi) {
            if ($themeApi['user_active']) {
                $hemeLicense['aktiv'] = $themeApi['license'];
                $hemeLicense['license'] = $themeApi['id'];
            }
            $hemeLicense['cronjob'] = $themeApi['cronjob'];
        }
        $dsSettings['theme'] = $hemeLicense;
        update_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses', $dsSettings);
        $dsSettings = get_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses');
        $this->responseJson->record = $dsSettings;
        $this > $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function activate_plugin(): object
    {
        $id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        $slug = filter_var($this->request->get_param('slug'), FILTER_UNSAFE_RAW);
        $dsSettings = get_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses');
        $plugins = $dsSettings['plugins'];

        $api = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_license', $id);
        $setPluginLicense = function ($slug, $id, $aktiv) use ($plugins) {
            $pluginArr = [];
            foreach ($plugins as $tmp) {
                if ($tmp['slug'] == $slug) {
                    $tmp['aktiv'] = $aktiv;
                    $tmp['license'] = $id;
                }
                $pluginArr[] = $tmp;
            }
            return $pluginArr;
        };

        if ($api && $api['user_active']) {
            $pluginUpd = $setPluginLicense($slug, $api['id'], $api['license']);
        } else {
            $pluginUpd = $setPluginLicense($slug, '', false);
        }
        $dsSettings['plugins'] = $pluginUpd;
        update_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses', $dsSettings);
        $this->responseJson->slug = $slug;
        $this->responseJson->id = $id;
        $this->responseJson->aktiv = $api['license'];
        if ($api['license']) {
            $this->responseJson->msg = 'Lizenz erfolgreich aktiviert';
            $this->responseJson->status = true;
        } else {
            $this->responseJson->msg = 'Ungültige Lizenz';
        }

        return $this->responseJson;
    }

    /**
     * Check if a given request has access.
     *
     * @return string
     */
    public function permissions_check(): string
    {
        return '__return_true';
    }

    public function current_user_can_by_role($option): bool
    {
        $current_user = wp_get_current_user();
        if (in_array('administrator', $current_user->roles)) {
            return true;
        }
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $capabilities = $settings['theme_capabilities'];
        $getOption = $capabilities[$option] ?? false;
        if ($getOption) {
            return current_user_can($getOption);
        }
        return false;
    }
}