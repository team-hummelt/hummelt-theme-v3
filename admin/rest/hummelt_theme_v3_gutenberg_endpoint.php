<?php

namespace Hummelt\ThemeV3;
defined('ABSPATH') or die();
use Hummelt_Theme_V3;
use WP_HTTP_Response;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_Error;

class hummelt_theme_v3_gutenberg_endpoint extends WP_REST_Controller
{
    use hummelt_theme_v3_options;
    use hummelt_theme_v3_selects;

    protected WP_REST_Request $request;

    private object $responseJson;

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

    /**
     * Register the routes for the objects of the controller.
     */
    public function register_routes(): void
    {
        $namespace = 'theme-v3-gutenberg/v' . HUMMELT_THEME_V3_VERSION;
        $base = '/';


        @register_rest_route(
            $namespace,
            $base,
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_registered_items'),
                'permission_callback' => array($this, 'permissions_check')
            )
        );
        @register_rest_route(
            $namespace,
            $base . '(?P<settings>[\S^/]+)',
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'hummelt_theme_v3_get_api_rest_endpoint'),
                'permission_callback' => array($this, 'permissions_check')
            )
        );
    }

    public function get_registered_items(): WP_Error|WP_REST_Response|WP_HTTP_Response
    {
        $data = [];
        return rest_ensure_response($data);
    }

    public function hummelt_theme_v3_get_api_rest_endpoint(WP_REST_Request $request): WP_Error|WP_HTTP_Response|WP_REST_Response
    {
        // $response = new WP_REST_Response();
        $isNonce = wp_verify_nonce(
            $request->get_header('X-WP-Nonce'),
            'wp_rest'
        );

        if (!current_user_can('edit_posts') || !$isNonce) {
            return new WP_Error(
                'rest_permission_error',
                'Sorry Sie haben keine Berechtigung Theme-Einstellungen zu bearbeiten. (rest-' . __LINE__ . ')',
                array('status' => 403)
            );
        }
        $method = $request->get_param('method');
        if (!$method) {
            return new WP_Error('rest_update_failed', __('Method not found.'), array('status' => 404));
        }
        $this->responseJson = (object)['status' => false, 'msg' => gmdate('H:i:s', current_time('timestamp')), 'type' => $method];

        if (!method_exists($this, $method)) {
            return new WP_Error('rest_failed', __('API Method not found.'), array('status' => 404, 'msg' => gmdate('H:i:s', current_time('timestamp')), 'type' => $method));
        }

        $this->request = $request;
        $return = call_user_func_array(self::class . '::' . $method, []);
        return rest_ensure_response($return);
    }

    private function get_sidebar_items(): object
    {
        $selectItem = [
            'label' => 'auswählen',
            'id' => 0,
        ];

        $header = array_merge_recursive([$selectItem], apply_filters(HUMMELT_THEME_V3_SLUG . '/get_header', null));
        $footer = array_merge_recursive([$selectItem], apply_filters(HUMMELT_THEME_V3_SLUG . '/get_footer', null));
        $sidebar = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_sidebars', null);
        $this->responseJson->header = $header;
        $this->responseJson->footer = $footer;
        $this->responseJson->sidebar = $sidebar;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_leaflet_items(): object
    {
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $ds = $settings['google_maps_datenschutz'];
        $leaflet = $settings['leaflet'];
        $dsArr = [];
        foreach ($ds as $tmp) {
            $item = [
                'value' => $tmp['id'],
                'label' => $tmp['ds_bezeichnung']
            ];
            $dsArr[] = $item;
        }

        $blank = [
            'value' => '',
            'label' => 'auswählen'
        ];

        $leafletArr = [];
        foreach ($leaflet as $tmp) {
            $item = [
                'value' => $tmp['id'],
                'label' => $tmp['designation']
            ];
            $leafletArr[] = $item;
        }
        $leafletArr = array_merge_recursive([$blank], $leafletArr);
        $dsArr = array_merge_recursive([$blank], $dsArr);
        $this->responseJson->datenschutz_selects = $dsArr;
        $this->responseJson->leaflet_selects = $leafletArr;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_maps_items():object
    {
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $ds = $settings['google_maps_datenschutz'];

        $dsArr = [];
        foreach ($ds as $tmp) {
            $item = [
                'value' => $tmp['id'],
                'label' => $tmp['ds_bezeichnung']
            ];
            $dsArr[] = $item;
        }

        $blank = [
            'value' => '',
            'label' => 'auswählen'
        ];
        $dsArr = array_merge_recursive([$blank], $dsArr);
        $this->responseJson->datenschutz_selects = $dsArr;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_theme_slider():object
    {
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $slider = $settings['slider'];
        $sliderArr = [];
        foreach ($slider as $tmp) {
            $item = [
                'value' => $tmp['id'],
                'label' => $tmp['designation']
            ];
            $sliderArr[] = $item;
        }
        $blank = [
            'value' => '',
            'label' => 'auswählen'
        ];
        $sliderArr = array_merge_recursive([$blank], $sliderArr);
        $this->responseJson->slider = $sliderArr;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_theme_icons():object
    {
        $handle = filter_var($this->request->get_param('handle'), FILTER_UNSAFE_RAW);
        global $wp_filesystem;
        $dir = HUMMELT_THEME_V3_ADMIN_DIR .'Icons' . DIRECTORY_SEPARATOR;
        $fontArr = [];
        if($handle == 'bootstrap') {
            if($wp_filesystem->is_file($dir . 'bootstrap-icons.json')) {
                $fontFile = json_decode($wp_filesystem->get_contents($dir . 'bootstrap-icons.json'), true);
                foreach ($fontFile as $key => $val) {
                    $id = dechex($val);
                    $item = [
                        'id' => $id,
                        'icon' => 'bi bi-' . $key,
                        'title' => $id . '-' . $key,
                    ];
                    $fontArr[] = $item;
                }
            }
        }
        if($handle == 'material') {
            if($wp_filesystem->is_file($dir . 'material-design.json')) {
                $fontFile = json_decode($wp_filesystem->get_contents($dir . 'material-design.json'), true);
                $i=0;
                foreach ($fontFile as $tmp) {
                    $id = $tmp['hex'];
                    if ($i < 57) {
                        $name = '_' . $tmp['name'];
                    } else {
                        $name = $tmp['name'];
                    }
                    $item = [
                        'id' => $id,
                        'icon' => 'material-icons ' . $name,
                        'title' => $tmp['category'] . '-' . $id . '-' . $name,
                        'category' => $tmp['category']
                    ];
                    $fontArr[] = $item;
                    $i++;
                }
            }
        }
        if($handle == 'fa47') {
            if($wp_filesystem->is_file($dir . 'fa-icons.json')) {
                $fontFile = json_decode($wp_filesystem->get_contents($dir . 'fa-icons.json'), true);
                foreach ($fontFile as $tmp) {
                    $id = $tmp['code'];
                    $item = [
                        'id' => $id,
                        'icon' => $tmp['icon'],
                        'title' => $id . '-' . $tmp['icon'],
                    ];
                    $fontArr[] = $item;
                }
            }
        }
        $this->responseJson->icons = $fontArr;
        $this->responseJson->status = true;
        $this->responseJson->handle = $handle;
        return $this->responseJson;
    }


    private function get_theme_forms(): object
    {
        $args = 'ORDER BY designation ASC';
        $forms = apply_filters(HUMMELT_THEME_V3_SLUG.'/get_form_builder', $args, false);
        if(!$forms->status) {
            return new WP_Error('rest_update_failed', __('Forms not found.'), array('status' => 404));
        }

        $formArr = [];
        foreach ($forms->record as $tmp) {
          $item = [
              'value' => $tmp['id'],
              'label' => $tmp['designation']
          ];
            $formArr[] = $item;
        }
        $blank = [
            'value' => '',
            'label' => 'auswählen'
        ];
        $formArr = array_merge_recursive([$blank], $formArr);

        $this->responseJson->form_selects = $formArr;
        $this->responseJson->status = true;
        return $this->responseJson;
    }


    /**
     * Check if a given request has access.
     *
     * @return string
     */
    public function permissions_check(): string
    {
        return current_user_can('edit_posts');
    }
}