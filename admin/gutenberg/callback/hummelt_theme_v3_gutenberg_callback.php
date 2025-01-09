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

class hummelt_theme_v3_gutenberg_callback
{
    public function leaflet_block_callback($attributes, $content)
    {
        return apply_filters('gutenberg_leaflet_render', $attributes);
    }

    public function gutenberg_block_leaflet_render_filter($attributes): false|string
    {
        isset($attributes['selectedLeaflet']) ? $selectedLeaflet = $attributes['selectedLeaflet'] : $selectedLeaflet = '';
        isset($attributes['selectedDatenschutz']) ? $selectedDatenschutz = $attributes['selectedDatenschutz'] : $selectedDatenschutz = '';
        isset($attributes['cardWidth']) ? $cardWidth = $attributes['cardWidth'] : $cardWidth = '600px';
        isset($attributes['cardHeight']) ? $cardHeight = $attributes['cardHeight'] : $cardHeight = '450px';
        isset($attributes['cardZoom']) ? $cardZoom = $attributes['cardZoom'] : $cardZoom = 14;
        isset($attributes['clusterRadius']) ? $clusterRadius = $attributes['clusterRadius'] : $clusterRadius = 20;
        isset($attributes['minZoom']) ? $minZoom = $attributes['minZoom'] : $minZoom = 8;
        isset($attributes['maxZoom']) ? $maxZoom = $attributes['maxZoom'] : $maxZoom = 18;
        isset($attributes['showMinimap']) ? $showMinimap = $attributes['showMinimap'] : $showMinimap = true;
        isset($attributes['minimapWidth']) ? $minimapWidth = $attributes['minimapWidth'] : $minimapWidth = 150;
        isset($attributes['minimapHeight']) ? $minimapHeight = $attributes['minimapHeight'] : $minimapHeight = 150;
        isset($attributes['minimapMinZoom']) ? $minimapMinZoom = $attributes['minimapMinZoom'] : $minimapMinZoom = 5;
        isset($attributes['minimapMinZoom']) ? $minimapMaxZoom = $attributes['minimapMaxZoom'] : $minimapMaxZoom = 15;
        isset($attributes['className']) ? $className = $attributes['className'] : $className = '';

        $randId = uniqid();
        $data = [
            'id' => $randId,
            'leaflet' => $selectedLeaflet,
            'ds' => $selectedDatenschutz,
            'width' => $cardWidth,
            'height' => $cardHeight,
            'cluster_radius' => (int)$clusterRadius,
            'zoom' => (int)$cardZoom,
            'min_zoom' => (int)$minZoom,
            'max_zoom' => (int)$maxZoom,
            'show_minimap' => (bool)$showMinimap,
            'minimap_width' => (int)$minimapWidth,
            'minimap_height' => (int)$minimapHeight,
            'minimap_min_zoom' => (int)$minimapMinZoom,
            'minimap_max_zoom' => (int)$minimapMaxZoom,
        ];
        $leafletData = base64_encode(json_encode($data));
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $leaflet = $settings['leaflet'];
        $isLeaflet = false;
        $isPin = false;
        foreach ($leaflet as $tmp) {
            if ($tmp['id'] == $selectedLeaflet) {
                foreach ($tmp['pins'] as $pin) {
                    if ($pin['active']) {
                        $isPin = true;
                        break;
                    }
                }
                $isLeaflet = true;
                break;
            }
        }
        ob_start();
        if (!$selectedLeaflet || !$isLeaflet || !$isPin) :
            echo '<span class="text-danger"><i class="bi bi-exclamation-triangle me-1"></i>Leaflet Map <b class="fw-semibold">nicht</b> geladen!</span>';
        else: ?>
            <div id="loader-<?= $randId ?>" class="theme-v3-leaflet-loader" data-leaflet="<?= $leafletData ?>"></div>
            <div id="map-<?= $randId ?>" style="width: <?= $cardWidth ?>; height: <?= $cardHeight ?>"
                 class="theme-leaflet leaflet-container img-fluid <?= $className ?>"></div>
        <?php
        endif;
        return ob_get_clean();
    }

    public function gmaps_iframe_block_callback($attributes, $content)
    {

        return apply_filters('gmaps_iframe_render', $attributes, $content);
    }

