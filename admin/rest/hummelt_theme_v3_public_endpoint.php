<?php

namespace Hummelt\ThemeV3;

use Behat\Transliterator\Transliterator;
use Hummelt_Theme_V3;
use stdClass;
use WP_HTTP_Response;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_Error;

class hummelt_theme_v3_public_endpoint extends WP_REST_Controller
{
    use hummelt_theme_v3_options;
    use hummelt_theme_v3_selects;
    use hummelt_theme_v3_settings;

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
        $namespace = 'theme-v3-public/v' . HUMMELT_THEME_V3_VERSION;
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
                'methods' => 'POST',
                'callback' => array($this, 'hummelt_theme_v3_get_public_api_rest_endpoint'),
                'permission_callback' => array($this, 'permissions_check')
            )
        );
    }

    public function get_registered_items(): WP_Error|WP_REST_Response|WP_HTTP_Response
    {
        $data = [];
        return rest_ensure_response($data);
    }

    public function hummelt_theme_v3_get_public_api_rest_endpoint(WP_REST_Request $request): WP_Error|WP_HTTP_Response|WP_REST_Response
    {
        $isNonce = wp_verify_nonce(
            $request->get_header('X-WP-Nonce'),
            'wp_rest'
        );
        if (!$isNonce) {
            return new WP_Error('rest_update_failed', __('keine Berechtigung.'), array('status' => 401));
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

    private function get_leaflet_data(): object
    {
        $data = $this->request->get_param('data');

        if (!$data) {
            return $this->responseJson;
        }

        $data = json_decode($data, true);
        if (!$data['leaflet']) {
            return $this->responseJson;
        }
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $leaflet = $settings['leaflet'];
        $leafletData = [];
        foreach ($leaflet as $tmp) {
            if ($tmp['id'] == $data['leaflet']) {
                $leafletData = $tmp;
                break;
            }
        }
        if (!$leafletData) {
            return $this->responseJson;
        }
        $dsArr = [];
        if ($data['ds'] && $settings['google_maps_datenschutz']) {
            foreach ($settings['google_maps_datenschutz'] as $tmp) {
                if ($tmp['id'] == $data['ds']) {
                    $dsArr = $tmp;
                    break;
                }
            }
        }
        if ($dsArr) {
            $map_ds_page = site_url();
            if ($dsArr['map_ds_page']) {
                $map_ds_page = get_permalink($dsArr['map_ds_page']);
            }
            $dsArr['map_ds_text'] = str_replace('###LINK###', $map_ds_page, $dsArr['map_ds_text']);
            $dsArr['map_img_url'] = HUMMELT_THEME_V3_ADMIN_URL . 'assets/images/blind-karte.svg';
            if ($dsArr['map_img_id']) {
                $img = wp_get_attachment_image_src($dsArr['map_img_id'], 'large');
                $dsArr['map_img_url'] = $img[0];
            }
        }

        $layer = $this->osm_tile_layers($leafletData['tile_layer']);
        $item = [
            'tiles_url' => $layer['tiles_url'],
            'url_text' => $layer['url_text'],
            'url_anbieter' => $layer['url_anbieter']
        ];

        $record = [
            'id' => uniqid(),
            'attr' => $data,
            'ds' => $dsArr,
            'pins' => $leafletData['pins'],
            'layer' => $item
        ];

        $this->responseJson->record = $record;
        $this->responseJson->status = true;
        $this->responseJson->is_ds = (bool)$dsArr;
        return $this->responseJson;
    }

    private function get_iframe_data(): object
    {
        $data = $this->request->get_param('data');

        if (!$data) {
            return $this->responseJson;
        }

        $data = json_decode($data, true);
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $dsArr = [];
        if ($data['ds'] && $settings['google_maps_datenschutz']) {
            foreach ($settings['google_maps_datenschutz'] as $tmp) {
                if ($tmp['id'] == $data['ds']) {
                    $dsArr = $tmp;
                    break;
                }
            }
        }
        if ($dsArr) {
            $map_ds_page = site_url();
            if ($dsArr['map_ds_page']) {
                $map_ds_page = get_permalink($dsArr['map_ds_page']);
            }
            $dsArr['map_ds_text'] = str_replace('###LINK###', $map_ds_page, $dsArr['map_ds_text']);
            $dsArr['map_img_url'] = HUMMELT_THEME_V3_ADMIN_URL . 'assets/images/blind-karte.svg';
            if ($dsArr['map_img_id']) {
                $img = wp_get_attachment_image_src($dsArr['map_img_id'], 'large');
                $dsArr['map_img_url'] = $img[0];
            }
        }

        $record = [
            'id' => uniqid(),
            'attr' => $data,
            'ds' => $dsArr,
        ];

        $this->responseJson->record = $record;
        $this->responseJson->status = true;
        $this->responseJson->is_ds = (bool)$dsArr;
        return $this->responseJson;
    }

    private function get_gmaps_api_data(): object
    {
        $data = $this->request->get_param('data');

        if (!$data) {
            return $this->responseJson;
        }

        $data = json_decode($data, true);
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $gmApi = $settings['google_maps_api'];
        if (!$gmApi['map_apikey'] || strlen($gmApi['map_apikey']) < 13) {
            return $this->responseJson;
        }
        $map_apikey = base64_encode($gmApi['map_apikey']);
        if ($gmApi['map_color_schema_check'] && $gmApi['map_color_schema']) {
            $gmApi['map_color_schema'] = json_decode($gmApi['map_color_schema'], true);
        } else {
            $gmApi['map_color_schema'] = [];
        }
        if ($gmApi['map_standard_pin']) {
            $img = wp_get_attachment_image_src($gmApi['map_standard_pin'], 'full');
            $stdPin = $img[0];
        } else {
            $stdPin = HUMMELT_THEME_V3_ADMIN_URL . 'assets/images/map-pin.png';
        }

        $mapPinsArr = [];
        foreach ($gmApi['map_pins'] as $pins) {
            if ($pins['custom_pin_check'] && $pins['custom_pin_img']) {
                $img = wp_get_attachment_image_src($pins['custom_pin_img'], 'full');
                $pin = $img[0];
            } else {
                $pin = $stdPin;
            }
            $coords = str_replace(' ', '', $pins['coords']);
            $coords = explode(',', $coords);
            $item = [
                'lat' => (float)$coords[0],
                'lng' => (float)$coords[1],
                'pin_url' => $pin,
                'info_text' => $pins['info_text']
            ];
            $mapPinsArr[] = $item;

        }

        $dsArr = [];
        if ($data['ds'] && $settings['google_maps_datenschutz']) {
            foreach ($settings['google_maps_datenschutz'] as $tmp) {
                if ($tmp['id'] == $data['ds']) {
                    $dsArr = $tmp;
                    break;
                }
            }
        }
        if ($dsArr) {
            $map_ds_page = site_url();
            if ($dsArr['map_ds_page']) {
                $map_ds_page = get_permalink($dsArr['map_ds_page']);
            }
            $dsArr['map_ds_text'] = str_replace('###LINK###', $map_ds_page, $dsArr['map_ds_text']);
            $dsArr['map_img_url'] = HUMMELT_THEME_V3_ADMIN_URL . 'assets/images/blind-karte.svg';
            if ($dsArr['map_img_id']) {
                $img = wp_get_attachment_image_src($dsArr['map_img_id'], 'large');
                $dsArr['map_img_url'] = $img[0];
            }
        }

        $record = [
            'key' => $map_apikey,
            'pins' => $mapPinsArr,
            'attr' => $data,
            'ds' => $dsArr,
            'site_name' => get_bloginfo('name'),
            'color_schema' => $gmApi['map_color_schema']
        ];

        $this->responseJson->record = $record;
        $this->responseJson->isDs = ((bool)$dsArr);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_app_form_builder($bId = '', $p = ''): object
    {
        if ($bId) {
            $builder_id = $bId;
        } else {
            $builder_id = filter_var($this->request->get_param('builder_id'), FILTER_VALIDATE_INT);
        }
        if ($p) {
            $page = $p;
        } else {
            $page = filter_var($this->request->get_param('page'), FILTER_VALIDATE_INT);
        }


        if (!$data = $this->get_form($builder_id)) {
            $this->responseJson->msg = 'Ajax-Übertragungsfehler. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $pages = [];
        $conditions = [];
        $builder = [];
        foreach ($data['builder'] as $tmp) {
            $pages[] = $tmp['page'];
        }

        $builderArr = [];
        $pages = array_merge(array_unique(array_filter($pages)));

        foreach ($pages as $tmp) {
            $builderPage = [];
            foreach ($data['builder'] as $build) {
                if ($build['page'] == $tmp) {
                    $builderPage[] = $build;
                }
            }
            $builderArr[] = $builderPage;
        }
        $settings = $data['settings'];
        if ($settings['gutter'] == 'individuell') {
            $gutter = $settings['individuell'];
        } else {
            $gutter = $settings['gutter'];
        }
        $formSettings = [
            'col' => $settings['col'],
            'gutter' => $gutter
        ];

        $visibility = '';
        $deactivate = '';
        $conditionsArr = [];
        $conFields = [];

        foreach ($data['conditions'] as $tmp) {
            if ($tmp['type'] == 'show') {
                $visibility = false;
                $deactivate = false;
            }
            if ($tmp['type'] == 'hide') {
                $visibility = true;
                $deactivate = false;
            }
            if ($tmp['type'] == 'deactivate') {
                $visibility = true;
                $deactivate = false;
            }
            if ($tmp['type'] == 'activate') {
                $visibility = true;
                $deactivate = true;
            }
            $item = [
                'id' => $tmp['id'],
                'visibility' => $visibility,
                'deactivate' => $deactivate
            ];
            $conditionsArr[] = $item;
            foreach ($tmp['group'] as $group) {
                foreach ($group['rules'] as $rule) {
                    $conFields[] = $rule['field'];
                }
            }
        }

        $pages = array_merge(array_unique(array_filter($pages)));
        $conFields = array_merge(array_unique(array_filter($conFields)));
        unset($data['send_email']);

        $data['builder'] = $builder;
        if ($bId && $p) {
            $this->responseJson->record = $builderArr;
            return $this->responseJson;
        }

        $this->responseJson->status = true;
        $this->responseJson->form_id = $data['id'];
        $this->responseJson->page = $page;
        $this->responseJson->pages = $pages;
        $this->responseJson->record = $builderArr;
        $this->responseJson->form_settings = $formSettings;
        $this->responseJson->conditions = $conditionsArr;
        $this->responseJson->con_fields = $conFields;
        $this->responseJson->error_messages = $data['message']['email_sent'][2]['value'];
        $this->responseJson->random = uniqid();
        return $this->responseJson;
    }

    private function check_form_condition(): object
    {
        $builder_id = filter_var($this->request->get_param('builder_id'), FILTER_VALIDATE_INT);
        $formsId = filter_var($this->request->get_param('form'), FILTER_UNSAFE_RAW);
        $data = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        $value = filter_var($this->request->get_param('value'), FILTER_UNSAFE_RAW);

        if (!$builder_id || !$formsId || !$data) {
            $this->responseJson->msg = __LINE__;
            return $this->responseJson;
        }
        if (!$formData = $this->get_form($builder_id)) {
            $this->responseJson->msg = 'Ajax-Übertragungsfehler. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        $ruleArr = [];
        $conId = '';
        $conType = '';

        foreach ($formData['conditions'] as $tmp) {
            foreach ($tmp['group'] as $group) {
                foreach ($group['rules'] as $rule) {
                    $conField = $rule['field'];
                    if ($rule['value'] == $value) {
                        $ruleArr = $tmp['group'];
                        $conId = $tmp['id'];
                        $conType = $tmp['type'];
                    } else {
                        if ($rule['field'] == $formsId) {
                            $ruleArr = $tmp['group'];
                            $conId = $tmp['id'];
                            $conType = $tmp['type'];
                        }
                    }
                }
            }
        }
        $ra = [];
        if (!$ruleArr) {
            $this->responseJson->status = false;
            $this->responseJson->condition = $conId;
            $this->responseJson->con_type = $conType;

            return $this->responseJson;
        }
        foreach ($ruleArr as $tmp) {
            $ri = [];
            foreach ($tmp['rules'] as $rule) {
                $ruleItem = [
                    'compare' => $rule['compare'],
                    'if_option' => $rule['is_select'],
                    'field' => $rule['field'],
                    'value' => $rule['value']
                ];
                $ri[] = $ruleItem;
            }
            $item = [
                'rules' => $ri
            ];
            $ra[] = $item;
        }
        if (!$ra) {
            $this->responseJson->msg = __LINE__;

            return $this->responseJson;
        }
        $rule_false = 0;
        $r = 0;
        foreach ($ra as $tmp) {
            foreach ($tmp['rules'] as $rule) {

                $check = $this->get_rule_data_condition($data, $conType, $rule['field'], $rule['value'], $rule['compare']);
                if (!$check) {
                    $rule_false++;
                }
            }
            if ($rule_false == 0) {

                $this->responseJson->status = true;
                $this->responseJson->condition = $conId;
                $this->responseJson->con_type = $conType;

                return $this->responseJson;
            }

            if ($r > 0) {
                $rule_false = 0;
                foreach ($tmp['rules'] as $rule) {
                    $check = $this->get_rule_data_condition($data, $conType, $rule['field'], $rule['value'], $rule['compare']);
                    if (!$check) {
                        $rule_false++;
                    }
                }
            }
            $r++;
        }
        if ($rule_false == 0) {
            $this->responseJson->status = true;
            $this->responseJson->condition = $conId;
            $this->responseJson->con_type = $conType;

            return $this->responseJson;
        }

        $this->responseJson->condition = $conId;
        $this->responseJson->con_type = $conType;
        $this->responseJson->status = false;
        return $this->responseJson;
    }

    private function formular_builder_send(): object
    {
        $builder = filter_var($this->request->get_param('builder'), FILTER_UNSAFE_RAW);
        $data = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        $email = filter_var($this->request->get_param('email'), FILTER_UNSAFE_RAW);
        $name = filter_var($this->request->get_param('name'), FILTER_UNSAFE_RAW);
        $terms = filter_var($this->request->get_param('terms'), FILTER_UNSAFE_RAW);

        if (!$builder || !$data) {
            return $this->responseJson;
        }
        $data = json_decode($data, true);
        if (!$builderData = $this->get_form($builder)) {
            $this->responseJson->msg = 'Ajax-Übertragungsfehler. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $settings = $builderData['settings'];


        global $themeV3Helper;
        $formName = $builderData['name'];
        $message = $builderData['message']['email_sent'];
        $sendEmail = $builderData['send_email'];
        $emailTxt = html_entity_decode($sendEmail['email']['message']);
        $emailResponder = html_entity_decode($sendEmail['responder']['message']);
        $emailTxt = $themeV3Helper->fn_compress_string($emailTxt);
        $emailResponder = $themeV3Helper->fn_compress_string($emailResponder);

        if ($email || $name || $terms) {
            foreach ($message as $tmp) {
                if ($tmp['id'] == 4) {
                    $this->responseJson->error = 4;
                    $this->responseJson->msg = $tmp['value'];
                    break;
                }
            }
            return $this->responseJson;
        }

        $formData = [];
        foreach ($data as $tmp) {
            if ($tmp['form']['type'] == 'button' || $tmp['form']['type'] == 'html' || $tmp['form']['type'] == 'hr' || $tmp['form']['type'] == 'placeholder') {
                continue;
            }
            $formData[] = $tmp;
        }
        $appEmail = get_option(HUMMELT_THEME_V3_SLUG . '/smtp_settings');
        $errorLabel = [];
        $sendData = [];
        $summaryData = [];
        $summary = '';
        $sendEmailTo = '';
        $anhangData = [];
        $responderEmail = '';


        foreach ($formData as $tmp) {
            $form = $tmp['form'];
            $validate = $this->get_validate_form_field($builderData, $tmp['grid'], $form, $form['type']);
            if (!$validate->status) {
                $errorLabel[] = $validate->label;
            } else {
                if ($form['type'] == 'select' || $form['type'] == 'radio') {
                    foreach ($form['options'] as $option) {
                        if ($form['config']['selected'] == $option['id']) {
                            $form['config']['default'] = $option['value'];

                            if ($form['type'] == 'select') {
                                $sendEmailTo = $form['config']['default'];
                            }
                            $item = [
                                'label' => $form['label'],
                                'slug' => $form['slug'],
                                'type' => $form['type'],
                                'value' => $form['config']['default'],
                            ];
                            $emailTxt = str_replace('{' . $form['slug'] . '}', $form['config']['default'], $emailTxt);
                            $emailResponder = str_replace('{' . $form['slug'] . '}', $form['config']['default'], $emailResponder);
                            $summary .= '<div><strong>' . $form['label'] . ': </strong>' . $form['config']['default'] . '</div>';
                            $sendData[] = $item;
                        }
                    }
                }
                if ($form['type'] == 'checkbox') {
                    $items = [];

                    foreach ($form['options'] as $option) {
                        if ($option['checked']) {
                            $items[] = [
                                'label' => $option['label'],
                                'value' => $option['value']
                            ];
                        }
                    }
                    $liTxt = '';
                    $summary .= '<div><strong>' . $form['label'] . '</strong></div>';
                    $summary .= '<ul>';
                    if ($items) {
                        foreach ($items as $it) {
                            $summary .= '<li>' . $it['label'] . ' <small>(' . $it['value'] . ')</small></li>';
                            $liTxt .= '<li>' . $it['label'] . ' <small>(' . $it['value'] . ')</small></li>';
                        }
                    }
                    $txt = '<ul>' . $liTxt . '</ul>';
                    $emailTxt = str_replace('{' . $form['slug'] . '}', $txt, $emailTxt);
                    $emailResponder = str_replace('{' . $form['slug'] . '}', $txt, $emailResponder);
                    $summary .= '</ul>';
                    $item = [
                        'label' => $form['label'],
                        'slug' => $form['slug'],
                        'type' => $form['type'],
                        'value' => $items
                    ];
                    $sendData[] = $item;
                }

                if ($form['type'] == 'switch') {
                    $items = [];
                    foreach ($form['options'] as $option) {
                        if ($option['default']) {
                            $items[] = [
                                'label' => $option['label'],
                                'value' => $option['value']
                            ];
                        }
                    }
                    $liTxt = '';
                    $summary .= '<div><strong>' . $form['label'] . '</strong></div>';
                    $summary .= '<ul>';
                    if ($items) {
                        foreach ($items as $it) {
                            $summary .= '<li>' . $it['label'] . ' <small>(' . $it['value'] . ')</small></li>';
                            $liTxt .= '<li>' . $it['label'] . ' <small>(' . $it['value'] . ')</small></li>';
                        }
                    }
                    $txt = '<ul>' . $liTxt . '</ul>';
                    $emailTxt = str_replace('{' . $form['slug'] . '}', $txt, $emailTxt);
                    $emailResponder = str_replace('{' . $form['slug'] . '}', $txt, $emailResponder);
                    $summary .= '</ul>';
                    $item = [
                        'label' => $form['label'],
                        'slug' => $form['slug'],
                        'type' => $form['type'],
                        'value' => $items
                    ];
                    $sendData[] = $item;
                }

                if ($form['type'] == 'upload') {
                    $item = [
                        'label' => $form['label'],
                        'slug' => $form['slug'],
                        'type' => $form['type'],
                        'value' => $form['config']['default']['files']
                    ];
                    $anhangData = $form['config']['default']['files'];
                    $sendData[] = $item;
                }

                if ($form['type'] == 'text' ||
                    $form['type'] == 'textarea' ||
                    $form['type'] == 'number' ||
                    $form['type'] == 'phone' ||
                    $form['type'] == 'password' ||
                    $form['type'] == 'tinymce' ||
                    $form['type'] == 'date' ||
                    $form['type'] == 'color' ||
                    $form['type'] == 'range' ||
                    $form['type'] == 'rating' ||
                    $form['type'] == 'email' ||
                    $form['type'] == 'url' ||
                    $form['type'] == 'privacy-check'
                ) {
                    if ($form['type'] == 'email') {
                        if ($validate->is_autoresponder) {
                            $responderEmail = filter_var($form['config']['default'], FILTER_VALIDATE_EMAIL);
                        }
                    }
                    if ($form['type'] == 'tinymce') {
                        if ($validate->sanitize == 'restriktiv') {
                            $form['config']['default'] = strip_tags($form['config']['default']);
                        }
                        if ($validate->sanitize == 'permissiv') {
                            $form['config']['default'] = $this->better_strip_tags(html_entity_decode($form['config']['default']), '<span><ul><li><ol><p><br><b><strong><h1><h2><h3><h4><h5><h6>');
                            $form['config']['default'] = $themeV3Helper->fn_compress_string($form['config']['default']);
                        }
                    } else {
                        $form['config']['default'] = $themeV3Helper->pregWhitespace(htmlentities($form['config']['default']));
                    }
                    if ($form['type'] == 'privacy-check') {
                        if ($form['config']['selected']) {
                            $form['config']['default'] = 'Datenschutz akzeptiert';
                        } else {
                            $form['config']['default'] = 'Datenschutz nicht akzeptiert';
                        }
                    }
                    $item = [
                        'label' => $form['label'],
                        'slug' => $form['slug'],
                        'type' => $form['type'],
                        'value' => $form['config']['default']
                    ];
                    $summary .= '<strong>';
                    $summary .= $item['label'];
                    $summary .= ': </strong>';
                    $summary .= $item['value'] . '<br/>';
                    $emailTxt = str_replace('{' . $form['slug'] . '}', $item['value'], $emailTxt);
                    $emailResponder = str_replace('{' . $form['slug'] . '}', $item['value'], $emailResponder);
                    $sendData[] = $item;
                }
            }
        }
        $emailTxt = str_replace('{summary}', $summary, $emailTxt);
        $emailResponder = str_replace('{summary}', $summary, $emailResponder);

        $emailTxt = $themeV3Helper->fn_compress_string($emailTxt);
        $emailResponder = $themeV3Helper->fn_compress_string($emailResponder);

        if ($errorLabel) {
            foreach ($message as $m) {
                if ($m['id'] == 3) {
                    $this->responseJson->error = 3;
                    $this->responseJson->msg = $m['value'];
                }
                if ($m['id'] == 6) {
                    $this->responseJson->error = 6;
                    $this->responseJson->error_headline = $m['value'];
                }
            }
            $this->responseJson->error_label = implode(', ', $errorLabel);
            return $this->responseJson;
        }
        $attach = [];
        $attachDir = '';
        if ($anhangData) {
            global $wp_filesystem;
            foreach ($anhangData as $tmp) {
                if ($wp_filesystem->is_file(HUMMELT_THEME_V3_DOWNLOAD_DIR . $tmp['file'])) {
                    $file_extension = strtolower(pathinfo($tmp['file'], PATHINFO_EXTENSION));
                    $key = $tmp['file_name'] . '.' . $file_extension;
                    $attach[$key] = HUMMELT_THEME_V3_DOWNLOAD_DIR . $tmp['file'];
                }
            }
        }
        if (!$sendEmail['subject']) {
            $sendEmail['subject'] = get_bloginfo('name');
        }
        $sendEmail['email']['cc'] ? $cc = $sendEmail['email']['cc'] : $cc = [];
        $sendEmail['email']['bcc'] ? $bcc = $sendEmail['email']['bcc'] : $bcc = [];
        if ($cc) {
            $cc = $themeV3Helper->trim_string($cc);
            $cc = str_replace([',', ';'], '#', $cc);
            $cc = explode('#', $cc);
            $cc = array_merge(array_unique(array_filter($cc)));
        }
        if ($bcc) {
            $bcc = $themeV3Helper->trim_string($bcc);
            $bcc = str_replace([',', ';'], '#', $bcc);
            $bcc = explode('#', $bcc);
            $bcc = array_merge(array_unique(array_filter($bcc)));
        }
        if ($sendEmailTo && filter_var($sendEmailTo, FILTER_VALIDATE_EMAIL)) {
            $to = $sendEmailTo;
        } else {
            $to = $sendEmail['email']['recipient'];
        }

        $re = '/{.+?}/m';
        preg_match_all($re, $emailTxt, $matches);
        if ($matches) {
            foreach ($matches as $tmp) {
                $emailTxt = str_replace($tmp, '', $emailTxt);
            }
        }
        preg_match_all($re, $emailResponder, $matches);
        if ($matches) {
            foreach ($matches as $tmp) {
                $emailResponder = str_replace($tmp, '', $emailResponder);
            }
        }


        $ccEmailToDb = [];
        $bCcEmailToDb = [];
        $headers = [];
        if ($cc) {
            foreach ($cc as $tmp) {
                if (filter_var($tmp, FILTER_VALIDATE_EMAIL)) {
                    $headers[] = 'Cc: ' . $tmp . ' <' . $tmp . '>';
                    $ccEmailToDb[] = $tmp;
                }
            }
        }
        if ($bcc) {
            foreach ($bcc as $tmp) {
                if (filter_var($tmp, FILTER_VALIDATE_EMAIL)) {
                    $headers[] = 'Bcc: ' . $tmp . ' <' . $tmp . '>';
                    $bCcEmailToDb[] = $tmp;
                }
            }
        }

        if (!$appEmail['abs_name']) {
            $appEmail['abs_name'] = get_bloginfo('name');
        }
        if (!$appEmail['abs_email']) {
            $appEmail['abs_email'] = get_option('admin_email');
        }
        if ($appEmail['reply_to']) {
            $headers[] = 'Reply-To: ' . $appEmail['abs_name'] . ' <' . $appEmail['reply_to'] . '>';
        }
        $headers[] = 'From: ' . $appEmail['abs_name'] . '  <' . $appEmail['abs_email'] . '>';



        $send = wp_mail($to, $sendEmail['subject'], $emailTxt, array_unique($headers), $attach);
        if ($send) {
            $this->responseJson->msg = $message[0]['value'];
            $this->responseJson->status = true;
        } else {
            $this->responseJson->msg = $message[1]['value'];
        }

        $this->responseJson->redirect = false;
        if($settings['redirection_active']) {
            if($settings['page_id']) {
                $url = get_permalink($settings['page_id']);
            } else {
                if(filter_var($settings['url'], FILTER_VALIDATE_URL)) {
                    $url = $settings['url'];
                } else {
                    $url = '';
                }
            }
            if($url){
                $this->responseJson->redirect = true;
                $this->responseJson->redirect_url = $url;
               //delete_option(HUMMELT_THEME_V3_SLUG . '/form_redirect');

                if($settings['js_data_active']) {
                    $form_redirect = get_option(HUMMELT_THEME_V3_SLUG . '/form_redirect');
                    if(!$form_redirect) {
                        update_option(HUMMELT_THEME_V3_SLUG . '/form_redirect', []);
                        $form_redirect = [];
                    }
                    $redirectData = [];
                    foreach ($sendData as $d) {
                        $redirectData[$d['slug']] = $d['value'];
                    }
                   $redirect[$builderData['id']] = $redirectData;
                    $form_redirect = array_merge($form_redirect, $redirect);
                    update_option(HUMMELT_THEME_V3_SLUG . '/form_redirect', $form_redirect);
                }
            }
        }

        if($sendEmail['responder']['active'] && $responderEmail) {
            $headersResponder = [];
            if ($appEmail['reply_to']) {
                $headersResponder[] = 'Reply-To: '.$appEmail['abs_name'].' <'.$appEmail['reply_to'].'>';
            }
            $headersResponder[] = 'From: ' . $appEmail['abs_name'] . '  <' . $appEmail['abs_email'] . '>';
            wp_mail($responderEmail, $sendEmail['responder']['subject'], $emailResponder, $headersResponder);
        }

        if ($appEmail['email_save_active']) {
            $ccb = [
                'cc' => $ccEmailToDb,
                'bcc' => $bCcEmailToDb
            ];
            $addDb = [
                'form_id' => $builder,
                'subject' => $sendEmail['subject'],
                'abs_ip' => $_SERVER['REMOTE_ADDR'],
                'send_data' => json_encode($sendData),
                'cc_bcc' => json_encode($ccb),
                'message' => htmlentities($emailTxt)
            ];
            $insert = apply_filters(HUMMELT_THEME_V3_SLUG.'/set_form_email', $addDb);
            $this->responseJson->insert = $insert->status;
        }

        return $this->responseJson;
    }

    private function delete_upload_file(): object
    {
        $file_id = filter_var($this->request->get_param('file_id'), FILTER_UNSAFE_RAW);
        $fileData = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        global $wp_filesystem;
        if ($fileData) {
            $fileData = json_decode($fileData, true);
            if (isset($fileData['files']) && $fileData['files']) {
                foreach ($fileData['files'] as $tmp) {
                    if ($file_id == $tmp['id']) {
                        if ($wp_filesystem->is_file(HUMMELT_THEME_V3_DOWNLOAD_DIR . $tmp['file'])) {
                            $wp_filesystem->delete(HUMMELT_THEME_V3_DOWNLOAD_DIR . $tmp['file']);
                            $this->responseJson->status = true;
                            return $this->responseJson;
                        }
                    }
                }
            }
        }

        return $this->responseJson;
    }

    private function get_form($id): array
    {
        if (!$id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return [];
        }
        $args = sprintf('WHERE id=%d', $id);
        $getForm = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_form_builder', $args);
        if (!$getForm->status) {
            return [];
        }
        return $getForm->record['form'];
    }

    private function get_form_by_form_id($form_id): array
    {
        if (!$form_id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return [];
        }
        $args = sprintf('WHERE form_id="%s"', $form_id);
        $getForm = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_form_builder', $args);
        if (!$getForm->status) {
            return [];
        }
        return $getForm->record['form'];
    }

    private function get_rule_data_condition($data, $type, $field, $value, $compare)
    {
        foreach ($data as $tmp) {
            $form = $tmp['form'];
            if ($form['id'] == $field) {

                if ($form['type'] == 'switch' || $form['type'] == 'checkbox') {
                    foreach ($form['options'] as $option) {
                        if ($option['id'] == $value) {
                            if ($form['type'] == 'checkbox') {
                                switch ($compare) {
                                    case 'is':
                                    case 'isnot':
                                        return $option['checked'];
                                    case 'greater':
                                        return $option['default'] > $value;
                                    case 'smaller':
                                        return $option['default'] < $value;
                                    case 'contains':
                                        if (preg_match("~$value~", $option['default'])) {
                                            return true;
                                        }
                                        break;
                                    default :
                                        return false;
                                }
                            }
                            if ($option['default']) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                }

                switch ($compare) {
                    case 'is':
                        if ($form['type'] == 'select' || $form['type'] == 'radio' || $form['type'] == 'privacy-check') {
                            return $form['config']['selected'] == $value;
                        }

                        return $form['config']['default'] == $value;
                    case 'isnot':
                        if ($form['type'] == 'select' || $form['type'] == 'radio') {
                            return $form['config']['selected'] != $value;
                        }

                        return $form['config']['default'] != $value;
                    case 'greater':
                        if ($form['type'] == 'select' || $form['type'] == 'radio') {
                            return $form['config']['selected'] > $value;
                        }

                        return (int)$form['config']['default'] > (int)$value;
                    case 'smaller':
                        if ($form['type'] == 'select' || $form['type'] == 'radio') {
                            return $form['config']['selected'] < $value;
                        }

                        return (int)$form['config']['default'] < (int)$value;
                    case 'contains':
                        if ($form['type'] == 'select' || $form['type'] == 'radio') {
                            if (preg_match("~$value~", $form['config']['selected'])) {
                                return true;
                            }
                        }
                        if (preg_match("~$value~", $form['config']['default'])) {
                            return true;
                        }

                        return false;
                }
            }
        }
        return false;
    }

    private function get_validate_form_field($builderForm, $gridId, $dataForm, $type = null): object
    {

        $return = new stdClass();
        $return->status = false;
        $return->label = '';

        foreach ($builderForm['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                if ($grid['id'] == $gridId) {
                    foreach ($grid['forms'] as $form) {
                        if ($form['id'] == $dataForm['id']) {
                            if ($type == 'checkbox') {
                                foreach ($form['options'] as $option) {
                                    if ($option['required']) {
                                        foreach ($dataForm['options'] as $dataOptions) {
                                            if ($dataOptions['id'] == $option['id'] && !$dataOptions['checked']) {
                                                $return->label = $form['label'];
                                                return $return;
                                            }
                                        }
                                    } else {
                                        $return->status = true;
                                        return $return;
                                    }
                                }
                            }
                            if ($type == 'select') {
                                $return->send_email = $form['config']['send_email'];
                                if ($form['required']) {
                                    if ($dataForm['config']['selected']) {

                                        $return->status = true;
                                    } else {
                                        $return->label = $form['label'];
                                    }
                                    return $return;
                                }
                                $return->status = true;
                                return $return;
                            }

                            if ($type == 'radio') {
                                foreach ($dataForm['options'] as $dataOptions) {
                                    if ($dataOptions['checked']) {
                                        $return->status = true;
                                        return $return;
                                    }
                                }
                                $return->label = $form['label'];
                                return $return;
                            }

                            if ($type == 'text' ||
                                $type == 'textarea' ||
                                $type == 'number' ||
                                $type == 'phone' ||
                                $type == 'password' ||
                                $type == 'tinymce' ||
                                $type == 'date' ||
                                $type == 'color' ||
                                $type == 'range' ||
                                $type == 'rating'
                            ) {
                                if ($type == 'tinymce') {
                                    $return->sanitize = $form['config']['sanitize'];
                                }
                                if ($form['required'] && !$dataForm['config']['default']) {
                                    $return->label = $form['label'];
                                } else {
                                    $return->status = true;
                                }

                                return $return;
                            }
                            if ($type == 'url') {
                                if ($form['required'] && !$dataForm['config']['default']) {
                                    $return->label = $form['label'];
                                    return $return;
                                }
                                if ($dataForm['config']['default']) {
                                    $status = filter_var($dataForm['config']['default'], FILTER_VALIDATE_URL);
                                    if ($status) {
                                        $return->status = true;
                                    } else {
                                        $return->label = $form['label'];
                                    }
                                    return $return;
                                }
                                $return->status = true;
                                return $return;
                            }
                            if ($type == 'email') {
                                $return->is_autoresponder = $form['is_autoresponder'] ?? false;
                                if ($form['required'] && !$dataForm['config']['default']) {
                                    $return->label = $form['label'];
                                    return $return;
                                }
                                if ($dataForm['config']['default']) {
                                    $status = filter_var($dataForm['config']['default'], FILTER_VALIDATE_EMAIL);
                                    if ($status) {
                                        $return->status = true;
                                    } else {
                                        $return->label = $form['label'];
                                    }

                                    return $return;
                                }


                                $return->status = true;
                                return $return;
                            }
                            if ($type == 'button' || $type == 'switch') {
                                $return->status = true;
                                return $return;
                            }
                            if ($type == 'upload') {
                                if ($form['required']) {
                                    $default = $dataForm['config']['default'];
                                    $files = $default['files'] ?? null;
                                    if (!$files) {
                                        $return->label = $form['label'];
                                        return $return;
                                    }
                                    if (!count($files)) {
                                        $return->label = $form['label'];
                                        return $return;
                                    }
                                }
                                $return->status = true;
                                return $return;
                            }
                            if ($type == 'privacy-check') {
                                if (!$dataForm['config']['selected']) {
                                    $return->label = $form['label'];
                                    return $return;
                                }
                                $return->status = true;
                                return $return;
                            }
                        }
                    }
                }
            }
        }

        return $return;
    }

    private function better_strip_tags($str, $allowable_tags = '', $strip_attrs = false, $preserve_comments = false, callable $callback = null): string
    {
        $closing = '';
        $allowable_tags = array_map('strtolower', array_filter( // lowercase
            preg_split('/(?:>|^)\\s*(?:<|$)/', $allowable_tags, -1, PREG_SPLIT_NO_EMPTY), // get tag names
            function ($tag) {
                return preg_match('/^[a-z][a-z0-9_]*$/i', $tag);
            } // filter broken
        ));
        $tag = '';
        $comments_and_stuff = preg_split('/(<!--.*?(?:-->|$))/', $str, -1, PREG_SPLIT_DELIM_CAPTURE);
        foreach ($comments_and_stuff as $i => $comment_or_stuff) {
            if ($i % 2) { // html comment
                if (!($preserve_comments && preg_match('/<!--.*?-->/', $comment_or_stuff))) {
                    $comments_and_stuff[$i] = '';
                }
            } else { // stuff between comments
                $tags_and_text = preg_split("/(<(?:[^>\"']++|\"[^\"]*+(?:\"|$)|'[^']*+(?:'|$))*(?:>|$))/", $comment_or_stuff, -1, PREG_SPLIT_DELIM_CAPTURE);
                foreach ($tags_and_text as $j => $tag_or_text) {
                    $is_broken = false;
                    $is_allowable = true;
                    $result = $tag_or_text;
                    if ($j % 2) { // tag
                        if (preg_match("%^(</?)([a-z][a-z0-9_]*)\\b(?:[^>\"'/]++|/+?|\"[^\"]*\"|'[^']*')*?(/?>)%i", $tag_or_text, $matches)) {
                            $tag = strtolower($matches[2]);
                            if (in_array($tag, $allowable_tags)) {
                                if ($strip_attrs) {
                                    $opening = $matches[1];
                                    $closing = ($opening === '</') ? '>' : $closing;
                                    $result = $opening . $tag . $closing;
                                }
                            } else {
                                $is_allowable = false;
                                $result = '';
                            }
                        } else {
                            $is_broken = true;
                            $result = '';
                        }
                    } else { // text
                        $tag = false;
                    }
                    if (!$is_broken && isset($callback)) {
                        // allow result modification
                        call_user_func_array($callback, array(&$result, $tag_or_text, $tag, $is_allowable));
                    }
                    $tags_and_text[$j] = $result;
                }
                $comments_and_stuff[$i] = implode('', $tags_and_text);
            }
        }
        return implode('', $comments_and_stuff);
    }


    /**
     * Check if a given request has access.
     *
     * @return string
     */
    public function permissions_check(): string
    {
        return '__return_true';
    }

}