<?php

namespace Hummelt\ThemeV3;

use Exception;
use FontLib\Exception\FontNotFoundException;
use Hummelt_Theme_V3;
use WP_Error;

use WP_User;
use FontLib\Font;
use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

/**
 * The admin-specific functionality of the theme.
 *
 * @link       https://wwdh.de
 * @since      3.0.0
 *
 * @package    Hummelt_Theme_v3
 * @subpackage Hummelt_Theme_v3/admin
 */
defined('ABSPATH') or die();

class register_hummelt_theme_v3_optionen
{
    use hummelt_theme_v3_options;

    protected array $capabilities = [];
    private static $hummelt_theme_v3_option_instance;

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
    public static function hummelt_theme_v3_option_instance(Hummelt_Theme_V3 $main): self
    {
        if (is_null(self::$hummelt_theme_v3_option_instance)) {
            self::$hummelt_theme_v3_option_instance = new self($main);
        }
        return self::$hummelt_theme_v3_option_instance;
    }

    public function __construct(Hummelt_Theme_V3 $main)
    {
        // delete_option(HUMMELT_THEME_V3_SLUG . '/settings');
        //delete_option(HUMMELT_THEME_V3_SLUG . '/optionen');

        $this->main = $main;
        if (!get_option(HUMMELT_THEME_V3_SLUG . '/settings')) {
            update_option(HUMMELT_THEME_V3_SLUG . '/settings', $this->get_theme_default_settings());
        }
        if (!get_option(HUMMELT_THEME_V3_SLUG . '/optionen')) {
            update_option(HUMMELT_THEME_V3_SLUG . '/optionen', $this->get_theme_default_optionen());
            $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
            $sortablePosts = apply_filters(HUMMELT_THEME_V3_SLUG . '/sortable_post_types', null);
            $optionen['sortable_post_types'] = $sortablePosts;
            $duplicatePosts = apply_filters(HUMMELT_THEME_V3_SLUG . '/duplicate_post_types', null);
            $optionen['duplicate_post_types'] = $duplicatePosts;
            $default_email = get_option('admin_email');
            $optionen['update_msg']['email_err_msg'] = $default_email;
            update_option(HUMMELT_THEME_V3_SLUG . '/optionen', $optionen);
        }

        //delete_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses');
        $dsSettings = get_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses');
        if (!$dsSettings) {
            $theme = [
                'license' => '',
                'aktiv' => false,
                'cronjob' => 'daily'
            ];
            $license = [
                'theme' => $theme,
                'plugins' => []

            ];
            update_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses', $license);

        }
        $this->fn_hummelt_theme_v3_activation_hook();


        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $this->capabilities = $settings['theme_capabilities'];


    }

    /**
     * =================================================
     * =========== REGISTER THEME ADMIN MENU ===========
     * =================================================
     */

