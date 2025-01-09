<?php
namespace Hummelt\ThemeV3;
use Hummelt_Theme_V3;

class hummelt_theme_v3_menu_order
{
    private static $instance;
    protected $current_post_type;

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
    public static function instance(string  $theme_name, string  $theme_version, Hummelt_Theme_V3  $main): self
    {
        if (is_null(self::$instance)) {
            self::$instance = new self($main);
        }
        return self::$instance;
    }

    public function __construct(Hummelt_Theme_V3  $main)
    {
        $this->main = $main;
    }
}