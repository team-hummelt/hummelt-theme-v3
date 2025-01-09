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
use Hummelt_Theme_V3;
use WP_User;

class hummelt_theme_v3_branding
{
    use hummelt_theme_v3_options;
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
    }

    /**
     * @param $wp_admin_bar
     */
    public function hummelt_theme_v3_toolbar_hupa_options($wp_admin_bar): void
    {

        $args = array(
            'id' => 'hummelt_theme_v3_options_page',
            'title' => __('hummelt und partner', 'bootscore'),
            'parent' => false,
            'meta' => array(
                'class' => 'hupa-toolbar-page'
            )
        );
        $wp_admin_bar->add_node($args);
        $user = new WP_User(get_current_user_id());
       // if ($user->roles[0] == 'administrator'): endif;
            $args[] = [
                'id' => 'hupa_theme_v3_options',
                'title' => __('Theme Einstellungen', 'bootscore'),
                'parent' => 'hummelt_theme_v3_options_page',
                'href' => admin_url() . 'options-general.php?page=hupa-theme-v3-options',
            ];

        $args[] = [
            'id' => 'hupa_contact',
            'title' => __('Kontakt', 'bootscore'),
            'parent' => 'hummelt_theme_v3_options_page',
            'href' => 'mailto:kontakt@hummelt.com',
            'meta' => [
                'class' => 'get_hupa_contact'
            ]
        ];

        $args[] = [
            'id' => 'hupa_website',
            'title' => __('Website', 'bootscore'),
            'parent' => 'hummelt_theme_v3_options_page',
            'href' => 'https://www.hummelt-werbeagentur.de/',
        ];

        sort($args);
        foreach ($args as $tmp) {
            $wp_admin_bar->add_node($tmp);
        }
    }

    public function hummelt_theme_v3_dashboard_favicon(): void
    {
        echo '<link rel="Shortcut Icon" type="image/x-icon" href="' . HUMMELT_THEME_V3_ADMIN_URL . 'assets/images/favicon/favicon.ico" />';
    }

    public function hummelt_theme_v3_remove_footer_admin(): void
    {
        $footer = '<p class="starter_admin_footer_text"> 
			  <a href="https://www.hummelt-werbeagentur.de/" title="Werbeagentur in Magdeburg">
			  <img alt="Werbeagentur in Magdeburg" src="' . HUMMELT_THEME_V3_ADMIN_URL . 'assets/images/hupa-red.svg"></a>hummelt&nbsp; 
			  <span class="footer-red">und&nbsp; </span> partner <span style="font-weight: 200;">&nbsp;Theme</span> </p>';
        echo preg_replace(array('/<!--(.*)-->/Uis', "/[[:blank:]]+/"), array('', ' '), str_replace(array("\n", "\r", "\t"), '', $footer));
    }

    public function change_hummelt_theme_v3_footer_version(): void
    {
        echo '<span class="admin_footer_version"><b class="footer-red">HUPA</b>: v' . HUMMELT_THEME_V3_VERSION . ' &nbsp;|&nbsp;  WordPress: ' . get_bloginfo('version') . '</span>';
    }

    public function hummelt_theme_v3_footer_shh(): void
    {
        remove_filter('update_footer', 'core_update_footer');
    }

    public function hummelt_theme_v3_remove_wp_logo($wp_admin_bar): void
    {
        $wp_admin_bar->remove_node('wp-logo');
    }
    public function add_hummelt_theme_v3_bar_logo($wp_admin_bar): void
    {
        $args = array(
            'id' => 'hupa-bar-logo',
            'parent' => false,
            'meta' => array('class' => 'hupa-admin-bar-logo', 'title' => 'Hummelt Werbeagentur in Magdeburg')
        );
        $wp_admin_bar->add_node($args);
    }


    public function hummelt_theme_v3_wordpress_dashboard_style():void
    {
        $screen = get_current_screen();
        // TODO DASHBOARD WP STYLES
        if ($screen && !$screen->is_block_editor) {
            wp_enqueue_style('hummelt-theme-v3-admin-custom-icons', HUMMELT_THEME_V3_ADMIN_URL . 'assets/css/tools.css', array(), HUMMELT_THEME_V3_VERSION, false);
        }

        wp_enqueue_style('hummelt-theme-v3-admin-dashboard-tools', HUMMELT_THEME_V3_ADMIN_URL. 'assets/css/Glyphter.css', array(), HUMMELT_THEME_V3_VERSION, false);

        global $wp_filesystem;
        $file = 'theme-font-face.css';
        $cssFilePath = HUMMELT_THEME_V3_FONTS_DIR . $file;
        if($wp_filesystem->is_file($cssFilePath)) {
            wp_enqueue_style('hummelt-theme-v3-custom-fonts', HUMMELT_THEME_V3_FONTS_URL. 'theme-font-face.css', array(), HUMMELT_THEME_V3_VERSION, false);
        }


        if(HUMMELT_THEME_V3_EDITOR_SHOW_BOOTSTRAP_CSS){
            wp_enqueue_style('hummelt-theme-v3-admin-dashboard-tools', HUMMELT_THEME_V3_ADMIN_URL. 'assets/css/Glyphter.css', array(), HUMMELT_THEME_V3_VERSION, false);
        }
    }

    public function hummelt_theme_v3_wordpress_editor_style():void
    {
      // add_theme_support('editor-styles');
       // add_editor_style( 'editor-style.css' );

        // Check if the current page is the Gutenberg editor and enqueue CSS to the main admin area to use variables in theme.json
        $screen = get_current_screen();
        if ($screen && $screen->is_block_editor && HUMMELT_THEME_V3_EDITOR_SHOW_BOOTSTRAP_CSS) {
        //   wp_enqueue_style('editor-style', HUMMELT_THEME_V3_ADMIN_URL. 'assets/css/tools.css', array(), '1.0', 'all');
        //  wp_enqueue_style('editor-style', HUMMELT_THEME_V3_ADMIN_URL. 'assets/css/autogenerate-editor-ui-styles.css', array(), '1.0', 'all');
        }
    }

   public function add_inline_block_editor_styles() {

    }

    public function fb_theme_v3_set_login_logo(): void
    {
        global $themeV3Settings;
        $wpGeneral = $themeV3Settings->fn_hummelt_theme_v3_optionen('theme_wp_general');

        $imgId = $wpGeneral['logo_image'];
        if(!$wpGeneral['login_img_aktiv']) {
            $imgId = $wpGeneral['login_image'];
        }
        $logoImg = HUMMELT_THEME_V3_ADMIN_URL . 'assets/images/logo_hupa.svg';
        if ($imgId) {
            $logoImg = wp_get_attachment_image_src($imgId, 'large')[0];
        }
        $wpGeneral['login_img_width'] ? $width = $wpGeneral['login_img_width'] : $width = 320;
        $wpGeneral['login_img_height'] ? $height = $wpGeneral['login_img_height'] : $height = 110;
        ?>
        <style type="text/css">
            #login h1 a, .login h1 a {
                background-image: url(<?=$logoImg?>);
                height: <?=$height?>px;
                width: <?=$width?>px;
                background-size: <?=$width?>px <?=$height?>px;
                background-repeat: no-repeat;
                padding-bottom: 0;
            }
        </style>
        <?php
    }

    public function fn_hummelt_theme_v3_login_logo_url(): string
    {
        global $themeV3Settings;
        $wpGeneral = $themeV3Settings->fn_hummelt_theme_v3_optionen('theme_wp_general');
        if (!$wpGeneral['login_logo_url']) {
            $url = 'https://www.hummelt-werbeagentur.de/';
        } else {
            $url = $wpGeneral['login_logo_url'];
        }

        return $url;
    }

    public function fn_hummelt_theme_v3_login_logo_url_title(): string
    {
        return 'Powered by hummelt und partner | Werbeagentur GmbH';
    }

    public function fn_hummelt_theme_v3_set_login_head_style_css(): void
    {
       echo '<link rel="Shortcut Icon" type="image/x-icon" href="' . HUMMELT_THEME_V3_ADMIN_URL . 'assets/images/favicon/favicon.ico" />'."\r\n";
       echo '<link rel="stylesheet" type="text/css" href="'.HUMMELT_THEME_V3_CSS_REST_URL.'auto-generate-login-style" />';
    }


    public function fn_theme_v3_enqueue_login_footer_script($page): void
    {
        wp_enqueue_style('hummelt-the-v3-login-icons-style', HUMMELT_THEME_V3_VENDOR_URL . 'components/font-awesome/css/font-awesome.min.css', array(), HUMMELT_THEME_V3_VERSION, false);
        wp_enqueue_script('hummelt-the-v3-login-js-script', HUMMELT_THEME_V3_ADMIN_URL. 'assets/js/login-footer-script.js', array(), HUMMELT_THEME_V3_VERSION, true);

        wp_register_script('hummelt-the-v3-footer-localize', '', [], '', true);
        wp_enqueue_script('hummelt-the-v3-footer-localize');
        wp_localize_script('hummelt-the-v3-footer-localize',
            'hupa_login',
            array(
                'admin_url' => HUMMELT_THEME_V3_ADMIN_URL,
                'site_url' => get_bloginfo('url'),
                'rest_css_url' => esc_url(rest_url('theme-v3-css/v' . HUMMELT_THEME_V3_VERSION . '/')),
               // 'language' => apply_filters('get_theme_language', 'login_site', '')->language
            )
        );
    }
}