    public function register_hummelt_theme_v3_admin_menu(): void
    {
        add_menu_page(
            __('HUPA Theme v3', 'bootscore'),
            __('Theme Settings', 'bootscore'),
            'read',
            'hummelt-theme-v3-dashboard',
            '',
            $this->main->get_hupa_icon()
            , 2
        );
        $dsSettings = get_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses');

            $hook_suffix = add_submenu_page(
                'hummelt-theme-v3-dashboard',
                __('Theme Settings', 'bootscore'),
                __('Dashboard', 'bootscore'),
                'read',
                'hummelt-theme-v3-dashboard',
                array($this, 'settings_hummelt_theme_v3'));

            add_action('load-' . $hook_suffix, array($this, 'hummelt_theme_v3_load_ajax_admin_options_script'));
        if ($dsSettings['theme']['aktiv']) {
            $hook_suffix = add_submenu_page(
                'hummelt-theme-v3-dashboard',
                __('Theme Einstellungen', 'bootscore'),
                __('Einstellungen', 'bootscore'),
                $this->capabilities['theme-settings'],
                'hummelt-theme-v3-optionen',
                array($this, 'settings_hummelt_theme_v3'));

            add_action('load-' . $hook_suffix, array($this, 'hummelt_theme_v3_load_ajax_admin_options_script'));

            $hook_suffix = add_submenu_page(
                'hummelt-theme-v3-dashboard',
                __('Theme Einstellungen', 'bootscore'),
                __('Tools | Plugins', 'bootscore'),
                $this->capabilities['theme-tools'],
                'hummelt-theme-v3-tools',
                array($this, 'tools_hummelt_theme_v3'));

            add_action('load-' . $hook_suffix, array($this, 'hummelt_theme_v3_load_ajax_admin_options_script'));

            if($this->main->get_plugin_by_slug('bs-form-builder-v3')) {
                $hook_suffix = add_submenu_page(
                    'hummelt-theme-v3-dashboard',
                    __('Formulare', 'bootscore'),
                    __('Formulare', 'bootscore'),
                    $this->capabilities['formulare'],
                    'hummelt-theme-v3-forms',
                    array($this, 'forms_hummelt_theme_v3'));

                add_action('load-' . $hook_suffix, array($this, 'hummelt_theme_v3_load_ajax_admin_options_script'));
            }

            add_options_page(
                'OPcache Manager',
                'OPcache',
                'manage_options',
                'wp-opcache-manager',
                array($this, 'wp_opcache_manager_settings_page')
            );

            /** OPTIONS PAGE */
            $hook_suffix = add_options_page(
                __('HUPA Theme v3', 'bootscore'),
                '<img class="menu_hupa" src="' . HUMMELT_THEME_V3_ADMIN_URL . 'assets/images/hupa-white-sm.png" alt="" /> HUPA Theme v3',
                $this->capabilities['einstellungen'],
                'hupa-theme-v3-options',
                array($this, 'hupa_theme_v3_options_page')
            );
            add_action('load-' . $hook_suffix, array($this, 'hummelt_theme_v3_load_ajax_admin_options_script'));
        }

    }


    public function settings_hummelt_theme_v3(): void
    {
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $theme_wp_general = $settings['theme_wp_general'];
        if($theme_wp_general['sitemap_url'] != site_url()) {
            do_action(HUMMELT_THEME_V3_SLUG.'/create_sitemap');
        }
        echo '<div class="hummelt-theme-v3" id="hummelt-theme-v3"></div>';
    }

    public function tools_hummelt_theme_v3(): void
    {
        echo '<div class="hummelt-theme-v3" id="hummelt-theme-v3-tools"></div>';
    }


    public function hupa_theme_v3_options_page(): void
    {
        echo '<div class="hummelt-theme-v3" id="hummelt-theme-v3-options"></div>';

    }

    public function wp_opcache_manager_settings_page(): void
    {
       require_once ('OpCache/wp-opcache-manager.php');
    }

    public function forms_hummelt_theme_v3(): void
    {
        echo '<div class="hummelt-theme-v3" id="hummelt-theme-v3-forms"></div>';
    }

    public function hummelt_theme_v3_load_ajax_admin_options_script(): void
    {
        $caps = apply_filters(HUMMELT_THEME_V3_SLUG . '/theme_caps', null);

        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $theme_wp_optionen = $settings['theme_wp_optionen'];
        $restSettings = [
            'fa_icons_active' => $theme_wp_optionen['fa_icons_active'],
            'material_icons_active' => $theme_wp_optionen['material_icons_active']
        ];
        $nonce = wp_create_nonce('hummelt_theme_v3_admin_handle');
        wp_register_script('hummelt-theme-v3-js-localize', '', [], HUMMELT_THEME_V3_VERSION, true);
        wp_enqueue_script('hummelt-theme-v3-js-localize');
        wp_localize_script('hummelt-theme-v3-js-localize',
            'hummeltRestObj',
            array(
                'ajax_url' => admin_url('admin-ajax.php'),
                'site_url' => site_url(),
                'version' => HUMMELT_THEME_V3_VERSION,
                'theme_admin_url' => HUMMELT_THEME_V3_ADMIN_URL,
                'handle' => 'HummeltThemeV3Admin',
                'dashboard_rest_path' => 'theme-v3-dashboard/v' . HUMMELT_THEME_V3_VERSION . '/',
                'gutenberg_rest_path' => 'theme-v3-gutenberg/v' . HUMMELT_THEME_V3_VERSION . '/',
                'form_builder_rest_path' => 'theme-v3-forms/v' . HUMMELT_THEME_V3_VERSION . '/',
                'rest_css_url' => esc_url(rest_url('theme-v3-css/v' . HUMMELT_THEME_V3_VERSION . '/')),
                'form_download' => site_url() . '/hummelt-theme-v3/form-download',
                'email_attachment_download' => site_url() . '/hummelt-theme-v3/attachment-download',
                //'rest_nonce' => wp_create_nonce('wp_rest'),
                'nonce' => $nonce,
                'caps' => $caps,
                'rest_settings' => $restSettings
            )
        );

        add_action('admin_enqueue_scripts', array($this, 'load_hummelt_theme_v3_admin_style'));
    }

