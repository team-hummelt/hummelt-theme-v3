<?php

namespace Hummelt\ThemeV3;

use Hummelt_Theme_V3;

defined('ABSPATH') or die();

class hummelt_theme_v3_public_enqueue
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

    public function hummelt_theme_v3_public_scripts(): void
    {
        do_action(HUMMELT_THEME_V3_SLUG . '/generate_theme_css');
        hummelt_theme_v3_compile_scss();
        $modificated_theme_Css = (file_exists(get_template_directory() . '/theme-style/css/theme-custom.css')) ? date('YmdHi', filemtime(get_template_directory() . '/theme-style/css/theme-custom.css')) : 1;
        $modificatedBootstrapIcons = date('YmdHi', filemtime(HUMMELT_THEME_V3_VENDOR_DIR . '/twbs/bootstrap-icons/font/bootstrap-icons.min.css'));
        $modificatedAnimate = date('YmdHi', filemtime(HUMMELT_THEME_V3_ADMIN_DIR . '/assets/css/bs/bs-wp-editor/animate-gb-block.css'));

        $modificatedLeaflet = date('YmdHi', filemtime(get_template_directory() . '/theme-style/js/tools/leaflet.js'));
        $modificatedMapIframes = date('YmdHi', filemtime(get_template_directory() . '/theme-style/js/tools/iframe-maps.js'));
        $modificatedMapApi = date('YmdHi', filemtime(get_template_directory() . '/theme-style/js/tools/gmaps-api.js'));
        $modificatedVideo = date('YmdHi', filemtime(get_template_directory() . '/theme-style/js/tools/blueimp-video-carousel.js'));

        wp_enqueue_style('hummelt-theme-v3-bootstrap-icons', HUMMELT_THEME_V3_VENDOR_URL . 'twbs/bootstrap-icons/font/bootstrap-icons.min.css', array(), $modificatedBootstrapIcons);
        wp_enqueue_style('hummelt-theme-v3-style', get_template_directory_uri() . '/theme-style/css/theme-custom.css', array(), $modificated_theme_Css);
      // wp_enqueue_style( 'hummelt-theme-v3-animate-style', HUMMELT_THEME_V3_ADMIN_URL . '/assets/css/bs/bs-wp-editor/animate-gb-block.css', [], $modificatedAnimate );

        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $theme_wp_optionen = $settings['theme_wp_optionen'];
        if($theme_wp_optionen['material_icons_active']) {
            $modificatedMaterialIcons = date('YmdHi', filemtime(get_template_directory() . '/theme-style/scss/material-design-icons.css'));
            wp_enqueue_style('material-icons-style', get_template_directory_uri() . '/theme-style/scss/material-design-icons.css', array(), $modificatedMaterialIcons);
        }
        if($theme_wp_optionen['fa_icons_active']) {
            $modificatedFa47Icons = date('YmdHi', filemtime(HUMMELT_THEME_V3_VENDOR_DIR . '/components/font-awesome/css/font-awesome.min.css'));
            wp_enqueue_style('font-awesome-icons-style', HUMMELT_THEME_V3_VENDOR_URL . '/components/font-awesome/css/font-awesome.min.css', array(), $modificatedFa47Icons);
        }

        global $wp_filesystem;
        $file = 'theme-font-face.css';
        $cssFilePath = HUMMELT_THEME_V3_FONTS_DIR . $file;
        if($wp_filesystem->is_file($cssFilePath)) {
            wp_enqueue_style('hummelt-theme-v3-custom-fonts', HUMMELT_THEME_V3_FONTS_URL. 'theme-font-face.css', array(), HUMMELT_THEME_V3_VERSION, false);
        }

        wp_enqueue_script('wp-api-fetch');
        $formBuilderAssets = require_once get_template_directory() . '/theme-style/form-builder/build/index.asset.php';
        wp_enqueue_script(
            'form-builder-loader',
            get_template_directory_uri() . '/theme-style/form-builder/build/index.js',
            ['wp-element'],
            $formBuilderAssets['version'],
            true
        );

        wp_enqueue_script(
            'leaflet-feature-loader',
            get_template_directory_uri() . '/theme-style/js/tools/leaflet.js',
            [],
            $modificatedLeaflet,
            true
        );
        wp_enqueue_script(
            'maps-iframe-loader',
            get_template_directory_uri() . '/theme-style/js/tools/iframe-maps.js',
            [],
            $modificatedMapIframes,
            true
        );

        wp_enqueue_script(
            'gmaps-api-loader',
            get_template_directory_uri() . '/theme-style/js/tools/gmaps-api.js',
            [],
            $modificatedMapApi,
            true
        );
        wp_enqueue_script(
            'video-carousel-loader',
            get_template_directory_uri() . '/theme-style/js/tools/blueimp-video-carousel.js',
            [],
            $modificatedVideo,
            true
        );

        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $logos = [
            'logo_size' => $settings['theme_wp_general']['logo_size'],
            'logo_size_scroll' => $settings['theme_wp_general']['logo_size_scroll'],
            'logo_size_mobil' => $settings['theme_wp_general']['logo_size_mobil'],
            'logo_size_mobil_menu' => $settings['theme_wp_general']['logo_size_mobil_menu'],
            'logo_breakpoint' => $settings['theme_wp_general']['logo_breakpoint']
        ];

        $slider = $settings['slider'];
        $animation_default = $settings['animation_default'];

        $splide = [];
        foreach ($slider as $tmp) {
            $itemBreakPoint = [];
            foreach ($tmp['breakpoints'] as $breakpoint) {
                $itemBreakPoint[$breakpoint['breakpoint']] = [
                    'perPage' => $breakpoint['perPage'] ?? '',
                    'perMove' => $breakpoint['perMove'] ?? '',
                    'gap' => $breakpoint['gap'] ?? '',
                    'height' => $breakpoint['height'] ?? '',
                    'width' => $breakpoint['width'] ?? '',
                    'fixedHeight' => $breakpoint['fixedHeight'] ?? '',
                    'fixedWidth' => $breakpoint['fixedWidth'] ?? '',
                    'padding' => $breakpoint['padding'] ?? []
                ];
            }

            $tmp['breakpoints'] = $itemBreakPoint;
            $splide[] = $tmp;
        }

        // $form_redirect = get_option(HUMMELT_THEME_V3_SLUG . '/form_redirect');
        $form_nonce = wp_create_nonce('hummelt_theme_v3_formular_handle');
        $public_nonce = wp_create_nonce('hummelt_theme_v3_public_handle');
        $theme_nonce = wp_create_nonce('hummelt_theme_v3_public_ajax');
        wp_register_script('hummelt-theme-v3-public-localize', '', [], HUMMELT_THEME_V3_VERSION, false);
        wp_enqueue_script('hummelt-theme-v3-public-localize');
        wp_localize_script('hummelt-theme-v3-public-localize',
            'hummeltPublicObj',
            array(
                'site_url' => site_url(),
                'logo' => $logos,
                'theme_url' => get_template_directory_uri(),
                'ajax_url' => admin_url('admin-ajax.php'),
                'form_nonce' => $form_nonce,
                'form_handle' => 'HummeltThemeV3Formular',
                'public_handle' => 'HummeltThemeV3Public',
                'theme_handle' => 'HummeltThemeV3AJAX',
                'public_nonce' => $public_nonce,
                'theme_nonce' => $theme_nonce,
                'theme_slider' => $splide,
                'animation' => $animation_default
            )
        );
        // delete_option(HUMMELT_THEME_V3_SLUG . '/form_redirect');
    }
}