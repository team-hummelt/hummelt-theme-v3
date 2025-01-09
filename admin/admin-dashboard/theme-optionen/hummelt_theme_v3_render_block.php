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

class hummelt_theme_v3_render_block
{
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
    }

    public function fn_hummelt_theme_v3_remove_columns($block_content, $block)
    {
        if ($block['blockName'] === 'core/columns') {
            // Entferne nur die `wp-block-columns` Klasse
            $block_content = str_replace('wp-block-columns', 'hupa-block-columns', $block_content);
        }

        if ($block['blockName'] === 'core/column') {
            // Entferne nur die `wp-block-column` Klasse
            $block_content = str_replace('wp-block-column', 'hupa-block-column', $block_content);
        }

        if ($block['blockName'] === 'core/group') {
            //wp-block-group
            $block_content = str_replace('wp-block-group', 'hupa-block-group', $block_content);
        }

        return $block_content;
    }
}