    public function hupa_theme_v3_add_post_support(): void
    {
        add_post_type_support('theme_header', 'post-formats');
        add_post_type_support('theme_footer', 'post-formats');
        add_post_type_support('theme_design', 'post-formats');
        // add_theme_support('editor-styles');
        add_theme_support('wp-block-styles');
        add_theme_support('align-wide');
        add_theme_support('custom-spacing');
        add_theme_support('custom-line-height');

    }

    public function fn_hummelt_theme_v3_trigger_check(): void
    {
        global $wp;
        if (get_query_var('hummelt-theme-v3')) {
            if ($wp->query_vars['hummelt-theme-v3'] == 'font-demo') {
                $family = filter_input(INPUT_GET, 'font', FILTER_UNSAFE_RAW);
                do_action(HUMMELT_THEME_V3_SLUG . '/theme_hummelt_v3_font_demo', $family);
                exit();
            }
            if ($wp->query_vars['hummelt-theme-v3'] == 'form-download') {
                $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
                $type = filter_input(INPUT_GET, 'type', FILTER_VALIDATE_INT);
                do_action(HUMMELT_THEME_V3_SLUG . '/form_download', $id, $type);
                exit();
            }
            if ($wp->query_vars['hummelt-theme-v3'] == 'pdf-download') {
                $file = filter_input(INPUT_GET, 'file', FILTER_UNSAFE_RAW);
                $type = filter_input(INPUT_GET, 'type', FILTER_VALIDATE_INT);
                do_action(HUMMELT_THEME_V3_SLUG . '/pdf_download', $file, $type);
                exit();
            }
            if ($wp->query_vars['hummelt-theme-v3'] == 'attachment-download') {
                $file = filter_input(INPUT_GET, 'file', FILTER_UNSAFE_RAW);
                $name = filter_input(INPUT_GET, 'name', FILTER_UNSAFE_RAW);
                $type = filter_input(INPUT_GET, 'type', FILTER_VALIDATE_INT);

                do_action(HUMMELT_THEME_V3_SLUG . '/email_attachment_download', $file, $name, $type);
                exit();
            }
        }
    }

    public function fn_init_hummelt_theme_rewrite_rule(): void
    {
        $rules = get_option('rewrite_rules', array());
        $regex = 'hummelt-theme-v3/([a-z0-9-]+)[/]?$';
        add_rewrite_rule($regex, 'index.php?hummelt-theme-v3=$matches[1]', 'top');
        if (!isset($rules[$regex])) {
            flush_rewrite_rules();
        }
    }

    public function fn_hummelt_theme_query_whitelist($query_vars)
    {
        $query_vars[] = 'hummelt-theme-v3';
        return $query_vars;
    }

    /**
     * @throws Exception
     */
    public function admin_ajax_HummeltThemeV3Admin(): void
    {
        check_ajax_referer('hummelt_theme_v3_admin_handle');
        require 'Ajax/hummelt_them_v3_admin_ajax.php';
        $adminAjaxHandle = hummelt_them_v3_admin_ajax::instance($this->main);
        wp_send_json($adminAjaxHandle->admin_ajax_handle());
    }

