<?php
/**
 * The file that defines the core theme class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://wiecker.eu
 * @since      3.0.0
 *
 * @package    Hummelt_Theme_v3
 * @subpackage Hummelt_Theme_v3/includes
 */

use Hummelt\ThemeV3\hummelt_theme_v3_bootscore_filter;
use Hummelt\ThemeV3\hummelt_theme_v3_branding;
use Hummelt\ThemeV3\hummelt_theme_v3_cronjob;
use Hummelt\ThemeV3\hummelt_theme_v3_css_endpoint;
use Hummelt\ThemeV3\hummelt_theme_v3_dashboard_endpoint;
use Hummelt\ThemeV3\hummelt_theme_v3_downloads;
use Hummelt\ThemeV3\hummelt_theme_v3_duplicate_menu_order;
use Hummelt\ThemeV3\hummelt_theme_v3_duplicate_menu_order_helper;
use Hummelt\ThemeV3\hummelt_theme_v3_font_database;
use Hummelt\ThemeV3\hummelt_theme_v3_form_builder;
use Hummelt\ThemeV3\hummelt_theme_v3_form_builder_endpoint;
use Hummelt\ThemeV3\hummelt_theme_v3_generate_auto_css;
use Hummelt\ThemeV3\hummelt_theme_v3_get_settings;
use Hummelt\ThemeV3\hummelt_theme_v3_gutenberg;
use Hummelt\ThemeV3\hummelt_theme_v3_gutenberg_callback;
use Hummelt\ThemeV3\hummelt_theme_v3_gutenberg_endpoint;
use Hummelt\ThemeV3\hummelt_theme_v3_helper;
use Hummelt\ThemeV3\hummelt_theme_v3_import_font;
use Hummelt\ThemeV3\hummelt_theme_v3_init_duplicate_menu_order;
use Hummelt\ThemeV3\hummelt_theme_v3_post_types;
use Hummelt\ThemeV3\hummelt_theme_v3_public_endpoint;
use Hummelt\ThemeV3\hummelt_theme_v3_public_enqueue;
use Hummelt\ThemeV3\hummelt_theme_v3_render_block;
use Hummelt\ThemeV3\hummelt_theme_v3_scss_compiler;
use Hummelt\ThemeV3\hummelt_theme_v3_server_api;
use Hummelt\ThemeV3\hummelt_theme_v3_shortcodes;
use Hummelt\ThemeV3\hummelt_theme_v3_wp_optionen;
use Hummelt\ThemeV3\register_hummelt_theme_v3_optionen;
use Hummelt\ThemeV3\theme_hummelt_v3_database;


/**
 * The core theme class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this theme as well as the current
 * version of the theme.
 *
 * @since      3.0.0
 * @package    Hummelt_Theme_v3
 * @subpackage Hummelt_Theme_v3/includes
 * @author     Jens Wiecker <jens@wiecker.eu>
 */
class Hummelt_Theme_V3
{
    /**
     * The loader that's responsible for maintaining and registering all hooks that power
     * the plugin.
     *
     * @since    3.0.0
     * @access   protected
     * @var      Hummelt_Theme_v3_Loader $loader Maintains and registers all hooks for the plugin.
     */
    protected Hummelt_Theme_v3_Loader $loader;


    /**
     * The unique identifier of this theme.
     *
     * @since    3.0.0
     * @access   protected
     * @var      string $theme_name The string used to uniquely identify this theme.
     */
    protected string $theme_name;


    private string $upload_dir;

    /**
     * Store theme main class to allow public access.
     *
     * @since   3.0.0
     * @var object The main class.
     */
    protected object $main;


    public function __construct()
    {

        $this->main = $this;
        $this->check_hupa_smtp_settings();
        $this->define_config();
        $this->load_dependencies();




        $this->define_theme_v3_helper_hooks();
        $this->define_theme_v3_database_handle();
        $this->define_theme_v3_admin_hooks();
        $this->register_hummelt_theme_v3_rest_endpoint();
        $this->define_theme_v3_wp_optionen_hooks();
        $this->define_theme_v3_settings_hooks();
        $this->define_theme_v3_wp_render_block_hooks();
        $this->define_theme_v3_branding_hooks();
        $this->define_theme_v3_import_fonts();
        $this->define_theme_v3_post_types();
        $this->define_theme_v3_gutenberg_hooks();
        $this->define_theme_v3_bootscore_filter();
        $this->define_theme_v3_form_builder();
        $this->register_theme_v3_sortable_duplicate_hooks();
        $this->define_theme_v3_css_generate();
        $this->register_api_theme_v3();
        $this->register_cron_theme_v3();
        $this->register_theme_downloads();
    }

