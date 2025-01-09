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

class hummelt_theme_v3_get_settings
{

    use hummelt_theme_v3_options;
    use hummelt_theme_v3_selects;
    private static $instance;

    /**
     * @return static
     */
    public static function instance(): self
    {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function __construct()
    {

    }

    public function fn_hummelt_theme_v3_optionen($option):array
    {
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        if($settings) {
            return $settings[$option];
        }
      return [];
    }

    public function fn_hummelt_theme_get_post_meta($id, $key = '')
    {
        $meta = [
            'show_title' => get_post_meta($id, '_show_title', true),
            'custom_title' => get_post_meta($id, '_custom_title', true),
            'title_css' => get_post_meta($id, '_title_css', true),
            'show_menu' => get_post_meta($id, '_show_menu', true),
            'page_spacer' => get_post_meta($id, '_page_spacer', true),
            'select_sidebar' => get_post_meta($id, '_select_sidebar', true),
            'select_show_top_area' => get_post_meta($id, '_select_show_top_area', true),
            'select_top_area_container' => get_post_meta($id, '_select_top_area_container', true),
            'select_main_container' => get_post_meta($id, '_select_main_container', true),
            'select_menu_container' => get_post_meta($id, '_select_menu_container', true),
            'select_bottom_footer_container' => get_post_meta($id, '_select_bottom_footer_container', true),
            'bottom_footer_active' => get_post_meta($id, '_bottom_footer_active', true),
           // 'widgets_footer_active' => get_post_meta($id, '_widgets_footer_active', true),
           // 'top_footer_active' => get_post_meta($id, '_top_footer_active', true),
            'widgets_footer_active' => get_post_meta($id, '_widgets_footer_active', true),
            'widget_footer_container' => get_post_meta($id, '_widget_footer_container', true),
            'bottom_sticky_footer' => get_post_meta($id, '_bottom_sticky_footer', true),
            'theme_header' => get_post_meta($id, '_theme_header', true),
            'theme_footer' => get_post_meta($id, '_theme_footer', true),
        ];
         if($key) {
             return $meta[$key];
         }
        return $meta;
    }

}