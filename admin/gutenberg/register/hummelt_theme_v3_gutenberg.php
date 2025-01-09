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


class hummelt_theme_v3_gutenberg
{
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

    public function hummelt_theme_v3_gutenberg_register_blocks():void
    {
        $gmaps_asset = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/blocks/google-maps/build/index.asset.php';
       /* wp_register_script(
            'hummelt-theme-v3-gutenberg-tools',
            HUMMELT_THEME_V3_ADMIN_URL . '/gutenberg/blocks/google-maps/build/index.js',
            [
                'wp-edit-post',
                'wp-block-editor',
                'react-jsx-runtime',
                'wp-element',
                'wp-components',
                'wp-api-fetch',
                'wp-data'
            ], $gmaps_asset['version'], true );*/

        register_block_type( 'hupa-v3/theme-google-maps', array(
           // 'render_callback' => 'callback_hupa_google_maps',
            'editor_script'   => 'hummelt-theme-v3-gutenberg-tools',
        ));
    }


    public function hummelt_theme_v3_register_bootstrap_carousel():void
    {
        $asset = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/blocks/bootstrap-carousel/build/index.asset.php';
        wp_register_script(
            'bootstrap-carousel-block-script',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/bootstrap-carousel/build/index.js',
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components'],
            $asset['version']
        );

        wp_register_style(
            'bootstrap-carousel-block-editor-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/bootstrap-carousel/build/index.css',
            [],
            $asset['version']
        );

        wp_register_style(
            'bootstrap-carousel-block-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/bootstrap-carousel/build/style-index.css',
            [],
            $asset['version']
        );

        register_block_type('hupa/bootstrap-carousel-block', [
            'editor_script' => 'bootstrap-carousel-block-script',
            'editor_style'  => 'bootstrap-carousel-block-editor-style',
            //'style'         => 'bootstrap-carousel-block-style',
        ]);
    }

    public function hummelt_theme_v3_register_bootstrap_accordion():void
    {
        $accordion_asset = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/blocks/accordion/accordion-container/build/index.asset.php';
        $accordion_item = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/blocks/accordion/accordion-item/build/index.asset.php';
        wp_register_script(
            'bootstrap-accordion-block-script',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/accordion/accordion-container/build/index.js',
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components'],
            $accordion_asset['version']
        );

        wp_register_style(
            'bootstrap-accordion-block-editor-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/accordion/accordion-container/build/index.css',
            [],
            $accordion_asset['version']
        );

        wp_register_style(
            'bootstrap-accordion-block-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/accordion/accordion-container/build/style-index.css',
            [],
            $accordion_asset['version']
        );

        wp_register_script(
            'bootstrap-accordion-item-block-script',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/accordion/accordion-item/build/index.js',
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components'],
            $accordion_item['version']
        );

        wp_register_style(
            'bootstrap-accordion-item-block-editor-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/accordion/accordion-item/build/index.css',
            [],
            $accordion_item['version']
        );

        wp_register_style(
            'bootstrap-accordion-item-block-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/accordion/accordion-item/build/style-index.css',
            [],
            $accordion_item['version']
        );

        register_block_type('hupa/accordion', [
            'editor_script' => 'bootstrap-accordion-block-script',
            'editor_style'  => 'bootstrap-accordion-block-editor-style',
        ]);

        register_block_type('hupa/accordion-item', [
            'editor_script' => 'bootstrap-accordion-item-block-script',
            'editor_style'  => 'bootstrap-accordion-item-block-editor-style',
        ]);
    }

    public function hummelt_theme_v3_register_leaflet_block():void
    {
        $leaflet_asset = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/blocks/leaflet/build/index.asset.php';
        wp_register_script(
            'leaflet-block-script',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/leaflet/build/index.js',
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-api-fetch', 'wp-components'],
            $leaflet_asset['version']
        );

        wp_register_style(
            'leaflet-block-script-block-editor-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/leaflet/build/index.css',
            [],
            $leaflet_asset['version']
        );


        global $themeV3BlockCallback;
        register_block_type('hupa-v3/theme-leaflet-maps', [
            'render_callback' => [$themeV3BlockCallback, 'leaflet_block_callback'],
            'editor_script' => 'leaflet-block-script',
            'editor_style'  => 'leaflet-block-script-block-editor-style',
        ]);

    }

