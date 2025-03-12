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

class hummelt_theme_v3_shortcodes
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

        add_shortcode('hupa-galerie', array($this, 'hupa_galerie_shortcode'));
        add_shortcode('cf', array($this, 'hupa_custom_fields'));
    }

    public function hupa_custom_fields($atts, $content, $tag): false|string
    {
        $a = shortcode_atts(array(
            'field' => ''
        ), $atts);
        ob_start();
        if ($a['field']) {
            $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
            $custom_fields = $settings['custom_fields'];
            $out = '';
            foreach ($custom_fields as $tmp) {
                if(!$tmp['value']) {
                    return ob_get_clean();
                }
                if ($tmp['slug'] == $a['field']) {
                    $icon = '';
                    $out .= '<span class="' . $tmp['extra_css'] . '">';
                    if ($tmp['icon']) {
                        $icon = '<i class="' . $tmp['icon'] . ' ' . $tmp['icon_css'] . '"></i>';
                    }
                    if ($tmp['link_type'] == 'text') {
                        $out .= $icon.$tmp['value'];
                    }
                    if ($tmp['link_type'] == 'mailto') {
                        if ($tmp['only_icon_display'] && $tmp['icon']) {
                            $out .= '<a href="mailto: ' . $tmp['value'] . '">' . $icon . '</a>';
                        } elseif ($tmp['icon_is_url'] && $tmp['icon']) {
                            $out .= '<a href="mailto: ' . $tmp['value'] . '">' . $icon . $tmp['value'] . '</a>';
                        } else {
                            $out .= $icon . '<a href="mailto: ' . $tmp['value'] . '">' . $tmp['value'] . '</a>';
                        }
                    }
                    if ($tmp['link_type'] == 'tel') {
                        $tel = str_replace([' ', '-', '/', '+', '(0)', '|', '(', ')'], ['', '', '', '+', '', '', '', ''], $tmp['value']);
                        if ($tmp['only_icon_display'] && $tmp['icon']) {
                            $out .= '<a href="tel: ' . $tel . '">' . $icon . '</a>';
                        } elseif ($tmp['icon_is_url'] && $tmp['icon']) {
                            $out .= '<a href="tel: ' . $tel . '">' . $icon . $tmp['value'] . '</a>';
                        } else {
                            $out .= $icon . '<a href="tel: ' . $tel . '">' . $tmp['value'] . '</a>';
                        }
                    }
                    if ($tmp['link_type'] == 'url') {

                        if ($tmp['show_url']) {
                            $url = $tmp['value'];
                        } else {
                            $url = $tmp['designation'];
                        }
                        if ($tmp['new_tab']) {
                            $tab = '_blank';
                        } else {
                            $tab = '_self';
                        }
                        if ($tmp['only_icon_display'] && $tmp['icon']) {
                            $out .= '<a target="' . $tab . '" href="' . $url . '">' . $icon . '</a>';
                        } elseif ($tmp['icon_is_url'] && $tmp['icon']) {
                            $out .= '<a target="' . $tab . '" href="' . $tmp['value'] . '">' . $icon . $url . '</a>';
                        } else {
                            $out .= $icon . '<a target="' . $tab . '" href="' . $tmp['value'] . '">' . $url . '</a>';
                        }
                    }
                    $out .= '</span>';
                }
            }
            echo $this->fn_compress_string($out);
        }

        return ob_get_clean();
    }

    public function hupa_galerie_shortcode($atts, $content, $tag): false|string
    {
        $a = shortcode_atts(array(
            'color' => '#a4a4a4',
            'id' => ''
        ), $atts);

        ob_start();
        ?>
        <h2>Mein Galerie Shortcode </h2>
        <?php
        return ob_get_clean();
    }

    private function fn_compress_string(string $string): string
    {
        if (!$string) {
            return $string;
        }
        return preg_replace(['/<!--(.*)-->/Uis', "/[[:blank:]]+/"], ['', ' '], str_replace(["\n", "\r", "\t"], '', $string));
    }
}