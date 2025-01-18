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
use WP_Query;

class hummelt_theme_v3_post_types
{
    use hummelt_theme_v3_options;
    use hummelt_theme_v3_selects;

    /**
     * Store plugin main class to allow admin access.
     *
     * @since    2.0.0
     * @access   private
     * @var Hummelt_Theme_V3 $main The main class.
     */
    protected Hummelt_Theme_V3 $main;

    /**
     * Custom capabilities of custom post types
     */
    private $themeCustomCaps = array(
        ['singular' => 'theme_footer', 'plural' => 'theme_footers'],
        ['singular' => 'theme_header', 'plural' => 'theme_headers'],
        ['singular' => 'theme_design', 'plural' => 'theme_designs'],
    );

    public function __construct(Hummelt_Theme_V3 $main)
    {
        $this->main = $main;
    }

    /**
     * Add custom capabilities for admin
     */
    public function add_admin_capabilities(): void
    {

        $role = get_role('administrator');

        foreach ($this->themeCustomCaps as $cap) {
            $singular = $cap['singular'];
            $plural = $cap['plural'];
            $role->add_cap("edit_$singular");
            $role->add_cap("edit_$plural");
            $role->add_cap("edit_others_$plural");
            $role->add_cap("publish_$plural");
            $role->add_cap("read_$singular");
            $role->add_cap("read_private_$plural");
            $role->add_cap("delete_$singular");
            $role->add_cap("delete_$plural");
            $role->add_cap("delete_private_$plural");
            $role->add_cap("delete_others_$plural");
            $role->add_cap("edit_published_$plural");
            $role->add_cap("edit_private_$plural");
            $role->add_cap("delete_published_$plural");
        }

        $role->add_cap("manage_theme_designs");
        $role->add_cap("edit_theme_designs");
        $role->add_cap("delete_theme_designs");
        $role->add_cap("assign_theme_designs");
    }

    /**
     * Add custom capabilities for admin
     */
    public function add_subscriber_capabilities(): void
    {


        $current_user = wp_get_current_user();
        if (!in_array('administrator', $current_user->roles)) {

            $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
            $capabilities = $settings['theme_capabilities'];
            $footer = $capabilities['custom-footer'];
            $header = $capabilities['custom-header'];
            $design = $capabilities['design-vorlagen'];

            $setCustomPostTypeCaps = function ($singular, $plural, $role) {
                $role->add_cap("edit_$singular");
                $role->add_cap("edit_$plural");
                $role->add_cap("edit_others_$plural");
                $role->add_cap("publish_$plural");
                $role->add_cap("read_$singular");
                $role->add_cap("read_private_$plural");
                $role->add_cap("delete_$singular");
                $role->add_cap("delete_$plural");
                $role->add_cap("delete_private_$plural");
                $role->add_cap("delete_others_$plural");
                $role->add_cap("edit_published_$plural");
                $role->add_cap("edit_private_$plural");
                $role->add_cap("delete_published_$plural");
            };
            $role = get_role($this->select_user_role($footer)['cap']);
            if ($role) {
                $setCustomPostTypeCaps('theme_footer', 'theme_footers', $role);
            }
            $role = get_role($this->select_user_role($header)['cap']);
            if ($role) {
                $setCustomPostTypeCaps('theme_header', 'theme_headers', $role);
            }
            $role = get_role($this->select_user_role($design)['cap']);
            if ($role) {
                $setCustomPostTypeCaps('theme_design', 'theme_design', $role);
                $role->add_cap("manage_theme_designs");
                $role->add_cap("edit_theme_designs");
                $role->add_cap("delete_theme_designs");
                $role->add_cap("assign_theme_designs");
            }
        }
    }

    /**
     * ===============================================================
     * =========== THEME CREATE DESIGN TEMPLATES POST TYPE ===========
     * ===============================================================
     */

    public function register_hummelt_theme_v3_design_vorlagen_post_types(): void
    {
        register_post_type(
            'theme_design',
            array(
                'labels' => array(
                    'name' => __('Design Vorlagen', 'bootscore'),
                    'singular_name' => __('Vorlage', 'bootscore'),
                    'edit_item' => __('Vorlage bearbeiten', 'bootscore'),
                    'all_items' => __('Alle Vorlagen', 'bootscore'),
                    'items_list_navigation' => __('Design template list navigation', 'bootscore'),
                    'add_new_item' => __('neue Vorlage erstellen', 'bootscore'),
                    'archives' => __('Vorlagen Archive', 'bootscore')
                ),
                'public' => true,
                'publicly_queryable' => false,
                'show_in_rest' => true,
                'show_ui' => true,
                'show_in_menu' => false,
                'has_archive' => false,
                'show_in_nav_menus' => false,
                'exclude_from_search' => true,
                'menu_icon' => $this->main->get_svg_icons('journal'),
                'menu_position' => 82,
                'capability_type' => ['theme_design', 'theme_designs'],
                'capabilities' => array(
                    'edit_post' => 'edit_theme_design',
                    'read_post' => 'read_theme_design',
                    'delete_post' => 'delete_theme_design',
                    'edit_posts' => 'edit_theme_designs',
                    'edit_others_posts' => 'edit_others_theme_designs',
                    'publish_posts' => 'publish_theme_designs',
                    'read_private_posts' => 'read_private_theme_designs',
                ),
                'map_meta_cap' => true,
                'supports' => array(
                    'title',
                    'custom-fields',
                    'excerpt',
                    'page-attributes',
                    'editor',
                    'post-formats'
                ),
                'taxonomies' => array('theme_design_category'),
            )
        );
    }