    public function hummelt_theme_v3_register_gmaps_iframe_block():void
    {
        $gmaps_iframe_asset = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/blocks/gmaps-iframe/build/index.asset.php';
        wp_register_script(
            'gmaps-iframe-block-script',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/gmaps-iframe/build/index.js',
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-api-fetch', 'wp-components'],
            $gmaps_iframe_asset['version']
        );

        wp_register_style(
            'gmaps-iframe-block-script-block-editor-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/gmaps-iframe/build/index.css',
            [],
            $gmaps_iframe_asset['version']
        );
        global $themeV3BlockCallback;
        register_block_type('hupa/google-maps-iframe', [
            'render_callback' => [$themeV3BlockCallback, 'gmaps_iframe_block_callback'],
            'editor_script' => 'gmaps-iframe-block-script',
            'editor_style'  => 'gmaps-iframe-block-script-block-editor-style',
        ]);
    }

    public function hummelt_theme_v3_register_osm_iframe_block():void
    {
        $osm_iframe_asset = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/blocks/openstreetmap/build/index.asset.php';
        wp_register_script(
            'osm-iframe-block-script',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/openstreetmap/build/index.js',
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-api-fetch', 'wp-components'],
            $osm_iframe_asset['version']
        );

        wp_register_style(
            'osm-iframe-block-script-block-editor-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/openstreetmap/build/index.css',
            [],
            $osm_iframe_asset['version']
        );
        global $themeV3BlockCallback;
        register_block_type('hupa/openstreetmap-iframe', [
            'render_callback' => [$themeV3BlockCallback, 'osm_iframe_block_callback'],
            'editor_script' => 'osm-iframe-block-script',
            'editor_style'  => 'osm-iframe-block-script-block-editor-style',
        ]);
    }

    public function hummelt_theme_v3_register_gmaps_api_block():void
    {
        $gmaps_api_asset = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/blocks/gmaps-api/build/index.asset.php';
        wp_register_script(
            'gmaps-api-block-script',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/gmaps-api/build/index.js',
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-api-fetch', 'wp-components'],
            $gmaps_api_asset['version']
        );

        wp_register_style(
            'gmaps-api-block-script-block-editor-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/gmaps-api/build/index.css',
            [],
            $gmaps_api_asset['version']
        );
        global $themeV3BlockCallback;
        register_block_type('hupa-v3/gmaps-api', [
            'render_callback' => [$themeV3BlockCallback, 'gmaps_api_block_callback'],
            'editor_script' => 'gmaps-api-block-script',
            'editor_style'  => 'gmaps-api-block-script-block-editor-style',
        ]);
    }

    public function hummelt_theme_v3_register_formulare_block():void
    {
        $formulare_asset = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/blocks/formular/build/index.asset.php';
        wp_register_script(
            'formulare-block-script',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/formular/build/index.js',
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-api-fetch', 'wp-components'],
            $formulare_asset['version']
        );

        wp_register_style(
            'formulare-block-block-editor-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/formular/build/index.css',
            [],
            $formulare_asset['version']
        );
        global $themeV3BlockCallback;
        register_block_type('hupa/theme-formular', [
            'render_callback' => [$themeV3BlockCallback, 'form_builder_block_callback'],
            'editor_script' => 'formulare-block-script',
            'editor_style'  => 'formulare-block-block-editor-style',
        ]);
    }

    public function hummelt_theme_v3_register_single_video():void
    {
        $asset = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/blocks/video/build/index.asset.php';
        wp_register_script(
            'single-video-block-script',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/video/build/index.js',
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components'],
            $asset['version']
        );

        wp_register_style(
            'single-video-block-editor-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/video/build/index.css',
            [],
            $asset['version']
        );

      /*  wp_register_style(
            'bootstrap-carousel-block-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/video/build/style-index.css',
            [],
            $asset['version']
        );*/

        register_block_type('hupa/video-single-block', [
            'editor_script' => 'single-video-block-script',
            'editor_style'  => 'single-video-block-editor-style',
            //'style'         => 'bootstrap-carousel-block-style',
        ]);
    }