    /**
     * @throws Exception
     */
    public function public_ajax_HummeltThemeV3Formular(): void
    {
        check_ajax_referer('hummelt_theme_v3_formular_handle');
        require 'Ajax/hummelt_theme_v3_formular_ajax.php';
        $publicAjaxHandle = hummelt_theme_v3_formular_ajax::instance($this->main);
        wp_send_json($publicAjaxHandle->formular_ajax_handle());
    }

    /**
     * @throws Exception
     */
    public function public_ajax_HummeltThemeV3AJAX(): void
    {
        check_ajax_referer('hummelt_theme_v3_public_ajax');
        require 'Ajax/class_child_theme_public_ajax.php';
        $publicAjaxHandle = Child_Theme_Public_Ajax::child_theme_ajax_instance($this->main);
        wp_send_json($publicAjaxHandle->theme_ajax_handle());
    }

    public function fn_hummelt_theme_v3_activation_hook(): void
    {
        if (!get_option(HUMMELT_THEME_V3_SLUG . '/db_version') || get_option(HUMMELT_THEME_V3_SLUG . '/db_version') != HUMMELT_THEME_V3_DB_VERSION) {
            global $themeV3InstallDb;
            $themeV3InstallDb->fn_hummelt_theme_v3_database_install(null);

            update_option(HUMMELT_THEME_V3_SLUG . '/db_version', HUMMELT_THEME_V3_DB_VERSION);
        }
    }



    public function fn_hummelt_theme_v3_deactivated(): void
    {

    }

    public function fn_theme_hummelt_v3_smtp_mailer_configure($phpmailer): void
    {
        $conf = get_option(HUMMELT_THEME_V3_SLUG . '/smtp_settings');
        if ($conf['active']) {
            $phpmailer->isSMTP();
            $phpmailer->Host = $conf['smtp_host'];
            $phpmailer->SMTPAuth = $conf['smtp_auth_active'];
            $phpmailer->Port = $conf['smtp_port'];
            $phpmailer->Username = $conf['email_username'];
            $phpmailer->Password = $conf['email_password'];
            $phpmailer->SMTPSecure = $conf['smtp_secure'];
            $phpmailer->From = $conf['abs_email'];
            $phpmailer->FromName = $conf['smtp_from_name'];
            // $phpmailer->SMTPDebug = $conf['smtp_debug'];
            $phpmailer->CharSet = $conf['char_set'];
        }
        $phpmailer->SMTPDebug = 0; // Detailliertes Debugging
        $phpmailer->Debugoutput = function ($str, $level) {
            error_log("SMTP Debug [$level]: $str");
        };
        // $phpmailer->setFrom($conf['smtp_from_email'], $conf['smtp_from_name'], false);

    }

    public function fn_theme_hummelt_v3_smtp_mailer_content_type(): string
    {
        return "text/html";
    }

    public function fn_theme_hummelt_v3_smtp_log_mailer_errors($wp_error): void
    {
        update_option(HUMMELT_THEME_V3_SLUG . '/mail_error', json_encode($wp_error));
    }

    public function fn_wp_mail_from_filter($email): string
    {
        return $email === 'wordpress@localhost' ? get_option('admin_email') : $email;
    }

