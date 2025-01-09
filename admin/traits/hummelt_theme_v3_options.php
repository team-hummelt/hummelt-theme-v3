<?php

namespace Hummelt\ThemeV3;

defined('ABSPATH') or die();

trait hummelt_theme_v3_options
{
    protected bool $design_templates_active = true;
    protected bool $theme_header_active = true;
    protected bool $theme_footer_active = true;
    //Theme Optionen -> WP-Config
    protected bool $wp_optionen_disabled = true;
    protected bool $wp_config_disabled = true;
    protected bool $update_msg_disabled = true;
    //Theme Sortable | Duplicate
    protected bool $backend_sortable_disabled = true;
    protected bool $backend_duplicate_disabled = true;


    protected function get_theme_default_settings($args = ''): array
    {
        $settings_default_values = [
            'google_maps_api' => [
                'map_apikey' => 'key eingeben',
                'map_color_schema_check' => false,
                'map_standard_pin' => 0,
                'map_standard_url' => '',
                'map_color_schema' => '',
                'map_pins' => [
                    '0' => [
                        'id' => uniqid(),
                        'delete' => false,
                        'coords' => '52.10865639405879, 11.633041908696315',
                        'info_text' => 'hummelt und partner | Werbeagentur GmbH',
                        'custom_pin_check' => false,
                        'custom_pin_img' => 0,
                        'custom_pin_url' => '',
                    ]
                ]
            ],
            'leaflet' => [],
            'slider' => [],
            'gallery' => [],
            'custom_fields' => [],
            'theme_top_area' => [
                'menu' => [
                    'order' => 1,
                    'active' => false,
                    'css' => '',
                ],
                'top-menu-1' => [
                    'order' => 2,
                    'active' => false,
                    'css' => '',
                ],
                'top-menu-2' => [
                    'order' => 3,
                    'active' => false,
                    'css' => '',
                ],
                'top-menu-3' => [
                    'order' => 4,
                    'active' => false,
                    'css' => '',
                ]
            ],
            'google_maps_datenschutz' => [
                '0' => [
                    'id' => uniqid(),
                    'delete' => false,
                    'map_img_id' => 0,
                    'map_bg_grayscale' => 1,
                    'map_link_uppercase' => 0,
                    'map_link_underline' => 1,
                    'map_ds_page' => 0,
                    'button_css' => '',
                    'map_ds_btn_text' => 'Anfahrtskarte einblenden',
                    'map_ds_text' => 'Ich nehme die <a class="text-light" href="###LINK###" target="_blank">Datenschutzbestimmungen</a> zur Kenntnis.',
                    'ds_bezeichnung' => 'default Map Datenschutz'
                ],
            ],
            'theme_wp_optionen' => [
                'svg_upload' => true,
                'disabled_wp_layout' => true,
                'gutenberg_active' => true,
                'gutenberg_widget_active' => false,
                'pdf_custom_dir_active' => true,
                'disabled_comments' => true,
                'disabled_comments_admin_bar' => true,
                'disabled_comments_admin_menu' => true,
                'fa_icons_active' => true,
                'material_icons_active' => false,
                'bootscore_fontawesome' => false,
            ],
            'theme_capabilities' => [
                'theme-settings' => 'manage_options',
                'theme-tools' => 'manage_options',
                'template-settings' => 'manage_options',
                'wordpress-optionen' => 'manage_options',
                'custom-header' => 'manage_options',
                'custom-footer' => 'manage_options',
                'design-vorlagen' => 'manage_options',
                'font-settings' => 'manage_options',
                'farben' => 'manage_options',
                'gutenberg-layout' => 'manage_options',
                'einstellungen' => 'manage_options',
                'plugins' => 'manage_options',
                'import' => 'manage_options',
                'formulare' => 'manage_options',
                'lizenzen' => 'manage_options',
                'font-upload' => 'manage_options',
                'maps-datenschutz' => 'manage_options',
                'google-maps-api' => 'manage_options',
                'leaflet' => 'manage_options',
            ],
            'theme_wp_general' => [
                'logo_image' => 0,
                'top_menu_aktiv' => false,
                'top_area_container' => 'container',
                'menu_container' => 'container',
                'menu_breakpoint' => 'lg',
                'menu_vertical' => 'center',
                'main_container' => 'container',
                'info_footer_container' => 'container',
                'info_footer_active' => true,
                'widget_footer_active' => false,
                'widget_footer_container' => 'container',
                'widget_footer_breakpoint' => 'lg',
                'login_image' => false,
                'fix_header' => true,
                'fix_footer' => false,
                'scroll_top' => true,
                'favicon_id' => 0,
                'handy_menu_image_active' => true,
                'handy_menu_image_id' => 0,
                'handy_menu_option' => 1,
                'handy_menu_text' => 'Menü',
                'login_img_aktiv' => true,
                'login_img_width' => 320,
                'login_img_height' => 110,
                'logo_breakpoint' => 992,
                'logo_size' => 150,
                'logo_size_scroll' => 70,
                'logo_size_mobil' => 60,
                'logo_size_mobil_menu' => 80,
                'logo_size_login' => 200,
                'logo_menu_option' => 1,
                'logo_menu_text' => 'Menü',
                'menu' => 3,
                'edit_link' => false,
                'fw_top' => 0,
                'fw_bottom' => 0,
                'fw_left' => 0,
                'fw_right' => 0,
                'login_logo_url' => 'https://www.hummelt-werbeagentur.de/',
                'bottom_area_text' => '© <b>###YEAR###</b> - hummelt und partner | Werbeagentur GmbH',
                'bottom_area_css' => '',
                'preloader_aktiv' => false,
                'sitemap_post' => true,
                'sitemap_page' => true,
                'woocommerce_aktiv' => false,
                'woocommerce_sidebar' => 0,
                'social_type' => 0,
                'social_symbol_color' => 0,
                'social_extra_css' => '',
                'social_kategorie' => 1,
                'social_author' => 1,
                //TEMPLATES
                'template_options' => [
                    '0' => [
                        'active' => true,
                        'id' => uniqid(),
                        'type' => 'kategorie',
                        'label' => 'Kategorie Seite',
                        'show_sidebar' => false,
                        'select_sidebar' => 0,
                        'show_kategorie' => true,
                        'show_post_date' => true,
                        'show_post_author' => true,
                        'show_post_kommentar' => false,
                        'show_post_tags' => false,
                        'show_image' => false,
                        'select_header' => 0,
                        'select_footer' => 0,
                    ],
                    '1' => [
                        'active' => true,
                        'id' => uniqid(),
                        'type' => 'archiv',
                        'label' => 'Archiv Seite',
                        'show_sidebar' => false,
                        'select_sidebar' => 0,
                        'show_kategorie' => true,
                        'show_post_date' => true,
                        'show_post_author' => true,
                        'show_post_kommentar' => false,
                        'show_post_tags' => false,
                        'show_post_image' => false,
                        'select_header' => 0,
                        'select_footer' => 0,
                    ],
                    '2' => [
                        'active' => true,
                        'id' => uniqid(),
                        'type' => 'author',
                        'label' => 'Author Seite',
                        'show_sidebar' => false,
                        'select_sidebar' => 0,
                        'show_kategorie' => true,
                        'show_post_date' => true,
                        'show_post_author' => true,
                        'show_post_kommentar' => false,
                        'show_post_tags' => false,
                        'show_post_image' => false,
                        'select_header' => 0,
                        'select_footer' => 0,
                    ],
                    '3' => [
                        'active' => true,
                        'id' => uniqid(),
                        'type' => 'block',
                        'label' => 'Block Seite',
                        'show_sidebar' => false,
                        'select_sidebar' => 0,
                        'show_kategorie' => true,
                        'show_post_date' => true,
                        'show_post_author' => true,
                        'show_post_kommentar' => false,
                        'show_post_tags' => false,
                        'show_post_image' => false,
                        'select_header' => 0,
                        'select_footer' => 0,
                    ],
                    '4' => [
                        'active' => true,
                        'id' => uniqid(),
                        'type' => 'search',
                        'label' => 'Search Seite',
                        'show_sidebar' => false,
                        'select_sidebar' => 0,
                        'show_kategorie' => true,
                        'show_post_date' => true,
                        'show_post_author' => true,
                        'show_post_kommentar' => false,
                        'show_post_tags' => false,
                        'show_post_image' => false,
                        'select_header' => 0,
                        'select_footer' => 0,
                    ]
                ],
                'hupa_select_404' => 0,
                'post_breadcrumb' => true,
            ],
            'theme_design' => [
                'font_headline' => [
                    '0' => [
                        'id' => 'h1',
                        'label' => 'H1',
                        'size' => 40,
                        'size_sm' => 28,
                        'color' => '#3C434A',
                        'display' => false,
                        'standard' => false,
                        'show_editor' => true,
                        'font-family' => '',
                        'font-weight' => '500',
                        'font-style' => '',
                        'line-height' => '1.2'
                    ],
                    '1' => [
                        'id' => 'h2',
                        'label' => 'H2',
                        'size' => 32,
                        'size_sm' => 24,
                        'color' => '#3C434A',
                        'display' => false,
                        'standard' => false,
                        'show_editor' => true,
                        'font-family' => '',
                        'font-style' => '',
                        'font-weight' => '500',
                        'line-height' => '1.2'
                    ],
                    '2' => [
                        'id' => 'h3',
                        'label' => 'H3',
                        'size' => 28,
                        'size_sm' => 22,
                        'color' => '#3C434A',
                        'display' => false,
                        'standard' => false,
                        'show_editor' => true,
                        'font-family' => '',
                        'font-style' => '',
                        'font-weight' => '500',
                        'line-height' => '1.2'
                    ],
                    '3' => [
                        'id' => 'h4',
                        'label' => 'H4',
                        'size' => 24,
                        'size_sm' => 20,
                        'color' => '#3C434A',
                        'display' => false,
                        'standard' => false,
                        'show_editor' => true,
                        'font-family' => '',
                        'font-style' => '',
                        'font-weight' => '500',
                        'line-height' => '1.2'
                    ],
                    '4' => [
                        'id' => 'h5',
                        'label' => 'H5',
                        'size' => 20,
                        'size_sm' => 18,
                        'color' => '#3C434A',
                        'display' => false,
                        'standard' => false,
                        'show_editor' => true,
                        'font-family' => '',
                        'font-style' => '',
                        'font-weight' => '500',
                        'line-height' => '1.2'
                    ],
                    '5' => [
                        'id' => 'h6',
                        'label' => 'H6',
                        'size' => 16,
                        'size_sm' => 16,
                        'color' => '#3C434A',
                        'display' => false,
                        'standard' => false,
                        'show_editor' => true,
                        'font-family' => '',
                        'font-style' => '',
                        'font-weight' => '500',
                        'line-height' => '1.2'
                    ],
                    '6' => [
                        'id' => 'widget_headline',
                        'label' => 'Widget Überschrift',
                        'size' => 21,
                        'size_sm' => 18,
                        'color' => '#3C434A',
                        'display' => false,
                        'standard' => false,
                        'show_editor' => true,
                        'font-family' => '',
                        'font-style' => '',
                        'font-weight' => '500',
                        'line-height' => '1.5'
                    ],
                ],
                'theme_font' => [
                    '0' => [
                        'id' => 'body',
                        'label' => 'Body',
                        'font-family' => '',
                        'font-style' => '',
                        'size' => 16,
                        'size_sm' => 16,
                        'uppercase' => false,
                        'standard' => false,
                        'color' => '#3C434A',
                        'font-weight' => 'normal',
                        'line-height' => '1.5'
                    ],
                    '1' => [
                        'id' => 'menu',
                        'label' => 'Menu',
                        'font-family' => '',
                        'font-style' => '',
                        'size' => 16,
                        'size_sm' => 16,
                        'uppercase' => false,
                        'standard' => false,
                        'color' => '',
                        'font-weight' => 'normal',
                        'line-height' => '1.5'
                    ],
                    '2' => [
                        'id' => 'button',
                        'label' => 'Button',
                        'font-family' => '',
                        'font-style' => '',
                        'size' => 16,
                        'size_sm' => 16,
                        'uppercase' => false,
                        'standard' => false,
                        'color' => '',
                        'font-weight' => 'normal',
                        'line-height' => '1.5'
                    ],
                ],
                'top_footer' => [
                    '0' => [
                        'id' => 'top_area',
                        'label' => 'Top Area',
                        'standard' => false,
                        'size' => 14,
                        'size_sm' => 14,
                        'font-family' => '',
                        'font-style' => '',
                        'font-weight' => 'normal',
                        'line-height' => '1.5'
                    ],
                    '1' => [
                        'id' => 'info_footer',
                        'label' => 'Info Footer',
                        'standard' => false,
                        'size' => 16,
                        'size_sm' => 16,
                        'font-family' => '',
                        'font-style' => '',
                        'font-weight' => 'normal',
                        'line-height' => '1.5'
                    ],
                ],
                'theme_color' => [
                    'menu_uppercase' => false,
                    'scroll_btn_active' => true,
                    'widget_border_aktiv' => true,
                    'nav_shadow_aktiv' => true,
                    'site_bg' => '#ffffff',
                    'nav_bg' => '#E6E6E6CF',
                    'footer_bg' => '#E11D2A',
                    'static_footer_color' => '#fff',
                    'menu_bg' => '#E6E6E6CF',
                    'login_site_bg' => '#e11d2a',
                    'login_site_color' => '#ffffff',
                    'login_site_btn_bg' => '#e11d2a',
                    'login_site_btn_color' => '#ffffff',
                    'footer_color' => '#212529bf',
                    'menu_btn_bg_color' => '#FFFFFF00',
                    'menu_btn_color' => '#50575e',
                    'menu_btn_active_bg' => '#E6E6E600',
                    'menu_btn_active_color' => '#E11D2A',
                    'menu_btn_hover_bg' => '#E6E6E600',
                    'menu_btn_hover_color' => '#50575E',
                    'dropdown_bg' => '#FFFFFF',
                    'menu_dropdown_bg' => '#FFFFFF',
                    'menu_dropdown_color' => '#50575e',
                    'menu_dropdown_active_bg' => '#d4d4d4',
                    'menu_dropdown_active_color' => '#E11D2A',
                    'menu_dropdown_hover_bg' => '#ededed',
                    'menu_dropdown_hover_color' => '#E11D2A',
                    'link_color' => '#0062bd',
                    'link_aktiv_color' => '#004480',
                    'link_hover_color' => '#007ce8',
                    'scroll_btn_bg' => '#E11D2A',
                    'scroll_btn_color' => '#ffffff',
                    'widget_border_color' => '#dee2e6',
                    'widget_bg' => '#F7F7F700',
                    'top_area_bg_color' => '#3c434a',
                    'top_area_font_color' => '#b5c2cb'
                ]
            ],
            'animation_default' => [
                'fadeTop' => 100,
                'fadeBottom' => 150,
                'fadeTop25' => 100,
                'fadeBottom25' => 150,
                'fadeTop100' => 100,
                'fadeBottom100' => 150,
                'moveLeftTop' => 150,
                'moveLeftBottom' => 250,
                'moveLeftTop25' => 150,
                'moveLeftBottom25' => 250,
                'moveLeftTop100' => 150,
                'moveLeftBottom100' => 250,
                'moveRightTop' => 150,
                'moveRightBottom' => 250,
                'moveRightTop25' => 150,
                'moveRightBottom25' => 250,
                'moveRightTop100' => 150,
                'moveRightBottom100' => 250,
                'moveTopTop' => 70,
                'moveTopBottom' => 225,
                'moveTopTop25' => 70,
                'moveTopBottom25' => 225,
                'moveTopTop100' => 70,
                'moveTopBottom100' => 225,
                'moveBottomTop' => 150,
                'moveBottomBottom' => 250,
                'moveBottomTop25' => 150,
                'moveBottomBottom25' => 250,
                'moveBottomTop100' => 150,
                'moveBottomBottom100' => 250
            ],
        ];

        if($args){
            return $settings_default_values[$args];
        }

        return $settings_default_values;
    }

