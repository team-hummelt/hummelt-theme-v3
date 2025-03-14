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

class hummelt_theme_v3_wp_optionen
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

    public function __construct(Hummelt_Theme_V3 $main)
    {
        $this->main = $main;
    }

    public function fn_hummelt_theme_v3_upload_mimes_svg($mimes):array
    {
        $mimes['svg'] = 'image/svg+xml';
        return $mimes;
    }

    public function fn_hummelt_theme_v3_disabled_comments():void
    {
        remove_post_type_support('post', 'comments');
        remove_post_type_support('page', 'comments');
        remove_post_type_support('post', 'trackbacks');
        remove_post_type_support('page', 'trackbacks');
    }

    public function fn_hummelt_theme_v3_disabled_xmlrpc_methods($methods)
    {
        unset($methods['pingback.ping']);
        return $methods;
    }

    public function fn_hummelt_theme_v3_disabled_pingback_methods($headers)
    {
        if (isset($headers['X-Pingback'])) {
            unset($headers['X-Pingback']);
        }
        return $headers;
    }
    public function fn_hummelt_theme_v3_disabled_pingback_trackbacks_methods($open, $post_id): bool
    {
        $post = get_post($post_id);
        if ('pingback' === get_post_meta($post->ID, '_pingme', true)) {
            delete_post_meta($post->ID, '_pingme');
        }
        return false;
    }

    public function fn_hummelt_theme_v3_disabled_comments_admin_bar_render(): void
    {
        global $wp_admin_bar;
        $wp_admin_bar->remove_menu('comments');
    }

    public function fn_hummelt_theme_v3_disabled_comments_admin_menu(): void
    {
        remove_menu_page('edit-comments.php');
    }

    public function fn_hummelt_theme_v3_disabled_gutenberg_widget():void
    {
        remove_theme_support('widgets-block-editor');
    }

    public function fn_hummelt_theme_v3_pre_upload($file)
    {

        add_filter('upload_dir', array($this, 'fn_hummelt_theme_v3_custom_upload_dir'));
        return $file;
    }

    public function fn_hummelt_theme_v3_post_upload($fileinfo)
    {
        remove_filter('upload_dir', array($this, 'fn_hummelt_theme_v3_custom_upload_dir'));
        return $fileinfo;
    }

    public function fn_hummelt_theme_v3_custom_upload_dir($path): array
    {
        if (isset($_POST['name'])) {
            $extension = substr(strrchr($_POST['name'], '.'), 1);
            if (!empty($path['error']) || $extension != 'pdf') {
                return $path;
            }
            $customdir = '/' . HUMMELT_THEME_V3_PDF_FOLDER_NAME;
            $path['path'] = str_replace($path['subdir'], '', $path['path']); //remove default subdir (year/month)
            $path['url'] = str_replace($path['subdir'], '', $path['url']);
            $path['subdir'] = $customdir;
            $path['path'] .= $customdir;
            $path['url'] .= $customdir;
        }
        return $path;
    }

    public function fn_hummelt_theme_v3_the_content_replace($content)
    {
        $regEx = '/(\[hupa-theme-remove-container].+?(wp-container-\d{1,5}))/';
        if (preg_match_all($regEx, $content, $matches)) {
            if (isset($matches[2]) && is_array($matches[2])) {
                foreach ($matches[2] as $tmp) {
                    $content = str_replace($tmp, '', $content);
                }
            }
        }
        return $content;
    }

    public function fn_hummelt_theme_v3_hide_update_nag(): void
    {
        remove_action('admin_notices', 'update_nag', 3);
    }

    public function fn_hummelt_theme_v3_hide_update_not_admin_nag(): void
    {
        if (!current_user_can('update_core')) {
            remove_action('admin_notices', 'update_nag', 3);
            add_filter('pre_site_transient_update_core', '__return_null');
            add_filter('pre_site_transient_update_plugins', '__return_null');
            add_filter('pre_site_transient_update_themes', '__return_null');
        }
    }

    /**
     * @param $rate
     * @return float|int
     */
    public function recovery_mail_infinite_rate_limit($rate): float|int
    {
        return 100 * YEAR_IN_SECONDS;
    }

    public function send_sumun_the_recovery_mode_email( $email, $url ) {
        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $updateMsg = $optionen['update_msg'];
        $email['to'] = $updateMsg['email_err_msg'];
        return $email;
    }

    public function disable_layout_support_for_columns($layout_support, $block_name)
    {
        if ($block_name === 'core/columns') {
            return false;
        }
        return $layout_support;
    }
}
