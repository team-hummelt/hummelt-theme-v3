<?php
namespace Hummelt\ThemeV3;
use Hummelt_Theme_V3;

class hummelt_theme_v3_init_duplicate_menu_order
{
    use hummelt_theme_v3_options;
    use hummelt_theme_v3_selects;
    use hummelt_theme_v3_settings;

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

    public function hummelt_theme_v3_init_sortable():void
    {
        global $sortDuplicate;
        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $theme_sort_options = $optionen['theme_sort_options'];
        if(is_user_logged_in() && current_user_can($theme_sort_options['capability'])) {
            $sortDuplicate->hummelt_theme_v3_sortable_init();
        }
    }

    public function hummelt_theme_v3_init_duplicate():void
    {
        global $sortDuplicate;
        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $theme_duplicate_options = $optionen['theme_duplicate_options'];
        if(is_user_logged_in() && current_user_can($theme_duplicate_options['capability'])) {
            $sortDuplicate->hummelt_theme_v3_duplicate_init();
        }
    }

}