    public function gutenberg_block_gmaps_iframe_render_filter($attributes, $content): false|string
    {
        isset($attributes['className']) ? $className = $attributes['className'] : $className = '';
        isset($attributes['datenschutz']) ? $datenschutz = $attributes['datenschutz'] : $datenschutz = '';
        isset($attributes['iframeUrl']) ? $iframeUrl = $attributes['iframeUrl'] : $iframeUrl = '';
        isset($attributes['iframeWidth']) ? $iframeWidth = $attributes['iframeWidth'] : $iframeWidth = 600;
        isset($attributes['iframeHeight']) ? $iframeHeight = $attributes['iframeHeight'] : $iframeHeight = 450;
        $randId = uniqid();
        $gmaps = [
            'id' => $randId,
            'type' => 'gmaps',
            'ds' => $datenschutz,
            'width' => $iframeWidth,
            'height' => $iframeHeight,
            'url' => base64_encode($iframeUrl)
        ];
        $gmapsData = base64_encode(json_encode($gmaps));
        ob_start();
        if (!$iframeUrl) :
            echo '<span class="text-danger"><i class="bi bi-exclamation-triangle me-1"></i> Google Maps Iframe <b class="fw-semibold">nicht</b> geladen!</span>';
        else: ?>
            <div id="iframe-loader-<?= $randId ?>" class="theme-v3-iframe-loader" data-iframe="<?= $gmapsData ?>"></div>
            <div id="iframe-map-<?= $randId ?>" style="width: <?= $iframeWidth ?>px; height: <?= $iframeHeight ?>px"
                 class="theme-iframe-maps img-fluid  <?= $className ?>"></div>
        <?php
        endif;
        return ob_get_clean();
    }

    public function osm_iframe_block_callback($attributes, $content)
    {

        return apply_filters('osm_iframe_render', $attributes, $content);
    }

    public function gutenberg_block_osm_iframe_render_filter($attributes, $content): false|string
    {
        isset($attributes['className']) ? $className = $attributes['className'] : $className = '';
        isset($attributes['datenschutz']) ? $datenschutz = $attributes['datenschutz'] : $datenschutz = '';
        isset($attributes['iframeUrl']) ? $iframeUrl = $attributes['iframeUrl'] : $iframeUrl = '';
        isset($attributes['largeUrl']) ? $largeUrl = $attributes['largeUrl'] : $largeUrl = '';
        isset($attributes['iframeWidth']) ? $iframeWidth = $attributes['iframeWidth'] : $iframeWidth = 600;
        isset($attributes['iframeHeight']) ? $iframeHeight = $attributes['iframeHeight'] : $iframeHeight = 450;
        $randId = uniqid();
        $osm = [
            'id' => $randId,
            'type' => 'openstreetmap',
            'ds' => $datenschutz,
            'width' => $iframeWidth,
            'height' => $iframeHeight,
            'url' => base64_encode($iframeUrl),
            'large_url' => base64_encode($largeUrl)
        ];
        $osmData = base64_encode(json_encode($osm));

        ob_start();
        if (!$iframeUrl) :
            echo '<span class="text-danger"><i class="bi bi-exclamation-triangle me-1"></i> OpenStreetMaps Iframe <b class="fw-semibold">nicht</b> geladen!</span>';
        else: ?>
            <div id="iframe-loader-<?= $randId ?>" class="theme-v3-iframe-loader" data-iframe="<?= $osmData ?>"></div>
            <div id="iframe-map-<?= $randId ?>" style="width: <?= $iframeWidth ?>px; height: <?= $iframeHeight ?>px"
                 class="theme-iframe-maps iframe-osm position-relative img-fluid <?= $className ?>"></div>
        <?php
        endif;
        return ob_get_clean();
    }

    public function gmaps_api_block_callback($attributes, $content)
    {
        return apply_filters('gmaps_api_render', $attributes, $content);
    }

    public function gutenberg_block_gmaps_api_render_filter($attributes, $content): false|string
    {
        isset($attributes['className']) ? $className = $attributes['className'] : $className = '';
        isset($attributes['datenschutz']) ? $datenschutz = $attributes['datenschutz'] : $datenschutz = '';
        isset($attributes['cardWidth']) ? $cardWidth = $attributes['cardWidth'] : $cardWidth = '600px';
        isset($attributes['cardHeight']) ? $cardHeight = $attributes['cardHeight'] : $cardHeight = '450px';
        isset($attributes['cardZoom']) ? $cardZoom = $attributes['cardZoom'] : $cardZoom = 15;
        $randId = uniqid();
        $data = [
            'id' => $randId,
            'ds' => $datenschutz,
            'width' => $cardWidth,
            'height' => $cardHeight,
            'zoom' => (int)$cardZoom
        ];
        $gmapsData = base64_encode(json_encode($data));
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $gmaps = $settings['google_maps_api'];

        $pins = $gmaps['map_pins'];
        $apiKey = $gmaps['map_apikey'];
        $isApi = false;
        if (count($pins) && strlen($apiKey) > 13) {
            $isApi = true;
        }
        ob_start();
        if (!$isApi):
            echo '<span class="text-danger"><i class="bi bi-exclamation-triangle me-1"></i>Google Maps API <b class="fw-semibold">nicht</b> geladen!</span>';
        else:?>
            <div id="gmaps-api-loader-<?= $randId ?>" class="theme-v3-gmaps-api-loader"
                 data-gmaps-api="<?= $gmapsData ?>"></div>
            <div id="gmaps-api-map-<?= $randId ?>" style="width: <?= $cardWidth ?>; height: <?= $cardHeight ?>"
                 class="theme-gmaps-api gmaps-api-container img-fluid <?= $className ?>"></div>
        <?php
        endif;
        return ob_get_clean();
    }

