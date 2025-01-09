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

class theme_hummelt_v3_database
{
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

    public function fn_hummelt_theme_v3_database_install($args = null):void
    {
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        global $wpdb;
        $table = $wpdb->prefix . $this->table_fonts;
        $charset_collate = $wpdb->get_charset_collate();
        $sql = "CREATE TABLE {$table} (
    		`id` int(11) NOT NULL AUTO_INCREMENT,
            `designation` varchar(128) NOT NULL,
            `fontSerif` varchar(64) NOT NULL,
            `localName` mediumtext NOT NULL,
            `fontInfo` mediumtext NOT NULL,
            `fontData` mediumtext NOT NULL,
            `isTtf` tinyint(1) NOT NULL DEFAULT 0,
            `isWoff` tinyint(1) NOT NULL DEFAULT 0,
            `isWoff2` tinyint(1) NOT NULL DEFAULT 0,
            `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
     ) $charset_collate;";
        dbDelta($sql);

        $table_table_forms = $wpdb->prefix . $this->table_forms;
        $sql = "CREATE TABLE {$table_table_forms} (
    		`id` int(11) NOT NULL AUTO_INCREMENT,
    		`designation` varchar(255) NOT NULL,
            `form_id` varchar(64) NOT NULL,
            `type` varchar(64) NOT NULL DEFAULT 'page',
            `form` longtext NOT NULL,
            `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
     ) $charset_collate;";
        dbDelta($sql);

        $table_table_forms_ref = $wpdb->prefix . $this->table_forms_ref;
        $sql = "CREATE TABLE {$table_table_forms_ref} (
    		`id` int(11) NOT NULL AUTO_INCREMENT,
            `form_id` int(11) NOT NULL,
            `form` longtext NOT NULL,
            `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            INDEX (form_id)
     ) $charset_collate;";
        dbDelta($sql);

    $wpdb->query("
    ALTER TABLE {$table_table_forms_ref} 
    ADD CONSTRAINT fk_form_id
    FOREIGN KEY (form_id) REFERENCES {$table_table_forms}(id)
    ON DELETE CASCADE ON UPDATE CASCADE");


      $table_table_forms_email = $wpdb->prefix . $this->table_forms_email;
        $sql = "CREATE TABLE {$table_table_forms_email} (
    		`id` int(11) NOT NULL AUTO_INCREMENT,
            `form_id` int(11) NOT NULL,
            `subject` varchar(128) NOT NULL,
            `abs_ip` varchar(128) NOT NULL,
            `send_data` text NOT NULL,
            `cc_bcc` text NOT NULL,
            `message` text NOT NULL,
            `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
     ) $charset_collate;";
        dbDelta($sql);
    }




}