    /**
     * Register Custom Taxonomies for Team-Members Post-Type.
     *
     * @since    1.0.0
     */
    public static function register_hummelt_theme_v3_vorlagen_taxonomies(): void
    {
        $labels = array(
            'name' => __('Vorlagen Kategorien', 'bootscore'),
            'singular_name' => __('Vorlage Kategorie', 'bootscore'),
            'search_items' => __('Vorlage Kategorie suchen', 'bootscore'),
            'all_items' => __('Alle Kategorien', 'bootscore'),
            'parent_item' => __('Übergeordnete Kategorie', 'bootscore'),
            'parent_item_colon' => __('Übergeordnete Kategorie:', 'bootscore'),
            'edit_item' => __('Design Kategorie bearbeiten', 'bootscore'),
            'update_item' => __('Update Design Kategorie', 'bootscore'),
            'add_new_item' => __('neue Kategorie hinzufügen', 'bootscore'),
            'new_item_name' => __('neue Kategorie', 'bootscore'),
            'menu_name' => __('Design Kategorien', 'bootscore'),
        );

        $args = array(
            'labels' => $labels,
            'hierarchical' => true,
            'show_ui' => true,
            'sort' => false,
            'show_in_rest' => true,
            'query_var' => true,
            'args' => array('orderby' => 'term_order'),
            'rewrite' => array('slug' => 'theme_design_category'),
            'show_admin_column' => false,
            'capabilities' => array(
                'manage_terms' => 'manage_theme_designs', // Kategorien verwalten
                'edit_terms' => 'edit_theme_designs',     // Kategorien bearbeiten
                'delete_terms' => 'delete_theme_designs', // Kategorien löschen
                'assign_terms' => 'assign_theme_designs', // Kategorien zuweisen
            ),
        );
        register_taxonomy('theme_design_category', array('theme_design'), $args);

        if (!term_exists('Hupa Design General', 'theme_design_category')) {
            wp_insert_term(
                'Theme v3 Design General',
                'theme_design_category',
                array(
                    'description' => __('Standard category for Design templates', 'bootscore'),
                    'slug' => 'hupa-design-templates-posts'
                )
            );
        }
    }

    public function register_theme_hummelt_v3_header_post_types(): void
    {
        register_post_type(
            'theme_header',
            array(
                'labels' => array(
                    'name' => __('Header', 'bootscore'),
                    'singular_name' => __('Header', 'bootscore'),
                    'edit_item' => __('Header bearbeiten', 'bootscore'),
                    'items_list_navigation' => __('Header list navigation', 'bootscore'),
                    'add_new_item' => __('neuen Header erstellen', 'bootscore'),
                    'archives' => __('Header Archives', 'bootscore'),
                ),
                'public' => true,
                'publicly_queryable' => false,
                'show_in_rest' => true,
                'show_ui' => true,
                'show_in_menu' => false,
                'has_archive' => false,
                'show_in_nav_menus' => false,
                'exclude_from_search' => true,
                'menu_icon' => $this->main->get_svg_icons('columns-gap'),
                'menu_position' => 80,
                'capability_type' => array('theme_header', 'theme_headers'),
                'capabilities' => array(
                    'edit_post' => 'edit_theme_header',
                    'read_post' => 'read_theme_header',
                    'delete_post' => 'delete_theme_header',
                    'edit_posts' => 'edit_theme_headers',
                    'edit_others_posts' => 'edit_others_theme_headers',
                    'publish_posts' => 'publish_theme_headers',
                    'read_private_posts' => 'read_private_theme_headers',
                ),
                'map_meta_cap' => true,
                'supports' => array(
                    'title',
                    'custom-fields',
                    'excerpt',
                    'page-attributes',
                    'editor',
                    'post-formats'
                )
            )
        );
    }