    public function hummelt_theme_v3_register_video_carousel():void
    {
        $container = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/blocks/video-carousel/video-container/build/index.asset.php';
        $item = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/blocks/video-carousel/video-item/build/index.asset.php';
        wp_register_script(
            'container-video-carousel-block-script',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/video-carousel/video-container/build/index.js',
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components'],
            $container['version']
        );

        wp_register_style(
            'container-video-carousel-block-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/video-carousel/video-container/build/index.css',
            [],
            $container['version']
        );

        wp_register_script(
            'item-video-carousel-block-script',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/video-carousel/video-item/build/index.js',
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components'],
            $item['version']
        );

        wp_register_style(
            'item-video-carousel-block-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/video-carousel/video-item/build/index.css',
            [],
            $item['version']
        );

        /*  wp_register_style(
              'bootstrap-carousel-block-style',
              HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/video/build/style-index.css',
              [],
              $asset['version']
          );*/

        register_block_type('hupa/video-carousel-container', [
            'editor_script' => 'container-video-carousel-block-script',
            'editor_style'  => 'container-video-carousel-block-style',
            //'style'         => 'bootstrap-carousel-block-style',
        ]);

        register_block_type('hupa/video-carousel-item', [
            'editor_script' => 'item-video-carousel-block-script',
            'editor_style'  => 'item-video-carousel-block-style',
            //'style'         => 'bootstrap-carousel-block-style',
        ]);
    }

    public function hummelt_theme_v3_register_gallery_slider_block():void
    {
        $slider = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/blocks/gallery-slider/build/index.asset.php';

        wp_register_script(
            'gallery-slider-block-script',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/gallery-slider/build/index.js',
            ['wp-blocks', 'wp-element', 'wp-i18n', 'wp-editor', 'wp-components', 'jquery', 'jquery-ui-sortable'],
            $slider['version']
        );

        wp_register_style(
            'gallery-slider-block-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/gallery-slider/build/index.css',
            [],
            $slider['version']
        );


        register_block_type('hupa/gallery-slideshow-block', [
            'editor_script' => 'gallery-slider-block-script',
            'editor_style'  => 'gallery-slider-block-style',
            //'style'         => 'bootstrap-carousel-block-style',
        ]);
    }

    public function hummelt_theme_v3_register_gallery_block():void
    {
        $gallery = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/blocks/gallery/build/index.asset.php';

        wp_register_script(
            'gallery-block-script',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/gallery/build/index.js',
            ['wp-blocks', 'wp-element', 'wp-i18n', 'wp-editor', 'wp-components', 'jquery', 'jquery-ui-sortable'],
            $gallery['version']
        );

        wp_register_style(
            'gallery-block-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/gallery/build/index.css',
            [],
            $gallery['version']
        );

        global $themeV3BlockCallback;
        register_block_type('hupa/theme-gallery', [
            'attributes' => [
                'breakpoints' => [
                    'type' => 'object',
                    'default' => [
                        'xxl' => ['columns' => 6, 'gutter' => 1],
                        'xl'  => ['columns' => 5, 'gutter' => 1],
                        'lg'  => ['columns' => 4, 'gutter' => 1],
                        'md'  => ['columns' => 3, 'gutter' => 1],
                        'sm'  => ['columns' => 2, 'gutter' => 1],
                        'xs'  => ['columns' => 2, 'gutter' => 1],
                    ],
                ],
            ],
           // 'render_callback' => [$themeV3BlockCallback, 'theme_gallery_callback'],
            'editor_script' => 'gallery-block-script',
            'editor_style'  => 'gallery-block-style',
            //'style'         => 'bootstrap-carousel-block-style',
        ]);
    }

