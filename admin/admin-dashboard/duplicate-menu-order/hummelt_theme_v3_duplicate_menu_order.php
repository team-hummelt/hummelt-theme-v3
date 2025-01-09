<?php
namespace Hummelt\ThemeV3;
use Hummelt_Theme_V3;

class hummelt_theme_v3_duplicate_menu_order
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

        add_filter('pre_get_posts', array($this, 'pre_get_posts'));
        add_filter('posts_orderby', array($this, 'posts_orderby'), 99, 2);
    }

    public function hummelt_theme_v3_sortable_init(): void
    {
        add_action('admin_init', array($this, 'admin_init'), 10);
        add_action('admin_enqueue_scripts', array($this, 'hummelt_theme_v3_drag_drop'), 10);
    }

    public function hummelt_theme_v3_duplicate_init():void
    {
        add_action('admin_enqueue_scripts', array($this, 'hummelt_theme_v3_duplicate'), 10);
    }

    public function hummelt_theme_v3_duplicate():void
    {
        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $themeDuplicateTypes = $optionen['duplicate_post_types'];
        $screen = get_current_screen();
        if (!isset($screen->post_type) || !$screen->post_type) {
            return;
        }
        if (isset($screen->taxonomy) && $screen->taxonomy) {
            return;
        }

        $checkPostType = function ($type) use ($themeDuplicateTypes) {
            foreach ($themeDuplicateTypes as $tmp) {
                if($tmp['name'] == $type) {
                    return $tmp['value'];
                }
            }
            return '';
        };

        $ifPostType = $checkPostType($screen->post_type);
        if($ifPostType != 'show') {
            return;
        }
        add_filter('page_row_actions', array($this, 'hummelt_theme_v3_duplicate_post_link'), 10, 2);
        add_filter('post_row_actions', array($this, 'hummelt_theme_v3_duplicate_post_link'), 10, 2);
        global $wp_scripts;
        $isLoaded = $wp_scripts->do_item('hupa-starter-admin-ajax');
        if (!$isLoaded) {
            $this->hummelt_theme_v3_menu_options_scripts($screen);
        }
    }

    public function hummelt_theme_v3_drag_drop():void
    {
        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $theme_sort_options = $optionen['theme_sort_options'];
        $themeSortableTypes = $optionen['sortable_post_types'];

        if (!$theme_sort_options['archive_drag_drop']) {
            return;
        }

        if (!$theme_sort_options['adminsort']) {
            return;
        }

        $screen = get_current_screen();

        if (!$screen->post_type) {
            return;
        }
        if (isset($screen->taxonomy) && $screen->taxonomy) {
            return;
        }

        $checkPostType = function ($type) use ($themeSortableTypes) {
            foreach ($themeSortableTypes as $tmp) {
                if($tmp['name'] == $type) {
                    return $tmp['value'];
                }
            }
            return '';
        };

        $ifPostType = $checkPostType($screen->post_type);
        if($ifPostType != 'show') {
            return;
        }

        if (is_category() || is_tax()) {
            return;
        }
        if (isset($_GET['orderby']) && $_GET['orderby'] != 'menu_order') {
            return;
        }

        if (isset($_GET['post_status'])) {
            return;
        }

        if (isset($_GET['author'])) {
            return;
        }
        $this->hummelt_theme_v3_menu_options_scripts($screen);

    }

    public function pre_get_posts($query)
    {
        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $theme_sort_options = $optionen['theme_sort_options'];

        //no need if it's admin interface
        if (is_admin())
            return $query;

        //check for ignore_custom_sort
        if (isset($query->query_vars['ignore_custom_sort']) && $query->query_vars['ignore_custom_sort'] === TRUE)
            return $query;

        //ignore if  "nav_menu_item"
        if ($query->query_vars && isset($query->query_vars['post_type']) && $query->query_vars['post_type'] == "nav_menu_item")
            return $query;


        //if auto sort
        if ($theme_sort_options['autosort']) {
            if (isset($query->query['suppress_filters']))
                $query->query['suppress_filters'] = FALSE;

            if (isset($query->query_vars['suppress_filters']))
                $query->query_vars['suppress_filters'] = FALSE;
        }

        return $query;
    }

    public function posts_orderby($orderBy, $query)
    {
        global $wpdb;
        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $theme_sort_options = $optionen['theme_sort_options'];

        //check for ignore_custom_sort
        if (isset($query->query_vars['ignore_custom_sort']) && $query->query_vars['ignore_custom_sort'] === TRUE) {
            return $orderBy;
        }
        //ignore the bbpress
        if (isset($query->query_vars['post_type']) && ((is_array($query->query_vars['post_type']) && in_array("reply", $query->query_vars['post_type'])) || ($query->query_vars['post_type'] == "reply"))) {
            return $orderBy;
        }

        if (isset($query->query_vars['post_type']) && ((is_array($query->query_vars['post_type']) && in_array("topic", $query->query_vars['post_type'])) || ($query->query_vars['post_type'] == "topic"))) {
            return $orderBy;
        }
        //check for orderby GET parameter in which case return default data
        if (isset($_GET['orderby']) && $_GET['orderby'] != 'menu_order') {
            return $orderBy;
        }

        if (isset($_GET['product_orderby']) && $_GET['product_orderby'] != 'default') {
            return $orderBy;
        }
        //ignore search
        if ($query->is_search() && isset($query->query['s']) && !empty ($query->query['s'])) {
            return ($orderBy);
        }
        $order = '';
        if ($theme_sort_options['use_query_ASC_DESC']) {
            $order = isset($query->query_vars['order']) ? " " . $query->query_vars['order'] : '';
        }

        if ($theme_sort_options['autosort']) {
            if (trim($orderBy) == '') {
                $orderBy = "{$wpdb->posts}.menu_order " . $order;
            } else {
                $orderBy = "{$wpdb->posts}.menu_order" . $order . ", " . $orderBy;
            }
        }
        return ($orderBy);
    }

    public function hummelt_theme_v3_menu_options_scripts($screen):void
    {
        global $userdata;
        wp_enqueue_style('hupa-sortable-dd-style', HUMMELT_THEME_V3_ADMIN_URL . 'admin-dashboard/duplicate-menu-order/css/sortable-drag-and-drop-style.css');
        wp_enqueue_script('hummelt-theme-v3-sortable-script', HUMMELT_THEME_V3_ADMIN_URL . 'assets/js/tools/Sortable.min.js', array(), HUMMELT_THEME_V3_VERSION, true);
        wp_enqueue_script('hummelt-theme-v3-dashboard-tools', HUMMELT_THEME_V3_ADMIN_URL . 'admin-dashboard/duplicate-menu-order/js/sortable-posts.js', array(), HUMMELT_THEME_V3_VERSION, true);

        $nonce = wp_create_nonce('hummelt_theme_v3_admin_handle');
        wp_register_script('hupa-starter-admin-ajax', '', [], '', true);
        wp_enqueue_script('hupa-starter-admin-ajax');
        wp_localize_script('hupa-starter-admin-ajax', 'sort_ajax_obj', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => $nonce,
            'handle' => 'HummeltThemeV3Admin',
            'post_type' => $screen->post_type
        ));

    }

    public function hummelt_theme_v3_duplicate_post_link( $actions, $post ) {
        $postType = get_post_type($post->ID);
        $post_type_data = get_post_type_object($post->post_type);
        $actions['duplicate'] = '<span data-id="'.$post->ID.'" class="hupa-post-duplicate-item"
         aria-label="'.sprintf(__('%s duplicate', 'bootscore'),$post_type_data->labels->singular_name).'" 
        title="'.sprintf(__('%s duplizieren', 'bootscore'),$post_type_data->labels->singular_name).'">'.__('Duplicate', 'bootscore').'
        </span>';
        return $actions;
    }

    public function admin_init(): void
    {
        if (isset($_GET['page']) && strpos($_GET['page'],'order-post-types-')) {
            $current_post_type = get_post_type_object(str_replace('order-post-types-', '', $_GET['page']));
            if ($current_post_type == null) {
                wp_die('Invalid post type');
            }
        }
    }
}