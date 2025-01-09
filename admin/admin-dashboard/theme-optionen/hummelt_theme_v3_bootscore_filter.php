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

class hummelt_theme_v3_bootscore_filter
{
    private array $themeDesign;
    private array $themeColor;
    private array $themeFont;
    private array $themeWpGeneral;

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
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $theme_design = $settings['theme_design'];
        $this->themeColor = $theme_design['theme_color'];
        $this->themeFont = $theme_design['theme_font'];
        $this->themeWpGeneral = $settings['theme_wp_general'];
        $this->themeDesign = $theme_design;
    }

    public function footer_info_class(): string
    {
        $meta = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_post_meta', get_the_ID());
        $dNone = '';
        if ($meta['bottom_footer_active'] == 1) {
            if (!$this->themeWpGeneral['info_footer_active']) {
                $dNone = 'd-none';
            }
        }
        if ($meta['bottom_footer_active'] == 2) {
            $dNone = '';
        }
        if ($meta['bottom_footer_active'] == 3) {
            $dNone = 'd-none';
        }

        return "text-center $dNone py-2";
    }

    public function footer_to_top_button_class(): string
    {
        $scrollBtn = $this->themeWpGeneral['scroll_top'] ? '' : 'd-none';
        return "btn d-flex align-items-center justify-content-center btn-scroll $scrollBtn hupa-box-shadow";
    }

    public function header_bg_class(): string
    {
        $this->themeColor['nav_shadow_aktiv'] ? $shadow = 'hupa-box-shadow' : $shadow = '';
        $fixedHeader = $this->themeWpGeneral['fix_header'] ? 'sticky-top' : '';
        return "$fixedHeader bg-navbar $shadow";
    }

    public function header_navbar_breakpoint_class(): string
    {
        $breakpoint = $this->themeWpGeneral['menu_breakpoint'];
        return "navbar-expand-$breakpoint";
    }

    public function header_navbar_toggler_breakpoint_class(): string
    {
        $breakpoint = $this->themeWpGeneral['menu_breakpoint'];
        return "d-$breakpoint-none";
    }

    public function container_class($string, $location): string
    {
        $selected404 = false;
        if(is_404()){
            if($this->themeWpGeneral['hupa_select_404']) {
                $selected404 = true;
            }
        }
        if(is_404() && $selected404) {
            $meta = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_post_meta', $this->themeWpGeneral['hupa_select_404']);
        } else {
            $meta = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_post_meta', get_the_ID());
        }

        if ($location == 'header') {
            $container = $string;
            $alignItems = $this->themeWpGeneral['menu_vertical'];
            $align = " align-items-$alignItems";
            if(is_404() && !$selected404) {
                return $this->themeWpGeneral['menu_container'] . $align;
            }
            if ($meta['select_menu_container'] == 1) {
                $container = $this->themeWpGeneral['menu_container'];
            }
            if ($meta['select_menu_container'] == 2) {
                $container = 'container';
            }
            if ($meta['select_menu_container'] == 3) {
                $container = 'container-fluid';
            }
            return $container . $align;
        }
        if ($location == 'page-sidebar-none' || $location == 'single-sidebar-none') {
            if(is_404() && !$selected404) {
                return $this->themeWpGeneral['main_container'];
            }
            if ($meta['select_main_container'] == 1) {
                return $this->themeWpGeneral['main_container'];
            }
            if ($meta['select_main_container'] == 2) {
                return 'container';
            }
            if ($meta['select_main_container'] == 3) {
                return 'container-fluid';
            }
        }
        if ($location == 'footer-info') {
            if(is_404() && !$selected404) {
                return $this->themeWpGeneral['info_footer_container'];
            }
            if ($meta['select_bottom_footer_container'] == 1) {
                return $this->themeWpGeneral['info_footer_container'];
            }
            if ($meta['select_bottom_footer_container'] == 2) {
                return 'container';
            }
            if ($meta['select_bottom_footer_container'] == 3) {
                return 'container-fluid';
            }

            return $this->themeWpGeneral['info_footer_container'];
        }
        if ($location == 'top_bar') {
            if(is_404() && !$selected404) {
                return $this->themeWpGeneral['top_area_container'];
            }
            if ($meta['select_top_area_container'] == 1) {
                return $this->themeWpGeneral['top_area_container'];
            }
            if ($meta['select_top_area_container'] == 2) {
                return 'container';
            }
            if ($meta['select_top_area_container'] == 3) {
                return 'container-fluid';
            }
        }
        if ($location == 'footer-columns') {
            if(is_404() && !$selected404) {
                return $this->themeWpGeneral['widget_footer_container'];
            }
            if ($meta['widget_footer_container'] == 1) {
                return $this->themeWpGeneral['widget_footer_container'];
            }
            if ($meta['widget_footer_container'] == 2) {
                return 'container';
            }
            if ($meta['widget_footer_container'] == 3) {
                return 'container-fluid';
            }
        }

        return $string;
    }

    public function content_spacer($spacer, $location): string
    {

        if ($location == 'page-sidebar-none' || $location == 'single-sidebar-none') {
            $meta = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_post_meta', get_the_ID());
            return $meta['page_spacer'];
        }
        if($location == '404') {
            if($this->themeWpGeneral['hupa_select_404']) {
                $meta = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_post_meta', $this->themeWpGeneral['hupa_select_404']);
                return $meta['page_spacer'];
            }
        }
        return $spacer;
    }

    public function show_info_footer($show): bool
    {
        if(is_404()) {
            if($this->themeWpGeneral['hupa_select_404']) {
                $meta = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_post_meta', $this->themeWpGeneral['hupa_select_404']);
            } else {
                return $this->themeWpGeneral['info_footer_active'];
            }
        } else {
            $meta = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_post_meta', get_the_ID());
        }

        if ($meta['bottom_footer_active'] == 1) {
            return $this->themeWpGeneral['info_footer_active'];
        }
        if ($meta['bottom_footer_active'] == 2) {
            return true;
        }
        return false;
    }

    public function show_widget_footer($show): bool
    {
        if(is_404()) {
            if($this->themeWpGeneral['hupa_select_404']) {
                $meta = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_post_meta', $this->themeWpGeneral['hupa_select_404']);
            } else {
                return $this->themeWpGeneral['widget_footer_active'];
            }
        } else {
            $meta = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_post_meta', get_the_ID());
        }

        if ($meta['widgets_footer_active'] == 1) {
            return $this->themeWpGeneral['widget_footer_active'];
        }
        if ($meta['widgets_footer_active'] == 2) {
            return true;
        }
        return false;
    }

    public function widget_footer_col($cols, $location): string
    {
        $active = 0;
        if (is_active_sidebar('footer-1')) {
            $active++;
        }
        if (is_active_sidebar('footer-2')) {
            $active++;
        }
        if (is_active_sidebar('footer-3')) {
            $active++;
        }
        if (is_active_sidebar('footer-4')) {
            $active++;
        }

        $breakpoint = $this->themeWpGeneral['widget_footer_breakpoint'];
        $active > 0 ? $col = 12 / $active : $col = 12;
        if ($col == 12) {
            return '';
        }
        return "col-$breakpoint-$col";
    }

    public function navbar_menu_align_items($menu, $location): string
    {
        $menuAlign = $this->themeWpGeneral['menu'];
        if ($location == 'main') {
            if ($menuAlign == 1) {
                return 'navbar-nav mx-auto %2$s';
            }
            if ($menuAlign == 2) {
                return 'navbar-nav %2$s';
            }
            if ($menuAlign == 3) {
                return 'navbar-nav ms-auto %2$s';
            }
        }
        return $menu;
    }

    public function navbar_menu_logo($logo, $location): string
    {
        // print_r($this->themeWpGeneral);
        $width = sprintf('%spx', $this->themeWpGeneral['logo_size']);
        $siteName = get_bloginfo('name');
        if ($location == 'navbar') {
            if ($this->themeWpGeneral['logo_menu_option'] == 1) {
                if ($this->themeWpGeneral['logo_image']) {
                    $logoImg = wp_get_attachment_image_src($this->themeWpGeneral['logo_image'], 'large');
                    return "<img style='width: $width' class='navbar-menu-image py-2' alt='$siteName' src='$logoImg[0]' />";
                } else {
                    return "<img style='width: $width' class='navbar-menu-image py-2' alt='$siteName' src='$logo' />";
                }
            }
            if ($this->themeWpGeneral['logo_menu_option'] == 2) {
                return '<div class="navbar-brand-title text-body fw-semibold fs-5">' . $siteName . '</div>';
            }
            if ($this->themeWpGeneral['logo_menu_option'] == 3) {
                return '<div class="navbar-brand-title text-body fw-semibold fs-5">' . $this->themeWpGeneral['logo_menu_text'] . '</div>';
            }
        }
        if ($location == 'mobil') {
            $widthMobil = sprintf('%spx', $this->themeWpGeneral['logo_size_mobil_menu']);
            if ($this->themeWpGeneral['handy_menu_option'] == 1) {
                if ($this->themeWpGeneral['handy_menu_image_active']) {
                    if ($this->themeWpGeneral['logo_image']) {
                        $logoImg = wp_get_attachment_image_src($this->themeWpGeneral['logo_image'], 'medium');
                        return "<a href='".site_url()."'> <img style='width: $widthMobil' class='navbar-mobile-image py-2' alt='$siteName' src='$logoImg[0]' /></a>";
                    } else {
                        return "<a href='".site_url()."'><img style='width: $widthMobil' class='navbar-mobile-image py-2' alt='$siteName' src='$logo' /></a>";
                    }
                }
                if($this->themeWpGeneral['handy_menu_image_id']) {
                    $logoImg = wp_get_attachment_image_src($this->themeWpGeneral['handy_menu_image_id'], 'medium');
                    return "<a href='".site_url()."'><img style='width: $widthMobil' class='navbar-mobile-image py-2' alt='$siteName' src='$logoImg[0]' /></a>";
                } else {
                    return "<a href='".site_url()."'><img style='width: $widthMobil' class='navbar-mobile-image py-2' alt='$siteName' src='$logo' /></a>";
                }
            }
            if ($this->themeWpGeneral['handy_menu_option'] == 2) {
                return '<div class="mobile-menu-title text-body fw-semibold fs-5">' . $siteName . '</div>';
            }
            if ($this->themeWpGeneral['handy_menu_option'] == 3) {
                return '<div class="mobile-menu-title text-body fw-semibold fs-5">' . $this->themeWpGeneral['handy_menu_text'] . '</div>';
            }
        }

        return '';
    }

    public function top_menu_aktiv($active): bool
    {
        if(is_404()) {
            if($this->themeWpGeneral['hupa_select_404']) {
                $meta = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_post_meta', $this->themeWpGeneral['hupa_select_404']);
            } else {
                return $this->themeWpGeneral['top_menu_aktiv'];
            }
        } else {
            $meta = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_post_meta', get_the_ID());
        }

        if ($meta['select_show_top_area'] == 1) {
            return $this->themeWpGeneral['top_menu_aktiv'];
        }
        if ($meta['select_show_top_area'] == 2) {
            return true;
        }
        if ($meta['select_show_top_area'] == 3) {
            return false;
        }
        return $active;
    }

    public function edit_link(): string
    {
        if ($this->themeWpGeneral['edit_link']) {
            return '<div class="text-center py-2"><a href="' . get_edit_post_link() . '">Bearbeiten</a></div>';
        }
        return '';
    }

    public function theme_get_the_title($id, $location): string
    {

        $meta = [];
        if($location == 'page' || $location == 'post') {
            $meta = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_post_meta', $id);
        }
        if($location == '404') {
           if($this->themeWpGeneral['hupa_select_404']) {
               $meta = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_post_meta', $this->themeWpGeneral['hupa_select_404']);
               $id = $this->themeWpGeneral['hupa_select_404'];
           } else {
               return '<h1>404</h1>';
           }
        }
        if(!$meta) {
            return '';
        }
        if (!$meta['show_title']) {
            return '';
        }
        $meta['custom_title'] ? $title = $meta['custom_title'] : $title = get_the_title($id);
        $meta['title_css'] ? $css = 'class="' . $meta['title_css'] . '"' : $css = '';
        return "<h1 $css>$title</h1>";
    }

    public function theme_get_page_by_type($type, $location): string
    {
       if($type == '404') {
           if ($location == '404-body') {
               if($this->themeWpGeneral['hupa_select_404']) {
                   $post_content = get_post_field('post_content', $this->themeWpGeneral['hupa_select_404']);
                   $content = do_blocks($post_content);
                   return do_shortcode($content);
               }
               return '<p class="alert alert-info mb-4">' . esc_html__('Page not found.', 'bootscore') . '</p>';
           }
           if ($location == '404-button') {
               if($this->themeWpGeneral['hupa_select_404']) {
                   return '';
               }
               return '<a class="btn btn-outline-primary" href="' . esc_url(home_url()) . '" role="button">' . esc_html__('Back Home &raquo;', 'bootscore') . '</a>';
           }
       }
        return '';
    }

    public function custom_theme_header($id, $location): string
    {
        if ($id && $location == 'page' || $location == 'post') {
            $meta = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_post_meta', $id);
            if ($meta['theme_header']) {
                $post_content = get_post_field('post_content', $meta['theme_header']);
                $content = do_blocks($post_content);
                return do_shortcode($content);
            }
        }
        if($location == '404') {
            if($this->themeWpGeneral['hupa_select_404']) {
                $meta = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_post_meta', $this->themeWpGeneral['hupa_select_404']);
                if ($meta['theme_header']) {
                    $post_content = get_post_field('post_content', $meta['theme_header']);
                    $content = do_blocks($post_content);
                    return do_shortcode($content);
                }
            }
        }
        return '';
    }

    public function custom_theme_footer($id, $location): string
    {
        if(is_404()) {
            if($this->themeWpGeneral['hupa_select_404']) {
                $meta = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_post_meta', $this->themeWpGeneral['hupa_select_404']);
                if ($meta['theme_header']) {
                    $post_content = get_post_field('post_content', $meta['theme_footer']);
                    $content = do_blocks($post_content);
                    return do_shortcode($content);
                } else {
                    return '';
                }
            } else {
                return '';
            }
        }
        if ($id) {
            $meta = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_post_meta', $id);
            if ($meta['theme_header']) {
                $post_content = get_post_field('post_content', $meta['theme_footer']);
                $content = do_blocks($post_content);
                return do_shortcode($content);
            }
        }
        return '';
    }

    public function get_post_options($type): array
    {
        $templateOptions = $this->themeWpGeneral['template_options'];
        $count = 0;
        foreach ($templateOptions as $tmp) {
            if ($tmp['type'] == $type) {
                if ($tmp['show_post_author']) {
                    $count++;
                }
                if ($tmp['show_post_date']) {
                    $count++;
                }
                if ($tmp['show_post_kommentar']) {
                    $count++;
                }
                $count > 0 ? $tmp['show'] = '' : $tmp['show'] = 'd-none';
                $tmp['post_breadcrumb'] = $this->themeWpGeneral['post_breadcrumb'];
                return $tmp;
            }
        }
        return ['show' => ''];
    }

    public function fn_load_fontawesome() :bool
    {
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $theme_wp_optionen = $settings['theme_wp_optionen'];

        return $theme_wp_optionen['bootscore_fontawesome'];
    }

    public function fn_top_area_menu_order($type, $slug, $default)
    {
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $ta = $settings['theme_top_area'];
        if(isset($ta[$slug])) {
            $menu = $ta[$slug];
            if(isset($menu[$type])) {
                return $menu[$type];
            }
        }
        return $default;
    }
}