    public function register_hummelt_theme_v3_footer_post_types(): void
    {
        register_post_type(
            'theme_footer',
            array(
                'labels' => array(
                    'name' => __('Footer', 'bootscore'),
                    'singular_name' => __('Footer', 'bootscore'),
                    'edit_item' => __('Footer bearbeiten', 'bootscore'),
                    'items_list_navigation' => __('Footer list navigation', 'bootscore'),
                    'add_new_item' => 'Neuen Footer erstellen',
                    'archives' => __('Footer Archives', 'bootscore')
                ),
                'public' => true,
                'publicly_queryable' => false,
                'show_in_rest' => true,
                'show_ui' => true,
                'show_in_menu' => false,
                'has_archive' => false,
                'show_in_nav_menus' => false,
                'exclude_from_search' => true,
                'menu_icon' => $this->main->get_svg_icons('columns'),
                'menu_position' => 81,
                'capability_type' => array('theme_footer', 'theme_footers'),
                'capabilities' => array(
                    'edit_post' => 'edit_theme_footer',
                    'read_post' => 'read_theme_footer',
                    'delete_post' => 'delete_theme_footer',
                    'edit_posts' => 'edit_theme_footers',
                    'edit_others_posts' => 'edit_others_theme_footers',
                    'publish_posts' => 'publish_theme_footers',
                    'read_private_posts' => 'read_private_theme_footers',
                ),
                'map_meta_cap' => true,
                'supports' => array(
                    'title',
                    'custom-fields',
                    'excerpt',
                    'page-attributes',
                    'editor',
                    'post-formats'
                )
            )
        );
    }

    public function fn_hummelt_theme_v3_register_sidebars(): void
    {
        // Sidebar
        register_sidebar(array(
            'name' => esc_html__('Sidebar 2', 'bootscore'),
            'id' => 'sidebar-2',
            'description' => esc_html__('Add widgets here.', 'bootscore'),
            'before_widget' => '<section id="%1$s" class="widget %2$s content-sidebar-2 widget-sidebar card card-body mb-4">',
            'after_widget' => '</section>',
            'before_title' => '<h3 class="widget-title title-sidebar-2 card-title fst-normal fw-normal border-bottom py-2">',
            'after_title' => '</h3>',
        ));

        register_sidebar(array(
            'name' => esc_html__('Sidebar 3', 'bootscore'),
            'id' => 'sidebar-3',
            'description' => esc_html__('Add widgets here.', 'bootscore'),
            'before_widget' => '<section id="%1$s" class="widget %2$s widget-sidebar content-sidebar-3 card card-body mb-4">',
            'after_widget' => '</section>',
            'before_title' => '<h3 class="widget-title title-sidebar-3 card-title fst-normal fw-normal border-bottom py-2">',
            'after_title' => '</h3>',
        ));

        register_sidebar(array(
            'name' => esc_html__('Sidebar 4', 'bootscore'),
            'id' => 'sidebar-4',
            'description' => esc_html__('Add widgets here.', 'bootscore'),
            'before_widget' => '<section id="%1$s" class="widget %2$s widget-sidebar content-sidebar-4 card card-body mb-4">',
            'after_widget' => '</section>',
            'before_title' => '<h3 class="widget-title title-sidebar-4 card-title fst-normal fw-normal border-bottom py-2">',
            'after_title' => '</h3>',
        ));
    }

    public function fn_theme_v3_get_header(): array
    {
        $headerArgs = array(
            'post_type' => 'theme_header',
            'post_status' => 'publish',
            'posts_per_page' => -1
        );
        $header = new WP_Query($headerArgs);
        $headerArr = [];
        foreach ($header->posts as $tmp) {

            $headerItem = [
                'id' => $tmp->ID,
                'label' => $tmp->post_title
            ];
            $headerArr[] = $headerItem;
        }

        sort($headerArr);
        return $headerArr;
    }

    public function fn_theme_v3_get_footer(): array
    {
        $footerArgs = array(
            'post_type' => 'theme_footer',
            'post_status' => 'publish',
            'posts_per_page' => -1
        );
        $footer = new WP_Query($footerArgs);
        $footerArr = [];
        foreach ($footer->posts as $tmp) {
            $footerItem = [
                'id' => $tmp->ID,
                'label' => $tmp->post_title
            ];
            $footerArr[] = $footerItem;
        }

        sort($footerArr);
        return $footerArr;
    }

    public function fn_theme_v3_get_sidebars(): array
    {
        global $wp_registered_sidebars;
        $siteBarArr = [];
        foreach ($wp_registered_sidebars as $id => $sidebar) {
            if (str_starts_with($id, 'sidebar')) {
                $item = [
                    'id' => $id,
                    'name' => $sidebar['name'],
                    'description' => $sidebar['description']
                ];
                $siteBarArr[] = $item;
            }
        }
        sort($siteBarArr);
        return $siteBarArr;
    }

