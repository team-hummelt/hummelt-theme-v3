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
use stdClass;

class hummelt_theme_v3_font_database
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

    public function fn_theme_v3_get_font_data($args = false, $fetchMethod = true): object
    {
        $return = new stdClass();
        $return->status = false;
        $return->count = 0;

        global $wpdb;
        $fetchMethod ? $fetch = 'get_row' : $fetch = 'get_results';
        $table = $wpdb->prefix . $this->table_fonts;
        $result = $wpdb->$fetch("SELECT * FROM $table $args");

        if (!$result) {
            return $return;
        }

        $return->status = true;
        if ($fetch !== 'get_row') {
            $return->count = count($result);
        }
        $return->record = $result;

        return $return;
    }

    public function theme_hummelt_v3_get_font_by_args($id = null)
    {
        if($id) {
            $args = sprintf('WHERE id=%d', $id);
            $get = $this->fn_theme_v3_get_font_data($args);
        } else {
            $get = $this->fn_theme_v3_get_font_data('', false);
        }
        if(!$get->status) {
            return [];
        }
        if($id) {
            return apply_filters(HUMMELT_THEME_V3_SLUG . '/extract_font_data', $get->record);
        } else {
            $returnArr = [];
            foreach ($get->record as $tmp) {
                $returnArr[] = apply_filters(HUMMELT_THEME_V3_SLUG . '/extract_font_data', $tmp);
            }
            return $returnArr;
        }
    }

    public function fn_theme_v3_set_font_data($record): object
    {
        $return = new stdClass();
        global $wpdb;
        $table = $wpdb->prefix . $this->table_fonts;
        $wpdb->insert(
            $table,
            array(
                'designation' => $record->designation,
                'localName' => $record->localName,
                'fontSerif' => $record->fontSerif,
                'fontInfo' => $record->fontInfo,
                'fontData' => $record->fontData,
                'isTtf' => $record->isTtf,
                'isWoff' => $record->isWoff,
                'isWoff2' => $record->isWoff2
            ),
            array('%s', '%s', '%s', '%s', '%s', '%d', '%d', '%d')
        );
        if (!$wpdb->insert_id) {
            $return->status = false;

            return $return;
        }
        $return->status = true;
        $return->id = $wpdb->insert_id;

        return $return;
    }

    public function fn_theme_v3_update_font_data($record): void
    {
        global $wpdb;
        $table = $wpdb->prefix . $this->table_fonts;
        $wpdb->update(
            $table,
            array(
                'localName' => $record->localName,
                'fontInfo' => $record->fontInfo,
                'fontData' => $record->fontData,
                'isTtf' => $record->isTtf,
                'isWoff' => $record->isWoff,
                'isWoff2' => $record->isWoff2
            ),
            array('id' => $record->id),
            array('%s', '%s', '%s', '%d', '%d', '%d'),
            array('%d')
        );

    }

    public function fn_theme_v3_update_data($json, $id): void
    {
        global $wpdb;
        $table = $wpdb->prefix . $this->table_fonts;
        $wpdb->update(
            $table,
            array(
                'fontData' => $json
            ),
            array('id' => $id),
            array('%s'),
            array('%d')
        );
    }

    public function fn_theme_v3_delete_font_data($id): void
    {
        global $wpdb;
        $table = $wpdb->prefix . $this->table_fonts;
        $wpdb->delete(
            $table,
            array(
                'id' => $id
            ),
            array('%d')
        );
    }
}