    protected function get_theme_default_optionen(array $sortable_post_types = [], array $duplicate_post_types = [], string $args = '')
    {
        $optionen = [
            'wp_optionen' => [
                'wp_optionen_disabled' => $this->wp_optionen_disabled,
                'wp_disabled_automatic_update' => false,
                'wp_disable_wp_cron' => false,
                'wp_disallow_file_edit' => false,
                'wp_disallow_file_mods' => false
            ],
            'wp_config' => [
                'wp_config_disabled' => $this->wp_config_disabled,
                'wp_cache_active' => false,
                'show_fatal_error' => false,
                'debug' => 2,
                'wp_script_debug' => false,
                'wp_debug_display' => false,
                'wp_debug_log' => false,
                'mu_plugin_active' => false,
                'revision_anzahl' => 10,
                'revision_interval' => 60,
                'rev_wp_aktiv' => true,
                'trash_days' => 30,
                'trash_wp_aktiv' => true,
                'ssl_login_active' => false,
                'admin_ssl_login_active' => false,
                'db_repair' => false
            ],
            'update_msg' => [
                'update_msg_disabled' => $this->update_msg_disabled,
                'core_upd_msg_disabled' => false,
                'plugin_upd_msg_disabled' => false,
                'theme_upd_msg_disabled' => false,
                'dashboard_update_anzeige' => 1,
                'send_error_email_disabled' => false,
                'email_err_msg' => ''
            ],
            'theme_sort_options' => [
                'autosort' => 1,
                'adminsort' => 1,
                'use_query_ASC_DESC' => '',
                'archive_drag_drop' => 1,
                'capability' => 'manage_options',
                'navigation_sort_apply' => 1,
            ],
            'theme_duplicate_options' => [
                'capability' => 'manage_options',
                'copy_draft' => 1
            ],
            'sortable_post_types' => $sortable_post_types,
            'duplicate_post_types' => $duplicate_post_types
        ];

        if($args){
            return $optionen[$args];
        }

        return $optionen;
    }

}