    public function fn_theme_v3_get_pages(): array
    {
        $pages = get_posts(array(
            'numberposts' => -1,
            'post_type' => 'page',
            'post_status' => 'publish',
        ));
        $pageArr = [];
        foreach ($pages as $page) {
            $item = [
                'id' => $page->ID,
                'name' => $page->post_name,
                'title' => $page->post_title
            ];
            $pageArr[] = $item;
        }
        sort($pageArr);
        return $pageArr;
    }


    public function fn_hummelt_theme_v3_admin_menu(): void
    {
        // Entferne das Standard-Menü deines Custom Post Types
        remove_menu_page('edit.php?post_type=theme_header');
        remove_menu_page('edit.php?post_type=theme_footer');
        remove_menu_page('edit.php?post_type=theme_design');
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $capabilities = $settings['theme_capabilities'];
        $dsSettings = get_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses');
        if ($dsSettings['theme']['aktiv']) {
            // Füge es als Untermenü zu deinem Hauptmenü hinzu
            add_submenu_page(
                'hummelt-theme-v3-dashboard',       // Slug des Hauptmenüs
                'Header',
                'Header',
                $capabilities['custom-header'],
                'edit.php?post_type=theme_header'
            );

            /*add_submenu_page(
                'hummelt-theme-v3-dashboard',
                'neuen Header',
                'neuen Header',
                'manage_options',
                'post-new.php?post_type=theme_footer'
            );*/

            add_submenu_page(
                'hummelt-theme-v3-dashboard',
                'Footer',
                'Footer',
                $capabilities['custom-footer'],
                'edit.php?post_type=theme_footer'
            );
            /* add_submenu_page(
                 'hummelt-theme-v3-dashboard',
                 'Footer',
                 'neuer Footer',
                 'manage_options',
                 'post-new.php?post_type=theme_footer'
             );*/
            add_submenu_page(
                'hummelt-theme-v3-dashboard',
                'Design Vorlagen',
                'Design Vorlagen',
                $capabilities['design-vorlagen'],
                'edit.php?post_type=theme_design'
            );
            /* add_submenu_page(
                 'hummelt-theme-v3-dashboard',
                 'Design Vorlagen',
                 'neue Vorlagen',
                 'manage_options',
                 'post-new.php?post_type=theme_design'
             );*/
            add_submenu_page(
                'hummelt-theme-v3-dashboard',
                'Design Kategorie',
                'Design Kategorie',
                $capabilities['design-vorlagen'],
                'edit-tags.php?taxonomy=theme_design_category&post_type=theme_design'
            );

            global $submenu;

            if (isset($submenu['hummelt-theme-v3-dashboard'])) {
                //$submenu['hummelt-theme-v3-dashboard'][4][0] = '<span class="nested">neuer Header</span>';
                //$submenu['hummelt-theme-v3-dashboard'][6][0] = '<span class="nested">neuer Footer</span>';
                //$submenu['hummelt-theme-v3-dashboard'][8][0] = '<span class="nested">neue Vorlage</span>';
                $submenu['hummelt-theme-v3-dashboard'][7][0] = '<span class="nested">Design Kategorie</span>';
            }
        }

    }

    public function fn_register_hummelt_theme_v3_widgets(): void
    {
        register_sidebar(array(
            'name' => __('Top Area 1', 'bootscore'),
            'id' => 'top-area-1',
            'description' => __('Bereich für Informationen oder Kontaktinformationen.', 'bootscore'),
            'before_widget' => '<div id="%1$s" class="widget %2$s">',
            'after_widget' => '</div>',
            'before_title' => '<div class="widget-title d-none">',
            'after_title' => '</div>',
        ));

        register_sidebar(array(
            'name' => __('Top Area 2', 'bootscore'),
            'id' => 'top-area-2',
            'description' => __('Bereich für Informationen oder Kontaktinformationen.', 'bootscore'),
            'before_widget' => '<div id="%1$s" class="widget %2$s">',
            'after_widget' => '</div>',
            'before_title' => '<div class="widget-title d-none">',
            'after_title' => '</div>',
        ));

        register_sidebar(array(
            'name' => __('Top Area 3', 'bootscore'),
            'id' => 'top-area-3',
            'description' => __('Bereich für Informationen oder Kontaktinformationen.', 'bootscore'),
            'before_widget' => '<div id="%1$s" class="widget %2$s">',
            'after_widget' => '</div>',
            'before_title' => '<div class="widget-title d-none">',
            'after_title' => '</div>',
        ));
    }

    public function fn_hummelt_theme_v3_custom_admin_admin_css(): void
    {
        echo '<style>
        .wp-submenu span.nested {
            margin-left: 10px;
        }
    </style>';
    }

}