<?php

namespace Hummelt\ThemeV3;

use stdClass;

trait hummelt_theme_v3_settings
{
    protected string $table_fonts = 'hupa_fonts';
    protected string $table_forms = 'form_builder';
    protected string $table_forms_ref = 'form_builder_ref';
    protected string $table_forms_email = 'form_builder_email';
    protected array $ignore_post_types = ['reply', 'topic', 'wp_navigation', 'report', 'status', 'wp_block'];
    protected array $ignore_duplicate_post_types = ['reply', 'wp_navigation', 'attachment', 'topic', 'report', 'status', 'wp_block'];
    protected int $cron_aktiv = 1;
    protected string $cron_sync_interval = 'daily';

    //Leaflet defaults
    protected string $leaflet_rahmen_color = '#00732FB2';
    protected string $leaflet_fill_color = '#FF9F1534';
    protected string $leaflet_marker_color = '#d71723';
    protected int $polygone_border_width = 2;

    protected function get_font_weight($weight = ''): array
    {
        $font_weight = [
            'regular' => 'normal',
            'italic' => 'normal',
            'thin' => '100',
            'extralight' => '200',
            'light' => '300',
            'medium' => '500',
            'semibold' => '600',
            'black' => '900',
            'extrabold' => 'bold',
            'bold' => 'bold'
        ];
        if ($weight) {
            foreach ($font_weight as $key => $val) {
                if ($key == $weight) {
                    return ['weight' => $val];
                }
            }
            return [];
        }
        return $font_weight;
    }

    protected function get_leaflet_default($designation):array
    {
        return [
            'id' => uniqid(),
            'designation' => $designation,
            'tile_layer' => 'originalde',
            'pins' => []
        ];
    }

    protected function get_leaflet_default_pin($geo_json):array
    {
        return [
            'id' => uniqid(),
            'active' => true,
            'textbox' => '',
            'show_pin' => true,
            'polygone_show' => false,
            'polygone_border' => $this->leaflet_rahmen_color,
            'polygone_fill' => $this->leaflet_fill_color,
            'polygone_border_width' => $this->polygone_border_width,
            'marker_color' => $this->leaflet_marker_color,
            'geo_json' => $geo_json,
        ];
    }
}