    public function set_hummelt_theme_v3_update_checker(): void
    {
         //   print_r( get_option(HUMMELT_THEME_V3_SLUG . '/update_checker'));
        if(get_option(HUMMELT_THEME_V3_SLUG . '/theme_v3_config')) {
            $conf = get_option(HUMMELT_THEME_V3_SLUG . '/theme_v3_config');

            $body = [
                'method' => 'GET',
                'timeout' => 45,
                'redirection' => 5,
                'httpversion' => '1.0',
                'sslverify' => true,
                'blocking' => true,
                'headers' => [],
                'body' => []
            ];
            try {
                $response = wp_remote_get($conf['server_url'] . '/api/' . HUMMELT_THEME_V3_SLUG . '/conf/update-options', $body);

            } catch (Exception $e) {
                return;
            }

            if (is_wp_error($response)) {
                echo $response->get_error_message();
                return;
            }

            $status_code = wp_remote_retrieve_response_code($response);

            if($status_code !== 200) {
               return;
            }

            $response = json_decode($response['body'], true);
            update_option(HUMMELT_THEME_V3_SLUG . '/update_checker', $response);
               $options = get_option(HUMMELT_THEME_V3_SLUG . '/update_checker');

            if ($options['update_aktive']) {
                if ($options['is_git']) {
                    $updateChecker = PucFactory::buildUpdateChecker(
                        $options['git_data']['git_url'],
                        HUMMELT_THEME_V3_DIR,
                        HUMMELT_THEME_V3_SLUG
                    );
                    switch ($options['git_data']['update_type']) {
                        case '1':
                            $updateChecker->getVcsApi()->enableReleaseAssets();
                            break;
                        case '2':
                            $updateChecker->setBranch($options['git_data']['branch_name']);
                            break;
                    }
                }

                if (!$options['is_git']) {
                    PucFactory::buildUpdateChecker(
                        $options['update_url'],
                        HUMMELT_THEME_V3_DIR,
                        HUMMELT_THEME_V3_SLUG
                    );
                }
            }
        }
    }

    public function hummelt_them_v3_show_upgrade_notification($current_theme_metadata, $new_theme_metadata): void
    {

        /**
         * Check "upgrade_notice" in readme.txt.
         *
         * Eg.:
         * == Upgrade Notice ==
         * = 20180624 = <- new version
         * Notice        <- message
         *
         */
        if (isset($new_theme_metadata->upgrade_notice) && strlen(trim($new_theme_metadata->upgrade_notice)) > 0) {

            // Display "upgrade_notice".
            echo sprintf('<span style="background-color:#d54e21;padding:10px;color:#f9f9f9;margin-top:10px;display:block;"><strong>%1$s: </strong>%2$s</span>', esc_attr('Important Upgrade Notice', 'post-selector'), esc_html(rtrim($new_theme_metadata->upgrade_notice)));

        }
    }