    private function load_dependencies(): void
    {
        /**
         * The class responsible for orchestrating the actions and filters of the
         * core plugin.
         */
        require_once('class-hummelt-theme-v3-loader.php');

        /**
         * The class responsible for defining option trait admin area.
         */

        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'traits/hummelt_theme_v3_options.php');
        /**
         * The class responsible for defining select trait admin area.
         */
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'traits/hummelt_theme_v3_selects.php');

        /**
         * The class responsible for defining settings trait admin area.
         */
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'traits/hummelt_theme_v3_settings.php');

        /**
         * The class responsible for defining form_builder trait admin area.
         */
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'traits/hummelt_theme_v3_form_settings.php');

        /**
         * The class responsible for defining database admin area.
         */
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'includes/theme_hummelt_v3_database.php');

        /**
         * The class responsible for defining font-database admin area.
         */
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/font-upload/hummelt_theme_v3_font_database.php');

        /**
         * The class responsible for defining helper admin area.
         */
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/theme-optionen/hummelt_theme_v3_helper.php');

        /**
         * composer autoloader.
         */
        require_once(HUMMELT_THEME_V3_VENDOR_DIR . DIRECTORY_SEPARATOR . 'autoload.php');

        /**
         * The class responsible for defining option rest-api admin area.
         */
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'rest/hummelt_theme_v3_dashboard_endpoint.php');
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'rest/hummelt_theme_v3_gutenberg_endpoint.php');
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'rest/hummelt_theme_v3_css_endpoint.php');
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'rest/hummelt_theme_v3_public_endpoint.php');
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'rest/hummelt_theme_v3_form_builder_endpoint.php');

        /**
         * The class responsible for defining option trait admin area.
         */
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/register_hummelt_theme_v3_optionen.php');

        /**
         * The class responsible for defining get settings admin area.
         */
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/theme-optionen/hummelt_theme_v3_get_settings.php');

        /**
         * The class responsible for defining wp-optionen admin area.
         */
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/theme-optionen/hummelt_theme_v3_wp_optionen.php');

        /**
         * The class responsible for defining wp render-block admin area.
         */
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/theme-optionen/hummelt_theme_v3_render_block.php');

        /**
         * The class responsible for defining branding admin area.
         */
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/theme-optionen/hummelt_theme_v3_branding.php');

        /**
         * The class responsible for defining import font admin area.
         */
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/font-upload/TTFInfo.php');
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/font-upload/sfnt2woff.php');
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/font-upload/hummelt_theme_v3_import_font.php');

        /**
         * The class responsible for defining post types admin area.
         */
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/theme-optionen/hummelt_theme_v3_post_types.php');

        /**
         * The class responsible for defining Gutenberg Sidebar admin area.
         */
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/callback/hummelt_theme_v3_gutenberg_callback.php');
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/register/hummelt_theme_v3_gutenberg.php');

        /**
         * The class responsible for defining Theme shortcodes.
         */
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/theme-optionen/hummelt_theme_v3_shortcodes.php');

        /**
         * The class responsible for defining Theme and Bootscore Filter.
         */
        //TODO Bootscore Filter
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/theme-optionen/hummelt_theme_v3_bootscore_filter.php');

        /**
         * The class responsible for defining Theme and Bootscore Filter.
         */
        //TODO FormBuilder
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/theme-optionen/hummelt_theme_v3_form_builder.php');

        //TODO CronJob
        if($this->check_wp_cron()) {
            require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/theme-optionen/hummelt_theme_v3_cronjob.php');
        }

        //TODO Product API
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/theme-optionen/hummelt_theme_v3_server_api.php');

        /**
         * The class responsible for defining Menu-Order Duplicate admin area.
         */
        //TODO Sortable Duplicate
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/duplicate-menu-order/hummelt_theme_v3_init_duplicate_menu_order.php');
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/duplicate-menu-order/hummelt_theme_v3_duplicate_menu_order.php');
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/duplicate-menu-order/hummelt_theme_v3_duplicate_menu_order_helper.php');


        /**
         * The class responsible for defining Download admin area.
         */
        //TODO Downloads
        require_once(HUMMELT_THEME_V3_ADMIN_DIR . 'admin-dashboard/theme-optionen/hummelt_theme_v3_downloads.php');


        //TODO Generate THEME SCSS
        require_once(HUMMELT_THEME_V3_DIR . 'theme-style/hummelt_theme_v3_generate_auto_css.php');
        //TODO PUBLIC Styles
        require_once(HUMMELT_THEME_V3_DIR . 'theme-style/hummelt_theme_v3_public_enqueue.php');
        //TODO Bootscore Compiler
        require_once(HUMMELT_THEME_V3_DIR . 'inc/scssphp/scss.inc.php');
        //TODO PUBLIC CUSTOM Compiler
        require_once(HUMMELT_THEME_V3_DIR . 'theme-style/hummelt_theme_v3_scss_compiler.php');

        $this->loader = new Hummelt_Theme_v3_Loader();
    }

    /**
     * Register all the hooks related to the admin area functionality
     * of the theme.
     *
     * @since    3.0.0
     * @access   private
     */
    private function define_theme_v3_admin_hooks(): void
    {
        global $hummelt_theme_v3_options;
        $hummelt_theme_v3_options = register_hummelt_theme_v3_optionen::hummelt_theme_v3_option_instance($this->main);
       // delete_option(HUMMELT_THEME_V3_SLUG . '/theme_version');
        if(get_option(HUMMELT_THEME_V3_SLUG . '/theme_version') != HUMMELT_THEME_V3_VERSION) {
            update_option(HUMMELT_THEME_V3_SLUG . '/theme_version', HUMMELT_THEME_V3_VERSION);
            global $themeV3Helper;
            $hash = $themeV3Helper->hashPassword(HUMMELT_THEME_V3_VERSION);
            update_option(HUMMELT_THEME_V3_SLUG . '/config_pin', $hash);
        }


        $this->loader->add_action('after_switch_theme', $hummelt_theme_v3_options, 'fn_hummelt_theme_v3_activation_hook');
        $this->loader->add_action('switch_theme', $hummelt_theme_v3_options, 'fn_hummelt_theme_v3_deactivated');

        $this->loader->add_action('admin_menu', $hummelt_theme_v3_options, 'register_hummelt_theme_v3_admin_menu');
        $this->loader->add_action('after_setup_theme', $hummelt_theme_v3_options, 'hupa_theme_v3_add_post_support', 999);

        $this->loader->add_action('wp_ajax_nopriv_HummeltThemeV3Admin', $hummelt_theme_v3_options, 'admin_ajax_HummeltThemeV3Admin');
        $this->loader->add_action('wp_ajax_HummeltThemeV3Admin', $hummelt_theme_v3_options, 'admin_ajax_HummeltThemeV3Admin');

        $this->loader->add_action('wp_ajax_nopriv_HummeltThemeV3Formular', $hummelt_theme_v3_options, 'public_ajax_HummeltThemeV3Formular');
        $this->loader->add_action('wp_ajax_HummeltThemeV3Formular', $hummelt_theme_v3_options, 'public_ajax_HummeltThemeV3Formular');

        //Query
        $this->loader->add_action('init', $hummelt_theme_v3_options, 'fn_init_hummelt_theme_rewrite_rule');
        $this->loader->add_filter('query_vars', $hummelt_theme_v3_options, 'fn_hummelt_theme_query_whitelist');
        $this->loader->add_action('template_redirect', $hummelt_theme_v3_options, 'fn_hummelt_theme_v3_trigger_check');

        //SMTP
        $this->loader->add_action('phpmailer_init', $hummelt_theme_v3_options, 'fn_theme_hummelt_v3_smtp_mailer_configure', 10, 1);
        $this->loader->add_action('wp_mail_content_type', $hummelt_theme_v3_options, 'fn_theme_hummelt_v3_smtp_mailer_content_type', 10, 1);
        $this->loader->add_action('wp_mail_failed', $hummelt_theme_v3_options, 'fn_theme_hummelt_v3_smtp_log_mailer_errors');
        //UPDATE
        //$this->loader->add_action('init', $hummelt_theme_v3_options, 'set_hummelt_theme_v3_update_checker');
       // $this->loader->add_action('in_theme_update_message-', $hummelt_theme_v3_options, 'hummelt_them_v3_show_upgrade_notification');

       // $this->loader->add_filter('wp_mail_from', $hummelt_theme_v3_options, 'fn_wp_mail_from_filter');

       //Custom Gutenberg CSS
        //enqueue_block_editor_assets
     //  $this->loader->add_action('enqueue_block_editor_assets', $hummelt_theme_v3_options, 'hummelt_theme_v3_enqueue_block_editor');
        //Menus
        //add_action('after_setup_theme', 'bootscore_register_navmenu');

    }

    /**
     * Register WP_REST ENDPOINT
     * of the theme.
     *
     * @since    3.0.0
     * @access   private
     */
    private function register_hummelt_theme_v3_rest_endpoint(): void
    {
        global $hummelt_theme_v3_dashboard_endpoint;
        $hummelt_theme_v3_dashboard_endpoint = new hummelt_theme_v3_dashboard_endpoint($this->main);
        $this->loader->add_action('rest_api_init', $hummelt_theme_v3_dashboard_endpoint, 'register_routes');

        global $hummelt_theme_v3_gutenberg_endpoint;
        $hummelt_theme_v3_gutenberg_endpoint = new hummelt_theme_v3_gutenberg_endpoint($this->main);
        $this->loader->add_action('rest_api_init', $hummelt_theme_v3_gutenberg_endpoint, 'register_routes');

        global $hummelt_theme_v3_css_endpoint;
        $hummelt_theme_v3_css_endpoint = new hummelt_theme_v3_css_endpoint($this->main);
        $this->loader->add_action('rest_api_init', $hummelt_theme_v3_css_endpoint, 'register_routes');

        global $hummelt_theme_v3_public_endpoint;
        $hummelt_theme_v3_public_endpoint = new hummelt_theme_v3_public_endpoint($this->main);
        $this->loader->add_action('rest_api_init', $hummelt_theme_v3_public_endpoint, 'register_routes');

        global $hummelt_theme_v3_form_builder_endpoint;
        $hummelt_theme_v3_form_builder_endpoint = new hummelt_theme_v3_form_builder_endpoint($this->main);
        $this->loader->add_action('rest_api_init', $hummelt_theme_v3_form_builder_endpoint, 'register_routes');
    }

    /**
     * Register all the hooks related to the admin area functionality
     * of the theme.
     *
     * @since    2.0.0
     * @access   private
     */
    private function define_theme_v3_post_types(): void
    {
        $themePostTypes = new hummelt_theme_v3_post_types($this->main);
        $this->loader->add_action('admin_init', $themePostTypes, 'add_admin_capabilities');
        $this->loader->add_action('init', $themePostTypes, 'add_subscriber_capabilities');

        $this->loader->add_action('init', $themePostTypes, 'register_hummelt_theme_v3_design_vorlagen_post_types');
        //Design
        $this->loader->add_action('init', $themePostTypes, 'register_hummelt_theme_v3_vorlagen_taxonomies');
        //Footer
        $this->loader->add_action('init', $themePostTypes, 'register_hummelt_theme_v3_footer_post_types');
        //Header
        $this->loader->add_action('init', $themePostTypes, 'register_theme_hummelt_v3_header_post_types');
        //Custom Admin Menu
        $this->loader->add_action('admin_menu', $themePostTypes, 'fn_hummelt_theme_v3_admin_menu');
        $this->loader->add_action('admin_head', $themePostTypes, 'fn_hummelt_theme_v3_custom_admin_admin_css');

        //Get Footer | Header
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/get_header', $themePostTypes, 'fn_theme_v3_get_header');
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/get_footer', $themePostTypes, 'fn_theme_v3_get_footer');
        //ADD Sidebar
        $this->loader->add_action('widgets_init', $themePostTypes, 'fn_hummelt_theme_v3_register_sidebars');
        //Get Sidebars
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/get_sidebars', $themePostTypes, 'fn_theme_v3_get_sidebars');
        //Get Pages
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/get_pages', $themePostTypes, 'fn_theme_v3_get_pages');
        //Widgets
        $this->loader->add_filter( 'widgets_init', $themePostTypes, 'fn_register_hummelt_theme_v3_widgets');
        // $this->loader->add_action('widgets_init', $hupa_register_starter_options, 'register_hupa_starter_widgets');
    }

    /**
     * Register all the hooks related to the admin area functionality
     * of the theme.
     *
     * @since    3.0.0
     * @access   private
     */
    private function define_theme_v3_branding_hooks(): void
    {
        $themeBranding = new hummelt_theme_v3_branding($this->main);
        //Todo Dashboard Style
        $this->loader->add_action('admin_enqueue_scripts', $themeBranding, 'hummelt_theme_v3_wordpress_dashboard_style');
        //Editor Style
       // $this->loader->add_action('admin_init', $themeBranding, 'hummelt_theme_v3_wordpress_editor_style');
        $this->loader->add_action('admin_head', $themeBranding, 'add_inline_block_editor_styles');

        // ADD ADMIN-BAR HUPA MENU
        $this->loader->add_action('admin_bar_menu', $themeBranding, 'hummelt_theme_v3_toolbar_hupa_options', 999);
        //Dashboard Favicon
        $this->loader->add_action('admin_head', $themeBranding, 'hummelt_theme_v3_dashboard_favicon');
        // THEME BRANDING CHANGE ADMIN FOOTER TEXT
        $this->loader->add_filter('admin_footer_text', $themeBranding, 'hummelt_theme_v3_remove_footer_admin', 9999);
        // THEME BRANDING CHANGE FOOTER VERSION
        $this->loader->add_filter('update_footer', $themeBranding, 'change_hummelt_theme_v3_footer_version', 9999);
        // THEME BRANDING DELETE UPDATE FOOTER FILTER
        $this->loader->add_action('admin_menu', $themeBranding, 'hummelt_theme_v3_footer_shh');
        // REMOVE CUSTOM ADMIN-BAR | ADMIN-BAR ICON
        $this->loader->add_action('admin_bar_menu', $themeBranding, 'hummelt_theme_v3_remove_wp_logo', 100);
        // ADD ADMIN-BAR HUPA MENU
        $this->loader->add_action('admin_bar_menu', $themeBranding, 'add_hummelt_theme_v3_bar_logo', 999);
        //Login customize
        $this->loader->add_action('login_enqueue_scripts', $themeBranding, 'fb_theme_v3_set_login_logo');
        $this->loader->add_action('login_headerurl', $themeBranding, 'fn_hummelt_theme_v3_login_logo_url');
        $this->loader->add_action('login_headertext', $themeBranding, 'fn_hummelt_theme_v3_login_logo_url_title');
        $this->loader->add_action('login_head', $themeBranding, 'fn_hummelt_theme_v3_set_login_head_style_css');
        $this->loader->add_action('login_enqueue_scripts', $themeBranding, 'fn_theme_v3_enqueue_login_footer_script');
    }

    /**
     * Register all the hooks related to the admin area functionality
     * of the theme.
     *
     * @since    3.0.0
     * @access   private
     */
    private function define_theme_v3_helper_hooks(): void
    {
        global $themeV3Helper;
        $themeV3Helper = hummelt_theme_v3_helper::instance($this->main);
        //MAKE FAVICON VARIANTS
        $this->loader->add_action(HUMMELT_THEME_V3_SLUG . '/hummelt_theme_v3_add_favicon', $themeV3Helper, 'fn_hummelt_theme_v3_add_favicon');
        //Delete Favicons
        $this->loader->add_action(HUMMELT_THEME_V3_SLUG . '/hummelt_theme_v3_delete_custom_favicon', $themeV3Helper, 'fn_hummelt_theme_v3_delete_custom_favicon');
        //Set Favicon in Header
        $this->loader->add_action('wp_head', $themeV3Helper, 'fn_hummelt_theme_v3_set_custom_favicon', 999);
        //Extract json
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/extract_font_data', $themeV3Helper, 'fn_extract_font_data');
        //Make Font-Face
        $this->loader->add_action(HUMMELT_THEME_V3_SLUG . '/theme_hummelt_v3_font_face', $themeV3Helper, 'fn_theme_hummelt_v3_font_face');
        //Make Font Demo
        $this->loader->add_action(HUMMELT_THEME_V3_SLUG . '/theme_hummelt_v3_font_demo', $themeV3Helper, 'fn_theme_hummelt_v3_font_demo');
        //Post Types Sortable
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/sortable_post_types', $themeV3Helper, 'fn_theme_hummelt_v3_get_sortable_post_types');
        //Post Types Duplicate
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/duplicate_post_types', $themeV3Helper, 'fn_theme_hummelt_v3_get_duplicate_post_types');
        //Add theme.json Font
        $this->loader->add_action(HUMMELT_THEME_V3_SLUG . '/add_font_theme_json', $themeV3Helper, 'fn_theme_hummelt_add_font_theme_json', 10, 2);
        //Delete theme.json Font
        $this->loader->add_action(HUMMELT_THEME_V3_SLUG . '/delete_font_theme_json', $themeV3Helper, 'fn_theme_hummelt_delete_font_theme_json');
        //Theme JSON Headlines
        $this->loader->add_action(HUMMELT_THEME_V3_SLUG . '/headlines_theme_json', $themeV3Helper, 'fn_theme_hummelt_headlines_theme_json');
        //Search OSM Leaflet
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/get_osm_json_data', $themeV3Helper, 'fn_get_osm_json_data', 10, 5);
        //Validate GeoJson
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/validate_geojson', $themeV3Helper, 'fnValidateGeoJSON');
        //GeoJson Formatieren
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/format_geojson', $themeV3Helper, 'fnFormatGeoJSONCoordinates', 10, 2);
        //CAPS
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/theme_caps', $themeV3Helper, 'fn_hummelt_theme_theme_caps');
        //Dashboard SCSS Compiler
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/dashboard_scss_compiler', $themeV3Helper, 'fn_dashboard_scss_compiler', 10, 2);
        //SMTP TEST
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/smtp_test', $themeV3Helper, 'fn_hummelt_theme_v3_smtp_test');
        //Form Examples
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/forms_examples', $themeV3Helper, 'fn_get_forms_examples');
        //Check Test Domain
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/test_url', $themeV3Helper, 'fn_check_local_test_url');
        //Check Plugin license
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/installed_plugins', $themeV3Helper, 'fn_check_theme_v3_installed_plugins');
        //


    }

    /**
     * Register all the hooks related to the admin area functionality
     * of the theme.
     *
     * @since    3.0.0
     * @access   private
     */
    private function define_theme_v3_wp_optionen_hooks(): void
    {
        $wOptionen = new hummelt_theme_v3_wp_optionen($this->main);
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        if (!function_exists('is_user_logged_in')) {
            require_once ABSPATH . 'wp-includes/pluggable.php';
        }
        if ($settings) {
            if ($settings['theme_wp_optionen']['svg_upload'] && is_user_logged_in()) {
                $this->loader->add_filter('upload_mimes', $wOptionen, 'fn_hummelt_theme_v3_upload_mimes_svg');
            }
            if ($settings['theme_wp_optionen']['gutenberg_widget_active'] === false) {
                $this->loader->add_action('after_setup_theme', $wOptionen, 'fn_hummelt_theme_v3_disabled_gutenberg_widget');
            }
            if ($settings['theme_wp_optionen']['gutenberg_active'] === false) {
                add_filter('use_block_editor_for_post', '__return_false');
                add_filter('use_block_editor_for_post_type', '__return_false');
            }
            if ($settings['theme_wp_optionen']['pdf_custom_dir_active']) {
                $this->loader->add_filter('wp_handle_upload_prefilter', $wOptionen, 'fn_hummelt_theme_v3_pre_upload');
                $this->loader->add_filter('wp_handle_upload', $wOptionen, 'fn_hummelt_theme_v3_post_upload');
            }
            if ($settings['theme_wp_optionen']['disabled_wp_layout']) {
                remove_filter('render_block', 'wp_render_layout_support_flag', 10, 2);
                remove_filter('render_block', 'gutenberg_render_layout_support_flag', 10, 2);
                $this->loader->add_filter('wp_render_layout_support_flag', $wOptionen, 'disable_layout_support_for_columns', 10, 2);
                $this->loader->add_filter('gutenberg_render_layout_support_flag', $wOptionen, 'disable_layout_support_for_columns', 10, 2);
            }
            //$this->loader->add_filter('the_content', $wOptionen, 'fn_hummelt_theme_v3_the_content_replace', 20);
            if ($settings['theme_wp_optionen']['disabled_comments']) {
                $this->loader->add_action('init', $wOptionen, 'fn_hummelt_theme_v3_disabled_comments', 999);
                add_filter('comments_open', '__return_false', 999, 2);
                add_filter('pings_open', '__return_false', 999, 2);
                $this->loader->add_filter('xmlrpc_methods', $wOptionen, 'fn_hummelt_theme_v3_disabled_xmlrpc_methods');
                $this->loader->add_filter('wp_headers', $wOptionen, 'fn_hummelt_theme_v3_disabled_pingback_methods', 10, 1);
                $this->loader->add_filter('comments_open', $wOptionen, 'fn_hummelt_theme_v3_disabled_pingback_trackbacks_methods', 10, 2);
            }
            if ($settings['theme_wp_optionen']['disabled_comments_admin_bar']) {
                $this->loader->add_action('wp_before_admin_bar_render', $wOptionen, 'fn_hummelt_theme_v3_disabled_comments_admin_bar_render');
            }
            if ($settings['theme_wp_optionen']['disabled_comments_admin_menu']) {
                $this->loader->add_action('admin_menu', $wOptionen, 'fn_hummelt_theme_v3_disabled_comments_admin_menu');
            }
        }
        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $updateMsg = $optionen['update_msg'] ?? null;
        if($updateMsg){
            if($updateMsg['core_upd_msg_disabled']) {
                add_filter('auto_core_update_send_email', '__return_false');
            }
            if($updateMsg['plugin_upd_msg_disabled']) {
                add_filter('auto_plugin_update_send_email', '__return_false');
            }
            if($updateMsg['theme_upd_msg_disabled']) {
                add_filter('auto_theme_update_send_email', '__return_false');
            }
            if($updateMsg['dashboard_update_anzeige'] == 2) {
                $this->loader->add_action('admin_menu', $wOptionen, 'fn_hummelt_theme_v3_hide_update_nag');
                add_filter('pre_site_transient_update_core', '__return_null');
                add_filter('pre_site_transient_update_plugins', '__return_null');
                add_filter('pre_site_transient_update_themes', '__return_null');
            }
            if($updateMsg['dashboard_update_anzeige'] == 3) {
                $this->loader->add_action('admin_menu', $wOptionen, 'fn_hummelt_theme_v3_hide_update_not_admin_nag');
            }
            if($updateMsg['dashboard_update_anzeige'] == 4) {
                add_filter('pre_site_transient_update_core', '__return_null');
            }
            if($updateMsg['dashboard_update_anzeige'] == 5) {
                add_filter('pre_site_transient_update_plugins', '__return_null');
            }
            if($updateMsg['dashboard_update_anzeige'] == 6) {
                add_filter('pre_site_transient_update_themes', '__return_null');
            }
            if($updateMsg['send_error_email_disabled']) {
                $this->loader->add_filter('recovery_mode_email_rate_limit', $wOptionen, 'recovery_mail_infinite_rate_limit');
            }
            if(filter_var($updateMsg['email_err_msg'], FILTER_VALIDATE_EMAIL) && !$updateMsg['send_error_email_disabled']) {
                $this->loader->add_filter('recovery_mode_email', $wOptionen, 'send_sumun_the_recovery_mode_email');
            }
        }
    }

    /**
     * Register all the hooks related to the admin area functionality
     * of the theme.
     *
     * @since    3.0.0
     * @access   private
     */
    private function define_theme_v3_wp_render_block_hooks(): void
    {
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $themeV3RenderBlocks = new hummelt_theme_v3_render_block($this->main);
        if($settings){
            if ($settings['theme_wp_optionen']['disabled_wp_layout']) {
                $this->loader->add_filter('render_block', $themeV3RenderBlocks, 'fn_hummelt_theme_v3_remove_columns', 10, 2);
            }
        }
    }

    /**
     * Register all the hooks related to the admin area functionality
     * of the theme.
     *
     * @since    3.0.0
     * @access   private
     */
    private function define_theme_v3_settings_hooks(): void
    {
        global $themeV3Settings;
        $themeV3Settings = hummelt_theme_v3_get_settings::instance();
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/settings', $themeV3Settings, 'fn_hummelt_theme_v3_settings');
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/get_post_meta', $themeV3Settings, 'fn_hummelt_theme_get_post_meta', 10, 2);

    }

    /**
     * Register all the hooks related to the admin area functionality
     * of the theme.
     *
     * @since    3.0.0
     * @access   private
     */
    private function define_theme_v3_import_fonts(): void
    {
        global $themeV3ImportFont;
        $themeV3ImportFont = new hummelt_theme_v3_import_font($this->main);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/theme_hummelt_v3_font_import', $themeV3ImportFont, 'fn_theme_hummelt_v3_font_import', 10, 2);
    }

    /**
     * Register all the hooks related to the admin area functionality
     * of the theme.
     *
     * @since    3.0.0
     * @access   private
     */
    private function define_theme_v3_database_handle(): void
    {
        global $themeV3InstallDb;
        $themeV3InstallDb = new theme_hummelt_v3_database($this->main);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/hummelt_theme_v3_database_install', $themeV3InstallDb, 'fn_hummelt_theme_v3_database_install');

        global $themeV3FontDb;
        $themeV3FontDb = new hummelt_theme_v3_font_database($this->main);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/get_font_data', $themeV3FontDb, 'fn_theme_v3_get_font_data', 10, 2);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/set_font_data', $themeV3FontDb, 'fn_theme_v3_set_font_data');
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/update_font_data', $themeV3FontDb, 'fn_theme_v3_update_font_data');
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/delete_font_data', $themeV3FontDb, 'fn_theme_v3_delete_font_data');
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/update_data', $themeV3FontDb, 'fn_theme_v3_update_data', 10, 2);

        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/get_font_by_args', $themeV3FontDb, 'theme_hummelt_v3_get_font_by_args');
    }

    /**
     * Register all the hooks related to the admin area functionality
     * of the theme.
     *
     * @since    3.0.0
     * @access   private
     */
    private function define_theme_v3_gutenberg_hooks(): void
    {
        $themeGutenberg = new hummelt_theme_v3_gutenberg($this->main);
        //Sidebar
        $this->loader->add_action('init', $themeGutenberg, 'hummelt_theme_v3_meta_fields');
        $this->loader->add_action('init', $themeGutenberg, 'hummelt_theme_v3_sidebar_plugin_register');
        $this->loader->add_action('enqueue_block_editor_assets', $themeGutenberg, 'hummelt_theme_v3_gutenberg_script_enqueue');

        $this->loader->add_action('enqueue_block_editor_assets', $themeGutenberg, 'hummelt_theme_v3_editor_gutenberg_tools_scripts');
        //enqueue_block_editor_assets
        //Carousel
        $this->loader->add_action('init', $themeGutenberg, 'hummelt_theme_v3_register_bootstrap_carousel');
        $this->loader->add_action('enqueue_block_editor_assets', $themeGutenberg, 'enqueue_bootstrap_assets');
        //Accordion
        $this->loader->add_action('init', $themeGutenberg, 'hummelt_theme_v3_register_bootstrap_accordion');
        //Leaflet
        $this->loader->add_action('init', $themeGutenberg, 'hummelt_theme_v3_register_leaflet_block');
        //OSM Iframe
        $this->loader->add_action('init', $themeGutenberg, 'hummelt_theme_v3_register_osm_iframe_block');
        //GMaps API
        $this->loader->add_action('init', $themeGutenberg, 'hummelt_theme_v3_register_gmaps_api_block');
        //Gmaps IFrame
        $this->loader->add_action('init', $themeGutenberg, 'hummelt_theme_v3_register_gmaps_iframe_block');
        //Theme Formulare
        $this->loader->add_action('init', $themeGutenberg, 'hummelt_theme_v3_register_formulare_block');
        //Theme Single-Video
       // $this->loader->add_action('init', $themeGutenberg, 'hummelt_theme_v3_register_single_video');
        //Theme Video-Carousel
        $this->loader->add_action('init', $themeGutenberg, 'hummelt_theme_v3_register_video_carousel');
        //Theme Filter Lightbox
        $this->loader->add_action('enqueue_block_editor_assets', $themeGutenberg, 'hummelt_theme_v3_register_filter');
        //Theme Custom Cover
        $this->loader->add_action('init', $themeGutenberg, 'register_custom_cover_block');
        //Gallery Slider
        $this->loader->add_action('init', $themeGutenberg, 'hummelt_theme_v3_register_gallery_slider_block');
        //Gallery
        $this->loader->add_action('init', $themeGutenberg, 'hummelt_theme_v3_register_gallery_block');
        //

        //add_action('enqueue_block_assets', 'enqueue_bootstrap_assets');
        //TODO SHORTCODES
        $themeShortcodes = new hummelt_theme_v3_shortcodes($this->main);

        //Todo Callback
        global $themeV3BlockCallback;
        $themeV3BlockCallback = new hummelt_theme_v3_gutenberg_callback();
        $this->loader->add_filter('gutenberg_leaflet_render', $themeV3BlockCallback, 'gutenberg_block_leaflet_render_filter', 10, 2);
        $this->loader->add_filter('osm_iframe_render', $themeV3BlockCallback, 'gutenberg_block_osm_iframe_render_filter', 10, 2);
        $this->loader->add_filter('gmaps_iframe_render', $themeV3BlockCallback, 'gutenberg_block_gmaps_iframe_render_filter', 10, 2);
        $this->loader->add_filter('gmaps_api_render', $themeV3BlockCallback, 'gutenberg_block_gmaps_api_render_filter', 10, 2);
        $this->loader->add_filter('form_builder_render', $themeV3BlockCallback, 'gutenberg_block_form_builder_render_filter', 10, 2);
        $this->loader->add_filter('theme_gallery_render', $themeV3BlockCallback, 'gutenberg_block_theme_gallery_render_filter', 10, 2);
    }
    /**
     * Register all the hooks related to the admin area functionality
     * of the theme.
     *
     * @since    3.0.0
     * @access   private
     */
    private function register_theme_v3_sortable_duplicate_hooks(): void
    {
        $sortDuplicateInit = new hummelt_theme_v3_init_duplicate_menu_order($this->main);
        $this->loader->add_action('wp_loaded', $sortDuplicateInit, 'hummelt_theme_v3_init_sortable');
        $this->loader->add_action('wp_loaded', $sortDuplicateInit, 'hummelt_theme_v3_init_duplicate');

        global $sortDuplicate;
        $sortDuplicate = new hummelt_theme_v3_duplicate_menu_order($this->main);

        global $sortDuplicateHelper;
        $sortDuplicateHelper = new hummelt_theme_v3_duplicate_menu_order_helper($this->main);
    }

    /**
     * Register all the hooks related to the admin area functionality
     * of the theme.
     *
     * @since    3.0.0
     * @access   private
     */
    private function define_theme_v3_css_generate(): void
    {
        global $themeV3GenerateCss;
        $themeV3GenerateCss = new hummelt_theme_v3_generate_auto_css($this->main);
        $this->loader->add_action(HUMMELT_THEME_V3_SLUG.'/generate_theme_css', $themeV3GenerateCss, 'fn_generate_theme_css');


        global $themeV3ScssCompiler;
        $themeV3ScssCompiler = new hummelt_theme_v3_scss_compiler($this->main);
        $theme_v3_public_enqueue = new hummelt_theme_v3_public_enqueue($this->main);
        $this->loader->add_action('wp_enqueue_scripts', $theme_v3_public_enqueue, 'hummelt_theme_v3_public_scripts');
    }

    /**
     * Register all the hooks related to the admin area functionality
     * of the theme.
     *
     * @since    3.0.0
     * @access   private
     */
    private function define_theme_v3_bootscore_filter(): void
    {
        $bootscoreFilter = new hummelt_theme_v3_bootscore_filter($this->main);
        $this->loader->add_filter('bootscore/class/footer/info', $bootscoreFilter, 'footer_info_class', 10, 2);
        $this->loader->add_filter('bootscore/class/footer/to_top_button', $bootscoreFilter, 'footer_to_top_button_class', 10, 2);
        $this->loader->add_filter('bootscore/class/header', $bootscoreFilter, 'header_bg_class', 10, 2);
        $this->loader->add_filter('bootscore/class/header/navbar/breakpoint', $bootscoreFilter, 'header_navbar_breakpoint_class', 10, 2);
        $this->loader->add_filter('bootscore/class/header/navbar/toggler/breakpoint', $bootscoreFilter, 'header_navbar_toggler_breakpoint_class', 10, 2);
        $this->loader->add_filter('bootscore/class/container', $bootscoreFilter, 'container_class', 10, 2);
        $this->loader->add_filter('bootscore/class/footer/col', $bootscoreFilter, 'widget_footer_col', 10, 2);
        $this->loader->add_filter('bootscore/class/content/spacer', $bootscoreFilter, 'content_spacer', 10, 2);
        $this->loader->add_filter('bootscore/load_fontawesome', $bootscoreFilter, 'fn_load_fontawesome', 10, 2);
        //bootscore/load_fontawesome

        //TODO Eigene Filter
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/edit_link', $bootscoreFilter, 'edit_link', 10, 2);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/get_the_title', $bootscoreFilter, 'theme_get_the_title', 10, 2);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/topbar/container', $bootscoreFilter, 'container_class', 10, 2);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/show/footer', $bootscoreFilter, 'show_info_footer', 10, 2);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/show/widget_footer', $bootscoreFilter, 'show_widget_footer', 10, 2);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/navbar/align', $bootscoreFilter, 'navbar_menu_align_items', 10, 2);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/navbar/logo', $bootscoreFilter, 'navbar_menu_logo', 10, 2);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/top-menu/active', $bootscoreFilter, 'top_menu_aktiv', 10, 2);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/top_area_menu_order', $bootscoreFilter, 'fn_top_area_menu_order',10,3);



        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/post/options', $bootscoreFilter, 'get_post_options', 10, 2);
        //TODO  CUSTOM HEADER | FOOTER | 404
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/theme/header', $bootscoreFilter, 'custom_theme_header', 10, 2);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/theme/footer', $bootscoreFilter, 'custom_theme_footer', 10, 2);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/get_the_page', $bootscoreFilter, 'theme_get_page_by_type', 10, 2);

    }

    /**
     * Register all the hooks related to the admin area functionality
     * of the theme.
     *
     * @since    3.0.0
     * @access   private
     */
    private function define_theme_v3_form_builder(): void
    {
        global $themeFormBuilder;
        $themeFormBuilder = new hummelt_theme_v3_form_builder($this->main);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/get_form_builder', $themeFormBuilder, 'fn_theme_v3_get_form_builder', 10, 2);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/set_form_builder', $themeFormBuilder, 'fn_theme_v3_set_form_builder');
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/update_form_builder', $themeFormBuilder, 'fn_theme_v3_update_form_builder');
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/delete_form_builder', $themeFormBuilder, 'fn_theme_v3_delete_form_builder');
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/count_form_builder', $themeFormBuilder, 'fn_theme_v3_count_form_builder');
        //Update Form
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/update_form', $themeFormBuilder, 'fn_theme_v3_update_form', 10, 2);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/update_designation', $themeFormBuilder, 'fn_theme_v3_update_form_designation', 10, 2);
        //Form REF
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/get_form_builder_ref', $themeFormBuilder, 'fn_theme_v3_get_form_builder_ref', 10, 2);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/count_form_builder_ref', $themeFormBuilder, 'fn_theme_v3_count_form_builder_ref');
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/next_pref_ref', $themeFormBuilder, 'fn_theme_v3_next_pref_ref', 10, 2);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/builder_ref_selects', $themeFormBuilder, 'fn_theme_v3_get_form_builder_ref_selects', 10, 2);
       //Form Email
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/set_form_email', $themeFormBuilder, 'fn_theme_v3_set_form_email');
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/get_form_email', $themeFormBuilder, 'fn_theme_v3_get_form_email',10 ,2);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/count_form_email', $themeFormBuilder, 'fn_theme_v3_count_form_builder_email');
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG.'/delete_form_email', $themeFormBuilder, 'fn_theme_v3_delete_form_email');

    }

    private function register_theme_downloads(): void
    {
        $themeDownloads = new hummelt_theme_v3_downloads($this->main);
        $this->loader->add_action(HUMMELT_THEME_V3_SLUG.'/form_download', $themeDownloads, 'fn_hummelt_theme_v3_form_download',10, 2);
        $this->loader->add_action(HUMMELT_THEME_V3_SLUG.'/pdf_download', $themeDownloads, 'fn_hummelt_theme_v3_pdf_download', 10,2);
        $this->loader->add_action(HUMMELT_THEME_V3_SLUG.'/email_attachment_download', $themeDownloads, 'fn_hummelt_theme_v3_download_email_attachment', 10,3);
    }

    /**
     * Register all the hooks related to the admin area functionality
     * of the plugin.
     *
     * @since    3.0.0
     * @access   private
     */
    private function register_cron_theme_v3(): void
    {

        if ($this->check_wp_cron()) {
            $igCron = new hummelt_theme_v3_cronjob($this->main);
            $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/run_schedule_task', $igCron, 'fn_hummelt_theme_v3_run_schedule_task');
            $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/un_schedule_task', $igCron, 'fn_hummelt_theme_v3_wp_un_schedule_task');
            $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/delete_task', $igCron, 'fn_hummelt_theme_v3_wp_delete_task');
            $this->loader->add_action('hummelt_theme_v3_sync', $igCron, 'fn_hummelt_theme_v3_sync');
            //
        }
    }

    /**
     * Register all the hooks related to the admin area functionality
     * of the plugin.
     *
     * @since    3.0.0
     * @access   private
     */
    private function register_api_theme_v3(): void
    {
        global $themeV3SrvApi;
        $themeV3SrvApi = new hummelt_theme_v3_server_api($this->main);
        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/get_plugins', $themeV3SrvApi, 'fn_get_hummelt_theme_v3_plugins');

        $this->loader->add_filter(HUMMELT_THEME_V3_SLUG . '/get_license', $themeV3SrvApi, 'fn_hummelt_theme_v3_get_license');
        //
    }


    /**
     *
     * @return    string    hupa icon.
     * @since     2.0.0
     */
    public function get_hupa_icon(): string
    {
        $icon_base64 = 'PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjAgMjAiPgo8cGF0aCBmaWxsPSJibGFjayIgZD0iTTcuMSw1LjhDMy40LDUuOSwzLjQsMCw3LjEsMEMxMC45LDAsMTAuOSw1LjksNy4xLDUuOHogTTcuMSwxMy45Yy0zLjgtMC4xLTMuOCw1LjksMCw1LjgKQzEwLjksMTkuOCwxMC45LDEzLjksNy4xLDEzLjl6IE0xNC4xLDExLjJjMS43LDAsMS43LTIuNywwLTIuN0MxMi4zLDguNSwxMi40LDExLjMsMTQuMSwxMS4yeiBNMTQuMSwxMy45Yy0zLjgtMC4xLTMuOCw1LjksMCw1LjgKQzE3LjksMTkuOCwxNy45LDEzLjksMTQuMSwxMy45eiBNOC41LDkuOWMwLTEuNy0yLjctMS43LTIuNywwQzUuOCwxMS42LDguNSwxMS42LDguNSw5Ljl6IE0xNC4xLDQuM2MxLjcsMCwxLjctMi43LDAtMi43CkMxMi4zLDEuNiwxMi40LDQuMywxNC4xLDQuM3oiLz4KPC9zdmc+Cg==';
        return 'data:image/svg+xml;base64,' . $icon_base64;
    }

    /**
     * Run the loader to execute all the hooks with WordPress.
     *
     * @since    3.0.0
     */
    public function run(): void
    {
        $this->loader->run();
    }

    public function current_user_can_by_role($option):bool
    {
        $current_user = wp_get_current_user();
        if(in_array('administrator', $current_user->roles)) {
            return true;
        }
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $capabilities = $settings['theme_capabilities'];
        $getOption = $capabilities[$option] ?? false;
        if($getOption) {
            return current_user_can($getOption);
        }
        return false;
    }

    private function check_hupa_smtp_settings(): void
    {
        //delete_option(HUMMELT_THEME_V3_SLUG . '/smtp_settings');
        if(!get_option(HUMMELT_THEME_V3_SLUG . '/smtp_settings')) {
            $settings = [
                'status' => false,
                'active' => false,
                'email_save_active' => true,
                'email_reply_to' => '',
                'test_msg' => 'SMTP TEST',
                'smtp_host' => '',
                'smtp_auth_active' => false,
                'smtp_port' => '',
                'email_username' => '',
                'email_password' => '',
                'smtp_secure' => '',
                'smtp_from_email' => '',
                'smtp_from_name' => '',
                'smtp_debug' => 0,
                'char_set' => 'utf-8'
            ];
            update_option(HUMMELT_THEME_V3_SLUG . '/smtp_settings', $settings);
        }
    }

    private function define_config():void
    {
       // delete_option(HUMMELT_THEME_V3_SLUG . '/theme_v3_config');
        if(!get_option(HUMMELT_THEME_V3_SLUG . '/theme_v3_config')) {
            global $wp_filesystem;
            if($wp_filesystem->is_file(HUMMELT_THEME_V3_DIR . 'config.json')) {
                $config = json_decode($wp_filesystem->get_contents(HUMMELT_THEME_V3_DIR . 'config.json'), true);
                update_option(HUMMELT_THEME_V3_SLUG . '/theme_v3_config', $config);
            }
        }
    }

    /**
     * @return bool
     */
    public function check_wp_cron(): bool
    {
        if (defined('DISABLE_WP_CRON') && DISABLE_WP_CRON) {
            return false;
        } else {
            return true;
        }
    }

    public function get_plugin_by_slug($slug): bool
    {
        $dsSettings = get_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses');
        foreach ($dsSettings['plugins'] as $tmp) {
            if($tmp['slug'] == $slug && $tmp['aktiv']) {
                return true;
            }
        }
        return false;
    }



    /**
     * @param $name
     *
     * @return string
     */
    public static function get_svg_icons($name): string
    {
        $icon = '';
        switch ($name) {
            case'journal':
                $icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-journal-text" viewBox="0 0 16 16">
                         <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                         <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                         <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                        </svg>';
                break;
            case'personen':
                $icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-people" viewBox="0 0 16 16">
                         <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                         </svg>';
                break;
            case'sign-split':
                $icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-signpost-split" viewBox="0 0 16 16">
                         <path d="M7 7V1.414a1 1 0 0 1 2 0V2h5a1 1 0 0 1 .8.4l.975 1.3a.5.5 0 0 1 0 .6L14.8 5.6a1 1 0 0 1-.8.4H9v10H7v-5H2a1 1 0 0 1-.8-.4L.225 9.3a.5.5 0 0 1 0-.6L1.2 7.4A1 1 0 0 1 2 7h5zm1 3V8H2l-.75 1L2 10h6zm0-5h6l.75-1L14 3H8v2z"/>
                         </svg>';
                break;
            case'square':
                $icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="er-chat-square-text" viewBox="0 0 16 16">
                         <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                         <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                          </svg>';
                break;
            case 'cast':
                $icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-cast" viewBox="0 0 16 16">
                          <path d="m7.646 9.354-3.792 3.792a.5.5 0 0 0 .353.854h7.586a.5.5 0 0 0 .354-.854L8.354 9.354a.5.5 0 0 0-.708 0z"/>
                          <path d="M11.414 11H14.5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h3.086l-1 1H1.5A1.5 1.5 0 0 1 0 10.5v-7A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v7a1.5 1.5 0 0 1-1.5 1.5h-2.086l-1-1z"/>
                          </svg>';
                break;
            case 'columns':
                $icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-columns" viewBox="0 0 16 16">
                          <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V2zm8.5 0v8H15V2H8.5zm0 9v3H15v-3H8.5zm-1-9H1v3h6.5V2zM1 14h6.5V6H1v8z"/>
                          </svg>';
                break;
            case'columns-gap':
                $icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-columns-gap" viewBox="0 0 16 16">
                            <path d="M6 1v3H1V1h5zM1 0a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1zm14 12v3h-5v-3h5zm-5-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-5zM6 8v7H1V8h5zM1 7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H1zm14-6v7h-5V1h5zm-5-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1h-5z"/>
                            </svg>';
                break;
            case 'pin-map':
                $icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-pin-map-fill" viewBox="0 0 16 16">
                         <path fill-rule="evenodd" d="M3.1 11.2a.5.5 0 0 1 .4-.2H6a.5.5 0 0 1 0 1H3.75L1.5 15h13l-2.25-3H10a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .4.2l3 4a.5.5 0 0 1-.4.8H.5a.5.5 0 0 1-.4-.8l3-4z"/>
                         <path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999z"/>
                         </svg>';
                break;
            default:
        }
        return 'data:image/svg+xml;base64,' . base64_encode($icon);

    }
}