    public function hummelt_theme_v3_register_filter():void
    {
        $filter = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/filter/lightbox/build/index.asset.php';
        wp_enqueue_script(
            'theme-gutenberg-filter-script',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/filter/lightbox/build/index.js',
            [ 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components', 'wp-compose', 'wp-data' ],
            $filter['version'],
            true
        );

        $animateFilter = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/filter/animate/build/index.asset.php';
        wp_enqueue_script(
            'theme-gutenberg-animate-filter-script',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/filter/animate/build/index.js',
            [ 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components', 'wp-compose', 'wp-data' ],
            $animateFilter['version'],
            true
        );

        $iconFilter = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/filter/paragraph-icon/build/index.asset.php';
        wp_enqueue_script(
            'theme-gutenberg-font-filter-script',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/filter/paragraph-icon/build/index.js',
            [ 'wp-rich-text', 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components', 'wp-compose', 'wp-data' ],
            $iconFilter['version'],
            true
        );

        wp_enqueue_style(
            'theme-gutenberg-font-filter-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/filter/paragraph-icon/build/index.css',
            [],
            $iconFilter['version']
        );

        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $theme_wp_optionen = $settings['theme_wp_optionen'];

        wp_enqueue_style('bootstrap-icons-style', HUMMELT_THEME_V3_VENDOR_URL . 'twbs/bootstrap-icons/font/bootstrap-icons.min.css', array(), HUMMELT_THEME_V3_VERSION, false);
        if( $theme_wp_optionen['fa_icons_active']) {
            wp_enqueue_style('font-awesome-icons-style', HUMMELT_THEME_V3_VENDOR_URL . 'components/font-awesome/css/font-awesome.min.css', array(), HUMMELT_THEME_V3_VERSION, false);
        }
        if($theme_wp_optionen['material_icons_active']) {
            wp_enqueue_style('material-icons-style', get_template_directory_uri() . '/theme-style/scss/material-design-icons.css', array(), HUMMELT_THEME_V3_VERSION, false);
        }
    }

    public function register_custom_cover_block(): void
    {

        $cover = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/blocks/custom-cover/build/index.asset.php';
        wp_register_script(
            'custom-cover-block',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/custom-cover/build/index.js',
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components'],
            $cover['version']
        );


        wp_register_style(
            'custom-cover-block-style',

            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/custom-cover/build/style-index.css',
            [],
            $cover['version']
        );

        wp_register_style(
            'custom-cover-block-editor-style',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/blocks/custom-cover/build/index.css',
            [],
            $cover['version']
        );

        register_block_type('custom/cover-block', [
            'editor_script' => 'custom-cover-block',
            'style' => 'custom-cover-block-style',
            'editor_style' => 'custom-cover-block-editor-style',
        ]);
    }


   public function enqueue_bootstrap_assets(): void
    {
        wp_enqueue_script(
            'bootstrap-js',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
            [],
            '5.3.2',
            true
        );
     /*   wp_enqueue_style(
            'bootstrap-css',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
            [],
            '5.3.2'
        );*/
    }

    public function hummelt_theme_v3_editor_gutenberg_tools_scripts():void
    {
        wp_enqueue_script( 'hummelt-theme-v3-gutenberg-tools' );
        wp_enqueue_style( 'hummelt-theme-v3-gutenberg-tools-style');
        wp_enqueue_style( 'hummelt-theme-v3-gutenberg-tools-style', HUMMELT_THEME_V3_CSS_REST_URL . 'auto-generate-editor-style',
            [], '' );
       wp_enqueue_style( 'hummelt-theme-v3-animate-style', HUMMELT_THEME_V3_ADMIN_URL . '/assets/css/bs/bs-wp-editor/animate-gb-block.css',
            [], '' );
    }

    public function hummelt_theme_v3_sidebar_plugin_register(): void
    {
        $sidebar_asset = require_once HUMMELT_THEME_V3_ADMIN_DIR . 'gutenberg/sidebar/build/index.asset.php';
        wp_register_script(
            'theme-v3-sidebar-js',
            HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/sidebar/build/index.js',
            [
                'wp-plugins',
                'wp-edit-post',
                'wp-element',
                'wp-components',
                'wp-api-fetch',
                'wp-data'
            ], $sidebar_asset['version'], true);

        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $theme_wp_optionen = $settings['theme_wp_optionen'];
        $restSettings = [
            'fa_icons_active' => $theme_wp_optionen['fa_icons_active'],
            'material_icons_active' => $theme_wp_optionen['material_icons_active']
        ];
        wp_register_script('theme-v3-rest-gutenberg-js-localize', '', [], $sidebar_asset['version'], true);
        wp_enqueue_script('theme-v3-rest-gutenberg-js-localize');
        wp_localize_script('theme-v3-rest-gutenberg-js-localize',
            'hummeltRestEditorObj',
            array(
                'gutenberg_rest_path' => 'theme-v3-gutenberg/v' . HUMMELT_THEME_V3_VERSION . '/',
                'public_rest_path' => 'theme-v3-public/v' . HUMMELT_THEME_V3_VERSION . '/',
                'rest_nonce' => wp_create_nonce('wp_rest'),
                'site_url' => site_url(),
                'admin_url' => HUMMELT_THEME_V3_ADMIN_URL,
                'rest_settings' => $restSettings

            )
        );
    }

    public function hummelt_theme_v3_gutenberg_script_enqueue():void
    {
        wp_enqueue_script('theme-v3-sidebar-js');
       // wp_enqueue_style('theme-v3-sidebar-style');
        wp_enqueue_style('theme-v3-sidebar-style', HUMMELT_THEME_V3_ADMIN_URL . 'gutenberg/sidebar/build/index.css',
            [], '');
    }

    public function hummelt_theme_v3_meta_fields():void
    {
        @register_meta(
            'post',
            '_show_title',
            array(
                'type' => 'boolean',
                'single' => true,
                'show_in_rest' => true,
                'default' => true,
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
        @register_meta(
            'post', // object type, can be 'post', 'comment', 'term', 'user'
            '_custom_title', // meta key
            array(
                //'object_subtype' => 'page', // you can specify a post type here
                'type' => 'string', // 'string', 'boolean', 'integer', 'number', 'array', and 'object'
                'single' => true, // one value per object or an array of values
                'show_in_rest' => true, // accessible in REST,
                'sanitize_callback' => 'sanitize_text_field',
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
        @register_meta(
            'post',
            '_title_css',
            array(
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
                'single' => true,
                'show_in_rest' => true,
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
        @register_meta(
            'post',
            '_show_menu',
            array(
                'type' => 'boolean',
                'single' => true,
                'show_in_rest' => true,
                'default' => true,
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
        @register_meta(
            'post',
            '_page_spacer',
            array(
                'type' => 'string',
                'single' => true,
                'show_in_rest' => true,
                'default' => 'pt-4 pb-5',
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
        @register_meta(
            'post',
            '_select_sidebar',
            array(
                'type' => 'string',
                'single' => true,
                'show_in_rest' => true,
                'default' => 'sidebar-1',
                'sanitize_callback' => 'sanitize_text_field',
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
        @register_meta(
            'post',
            '_select_show_top_area',
            array(
                'type' => 'number',
                'single' => true,
                'show_in_rest' => true,
                'default' => 1,
                'sanitize_callback' => 'sanitize_text_field',
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
        @register_meta(
            'post',
            '_select_top_area_container',
            array(
                'type' => 'number',
                'single' => true,
                'show_in_rest' => true,
                'default' => 1,
                'sanitize_callback' => 'sanitize_text_field',
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
        @register_meta(
            'post',
            '_select_main_container',
            array(
                'type' => 'number',
                'single' => true,
                'show_in_rest' => true,
                'default' => 1,
                'sanitize_callback' => 'sanitize_text_field',
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
        @register_meta(
            'post',
            '_select_menu_container',
            array(
                'type' => 'number',
                'single' => true,
                'show_in_rest' => true,
                'default' => 1,
                'sanitize_callback' => 'sanitize_text_field',
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
        @register_meta(
            'post',
            '_bottom_footer_active',
            array(
                'type' => 'number',
                'single' => true,
                'show_in_rest' => true,
                'default' => 1,
                'sanitize_callback' => 'sanitize_text_field',
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
        @register_meta(
            'post',
            '_widgets_footer_active',
            array(
                'type' => 'number',
                'single' => true,
                'show_in_rest' => true,
                'default' => 1,
                'sanitize_callback' => 'sanitize_text_field',
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
        @register_meta(
            'post',
            '_widget_footer_container',
            array(
                'type' => 'number',
                'single' => true,
                'show_in_rest' => true,
                'default' => 1,
                'sanitize_callback' => 'sanitize_text_field',
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
        @register_meta(
            'post',
            '_bottom_sticky_footer',
            array(
                'type' => 'number',
                'single' => true,
                'show_in_rest' => true,
                'default' => 1,
                'sanitize_callback' => 'sanitize_text_field',
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
        @register_meta(
            'post',
            '_select_bottom_footer_container',
            array(
                'type' => 'number',
                'single' => true,
                'show_in_rest' => true,
                'default' => 1,
                'sanitize_callback' => 'sanitize_text_field',
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
        @register_meta(
            'post',
            '_theme_header',
            array(
                'type' => 'number',
                'single' => true,
                'show_in_rest' => true,
                'default' => 0,
                'sanitize_callback' => 'sanitize_text_field',
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
        @register_meta(
            'post',
            '_theme_footer',
            array(
                'type' => 'number',
                'single' => true,
                'show_in_rest' => true,
                'default' => 0,
                'sanitize_callback' => 'sanitize_text_field',
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                }
            )
        );
    }


}