    /**
     * Register the JavaScript and CSS for the admin area.
     *
     * @since    3.0.0
     */
    public function load_hummelt_theme_v3_admin_style(): void
    {

        apply_filters(HUMMELT_THEME_V3_SLUG . '/dashboard_scss_compiler', '/theme-style/scss/dashboard/dashboard.scss', '/theme-style/css/dashboard/dashboard.css');

        $screen = get_current_screen();
        wp_enqueue_style('hummelt-theme-v3-admin-bs-style', HUMMELT_THEME_V3_ADMIN_URL . 'assets/css/bs/bootstrap.min.css', array(), HUMMELT_THEME_V3_VERSION, false);
        wp_enqueue_style('bootstrap-icons-style', HUMMELT_THEME_V3_VENDOR_URL . 'twbs/bootstrap-icons/font/bootstrap-icons.min.css', array(), HUMMELT_THEME_V3_VERSION, false);
        wp_enqueue_style('font-awesome-icons-style', HUMMELT_THEME_V3_VENDOR_URL . 'components/font-awesome/css/font-awesome.min.css', array(), HUMMELT_THEME_V3_VERSION, false);
        wp_enqueue_style('dashboard-style', get_template_directory_uri() . '/theme-style/css/dashboard/dashboard.css', array(), HUMMELT_THEME_V3_VERSION, false);
        //wp_enqueue_script('hummelt-theme-v3-lightbox', get_template_directory_uri() . '/assets/js/lightbox/blueimp-gallery.min.js', array(), HUMMELT_THEME_V3_VERSION, true);
        if ($screen->id == 'theme-settings_page_hummelt-theme-v3-optionen' || $screen->id == 'theme-settings_page_hummelt-theme-v3-tools') {
            wp_enqueue_media();
        }
        if ($screen->id == 'toplevel_page_hummelt-theme-v3-dashboard' || $screen->id == 'theme-settings_page_hummelt-theme-v3-optionen') {
            $dashboard_asset = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/react-theme-settings/build/index.asset.php';
            wp_enqueue_script('hummelt-theme-v3-dashboard', HUMMELT_THEME_V3_ADMIN_URL . 'admin-dashboard/react-theme-settings/build/index.js', array('wp-element', 'wp-api-fetch', 'wp-i18n'), $dashboard_asset['version'], true);
            wp_enqueue_style('hummelt-theme-v3-admin-db-style', HUMMELT_THEME_V3_ADMIN_URL . 'admin-dashboard/react-theme-settings/build/index.css', array(), $dashboard_asset['version'], false);
        }

        if ($screen->id == 'settings_page_hupa-theme-v3-options') {
            $dashboard_asset = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/react-theme-options/build/index.asset.php';
            wp_enqueue_script('hummelt-theme-v3-dashboard', HUMMELT_THEME_V3_ADMIN_URL . 'admin-dashboard/react-theme-options/build/index.js', array('wp-element', 'wp-api-fetch', 'wp-i18n'), $dashboard_asset['version'], true);
            wp_enqueue_style('hummelt-theme-v3-admin-db-style', HUMMELT_THEME_V3_ADMIN_URL . 'admin-dashboard/react-theme-options/build/index.css', array(), $dashboard_asset['version'], false);
        }
        if ($screen->id == 'theme-settings_page_hummelt-theme-v3-tools') {
            $dashboard_asset = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/react-tools-plugins/build/index.asset.php';
            wp_enqueue_script('hummelt-theme-v3-dashboard', HUMMELT_THEME_V3_ADMIN_URL . 'admin-dashboard/react-tools-plugins/build/index.js', array('wp-element', 'wp-api-fetch', 'wp-i18n'), $dashboard_asset['version'], true);
            wp_enqueue_style('hummelt-theme-v3-admin-db-style', HUMMELT_THEME_V3_ADMIN_URL . 'admin-dashboard/react-tools-plugins/build/index.css', array(), $dashboard_asset['version'], false);
        }
        if ($screen->id == 'theme-settings_page_hummelt-theme-v3-forms') {
            wp_enqueue_style('editor-buttons');
            wp_enqueue_style('wp-edit-blocks');
            wp_enqueue_editor();
            wp_enqueue_media();
            $dashboard_asset = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/react-theme-forms/build/index.asset.php';
            wp_enqueue_script('hummelt-theme-v3-bs-script', get_template_directory_uri() . '/assets/js/lib/bootstrap.bundle.min.js', array(), HUMMELT_THEME_V3_VERSION, true);
            wp_enqueue_script('hummelt-theme-v3-forms', HUMMELT_THEME_V3_ADMIN_URL . 'admin-dashboard/react-theme-forms/build/index.js', array('wp-editor', 'wp-element', 'wp-api-fetch', 'wp-i18n', 'jquery'), $dashboard_asset['version'], true);
            wp_enqueue_style('hummelt-theme-v3-admin-forms-style', HUMMELT_THEME_V3_ADMIN_URL . 'admin-dashboard/react-theme-forms/build/index.css', array(), $dashboard_asset['version'], false);
        }

        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $theme_wp_optionen = $settings['theme_wp_optionen'];

        if($theme_wp_optionen['material_icons_active']) {
            wp_enqueue_style('material-icons-style', get_template_directory_uri() . '/theme-style/scss/material-design-icons.css', array(), HUMMELT_THEME_V3_VERSION, false);
        }
    }

    public function hummelt_theme_v3_enqueue_block_editor(): void
    {
        //  add_theme_support('hummelt-theme-v3-editor-styles');
        // $screen = get_current_screen();
        if (is_admin()) {
            wp_enqueue_style('hummelt-theme-v3-editor-styles', HUMMELT_THEME_V3_CSS_REST_URL . 'auto-generate-editor-style', array(), '1.0', 'all');
        }
    }
}