    public function form_builder_block_callback($attributes, $content)
    {
        return apply_filters('form_builder_render', $attributes, $content);
    }

    public function gutenberg_block_form_builder_render_filter($attributes, $content): false|string
    {
        isset($attributes['className']) ? $className = $attributes['className'] : $className = '';
        isset($attributes['formular']) ? $formular = $attributes['formular'] : $formular = '';
        $args = sprintf('WHERE id=%d', $formular);
        $isFormular = apply_filters(HUMMELT_THEME_V3_SLUG.'/get_form_builder', $args);
        ob_start();
        if ($isFormular->status):  ?>
            <div class="app-formular-builder <?=$className?>" data-id="<?=$formular?>"></div>
        <?php else: ?>
            <span class="text-danger"><i class="bi bi-exclamation-triangle me-1"></i>Formular <b class="fw-semibold">nicht</b> gefunden!</span>
        <?php endif;
        return ob_get_clean();
    }

    public function theme_gallery_callback($attributes, $content)
    {
        return apply_filters('theme_gallery_render', $attributes, $content);
    }

    public function gutenberg_block_theme_gallery_render_filter($attributes, $content): false|string
    {
        isset($attributes['className']) ? $className = filter_var($attributes['className'], FILTER_UNSAFE_RAW) : $className = '';
        isset($attributes['images']) ? $images = $attributes['images'] : $images = [];
        isset($attributes['imageSize']) ? $imageSize = filter_var($attributes['imageSize'], FILTER_UNSAFE_RAW) : $imageSize = 'large';
        isset($attributes['imageWidth']) ? $imageWidth = filter_var($attributes['imageWidth'], FILTER_VALIDATE_INT)  : $imageWidth = 260;
        isset($attributes['imageHeight']) ? $imageHeight = filter_var($attributes['imageHeight'], FILTER_VALIDATE_INT)  : $imageHeight = 160;
        isset($attributes['galleryType']) ? $galleryType = filter_var($attributes['galleryType'], FILTER_UNSAFE_RAW)  : $galleryType = 'gallery';
        isset($attributes['imageCrop']) ? $imageCrop = filter_var($attributes['imageCrop'], FILTER_VALIDATE_BOOLEAN)  : $imageCrop = true;
        isset($attributes['lazyLoad']) ? $lazyLoad = filter_var($attributes['lazyLoad'], FILTER_VALIDATE_BOOLEAN)  : $lazyLoad = true;
        isset($attributes['lazyLoadAnimation']) ? $lazyLoadAnimation = filter_var($attributes['lazyLoadAnimation'], FILTER_VALIDATE_BOOLEAN)  : $lazyLoadAnimation = false;
        isset($attributes['repeatAnimation']) ? $repeatAnimation = filter_var($attributes['repeatAnimation'], FILTER_VALIDATE_BOOLEAN)  : $repeatAnimation = false;
        isset($attributes['animationType']) ? $animationType = filter_var($attributes['animationType'], FILTER_UNSAFE_RAW)  : $animationType = '';
        isset($attributes['galleryId']) ? $galleryId = filter_var($attributes['galleryId'], FILTER_UNSAFE_RAW)  : $galleryId = uniqid();
        isset($attributes['enableLightbox']) ? $enableLightbox = filter_var($attributes['enableLightbox'], FILTER_VALIDATE_BOOLEAN)  : $enableLightbox = false;
        isset($attributes['clickAction']) ? $clickAction = filter_var($attributes['clickAction'], FILTER_UNSAFE_RAW)  : $clickAction = '';
        isset($attributes['lightboxSingle']) ? $lightboxSingle = filter_var($attributes['lightboxSingle'], FILTER_VALIDATE_BOOLEAN)  : $lightboxSingle = false;
        isset($attributes['breakpoints']) ? $breakpoints = $attributes['breakpoints']  : $breakpoints = [];

        ob_start();

        if(!$images || !$breakpoints) {
            echo '<div class="fw-semibold">keine Galerie gefunden</div>';
            return ob_get_clean();
        }
        ?>
          <div class="row <?=$galleryType == 'masonry' ? 'builder-selector-grid builder-gallery' : ''?> row-cols-<?=$breakpoints['xs']['columns']?> g-<?=$breakpoints['xs']['gutter']?> row-cols-xxl-<?=$breakpoints['xxl']['columns']?> g-xxl-<?=$breakpoints['xxl']['gutter']?> row-cols-xl-<?=$breakpoints['xl']['columns']?> g-xl-<?=$breakpoints['xl']['gutter']?> row-cols-lg-<?=$breakpoints['lg']['columns']?> g-lg-<?=$breakpoints['lg']['gutter']?> row-cols-md-<?=$breakpoints['md']['columns']?> g-md-<?=$breakpoints['md']['gutter']?> row-cols-sm-<?=$breakpoints['sm']['columns']?> g-sm-<?=$breakpoints['sm']['gutter']?>">
            <?php foreach ($images as $image): ?>

            <?php endforeach; ?>
          </div>
        <?php
        return ob_get_clean();
    }
}