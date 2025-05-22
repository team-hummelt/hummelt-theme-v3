<?php

namespace Hummelt\ThemeV3;

use Hummelt_Theme_V3;
use Behat\Transliterator\Transliterator;
use WP_HTTP_Response;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_Error;

class hummelt_theme_v3_form_builder_endpoint extends WP_REST_Controller
{
    use hummelt_theme_v3_options;
    use hummelt_theme_v3_selects;
    use hummelt_theme_v3_form_settings;

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
        $namespace = 'theme-v3-forms/v' . HUMMELT_THEME_V3_VERSION;
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
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $capabilities = $settings['theme_capabilities'];
        if (!$isNonce || !$capabilities['formulare']) {
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


    private function form_handle(): object
    {
        $designation = filter_var($this->request->get_param('designation'), FILTER_UNSAFE_RAW);
        $handle = filter_var($this->request->get_param('handle'), FILTER_UNSAFE_RAW);
        $id = filter_var($this->request->get_param('id'), FILTER_VALIDATE_INT);

        $this->responseJson->handle = $handle ?? '';
        if (!$designation) {
            $designation = 'Formular-' . uniqid();
        }
        if ($id) {
            if ($handle == 'designation') {
                apply_filters(HUMMELT_THEME_V3_SLUG . '/update_designation', $designation, $id);

                $this->responseJson->designation = $designation;
            }

            $this->responseJson->status = true;
            $this->responseJson->id = $id;
        } else {
            $defSubject = sprintf('Nachricht von %s', get_bloginfo('name'));
            $url = '<a target="_blank" href="' . site_url() . '">' . get_bloginfo('name') . '</a>';
            $defMsg = sprintf('Diese Nachricht wurde vom %s-Kontaktformular gesendet.', $url);
            $fbId = 'FB' . uniqid();
            $form = [
                '0' => [
                    'id' => uniqid(),
                    'page' => 1,
                    'grid' => [
                        '0' => [
                            'id' => uniqid(),
                            'col' => 12,
                            'css' => '',
                            'forms' => []
                        ]
                    ]
                ]
            ];
            $settings = [
                'col' => 'lg',
                'gutter' => 'g-3',
                'individuell' => '',
                'redirection_active' => false,
                'js_data_active' => false,
                'page_id' => '',
                'url' => ''
            ];

            $sendMail = [
                'email' => [
                    'recipient' => get_option('admin_email'),
                    'subject' => $defSubject,
                    'cc' => '',
                    'bcc' => '',
                    'message' => $defMsg,
                    'header' => []
                ],
                'responder' => [
                    'subject' => $defSubject,
                    'active' => false,
                    'message' => $defMsg
                ],
            ];

            $builderForm = [
                'id' => $fbId,
                'bu_version' => $this->version,
                'app_version' => HUMMELT_THEME_V3_VERSION,
                'name' => $designation,
                'builder' => $form,
                'type' => 'builder',
                'send_email' => $sendMail,
                'settings' => $settings,
                'message' => [
                    'email_sent' => [
                        '0' => [
                            'id' => 1,
                            'label' => 'Die Nachricht des Absenders wurde erfolgreich gesendet',
                            'value' => 'Die Nachricht wurde erfolgreich gesendet.',
                        ],
                        '1' => [
                            'id' => 2,
                            'label' => 'Die Nachricht des Absenders konnte nicht gesendet werden',
                            'value' => 'Beim Versuch, Ihre Nachricht zu senden, ist ein Fehler aufgetreten.',
                        ],
                        '2' => [
                            'id' => 3,
                            'label' => 'Fehler beim Ausfüllen des Formulars',
                            'value' => 'Ein oder mehrere Felder haben einen Fehler. Bitte überprüfen Sie es und versuchen Sie es erneut.',
                        ],
                        '3' => [
                            'id' => 4,
                            'label' => 'Eingabe wurde als Spam erkannt',
                            'value' => 'Beim Versuch, Ihre Nachricht zu senden, ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal.',
                        ],
                        '4' => [
                            'id' => 5,
                            'label' => 'Das Formular wird gesendet',
                            'value' => 'Das Formular wird gesendet',
                        ],
                        '5' => [
                            'id' => 6,
                            'label' => 'Überschrift Fehlermeldung',
                            'value' => 'Das Formular konnte nicht gesendet werden!',
                        ],
                    ]
                ],
                'conditions' => []
            ];

            $record = [
                'designation' => $designation,
                'form_id' => $fbId,
                'form' => $builderForm
            ];
            $insert = apply_filters(HUMMELT_THEME_V3_SLUG . '/set_form_builder', $record);
            if ($insert->status) {
                $this->responseJson->status = true;
                $this->responseJson->msg = 'Das Formular wurde erfolgreich erstellt';
            }
        }
        return $this->responseJson;
    }

    private function get_form_email(): object
    {
        $id = filter_var($this->request->get_param('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $args = sprintf('WHERE id=%d', $id);
        $getEmail = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_form_email', $args);
        if (!$getEmail->status) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $getEmail = $getEmail->record;
        $send_data = json_decode($getEmail['send_data'], true);
        $cc_bcc = json_decode($getEmail['cc_bcc'], true);
        $message = html_entity_decode($getEmail['message']);

        $uploads = [];
        foreach ($send_data as $tmp) {
            if ($tmp['type'] == 'upload') {
                if ($tmp['value']) {
                    $uploads = $tmp['value'];
                }
                break;
            }
        }

        $args = sprintf('WHERE id=%d', $getEmail['form_id']);
        $form = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_form_builder', $args);
        $formular = 'unbekannt';
        $to = 'unbekannt';
        if ($form->status) {
            $form = $form->record;
            $formular = $form['designation'];
            $send_email = $form['form']['send_email']['email'];
            $to = $send_email['recipient'];
        }
        $record = [
            'subject' => $getEmail['subject'],
            'form' => $formular,
            'to' => $to,
            'ip' => $getEmail['abs_ip'],
            'created_at' => date('d.m.Y H:i:s', strtotime($getEmail['created_at'])),
            'uploads' => $uploads,
            'cc' => implode(', ', $cc_bcc['cc']),
            'bcc' => implode(', ', $cc_bcc['bcc']),
            'message' => $message
        ];
        $this->responseJson->record = $record;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_form_email(): object
    {
        $id = filter_var($this->request->get_param('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        global $wp_filesystem;
        $args = sprintf('WHERE id=%d', $id);
        $email = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_form_email', $args);
        if ($email->status) {
            $email = $email->record;
            $send_data = json_decode($email['send_data'], true);
            $files = [];
            foreach ($send_data as $tmp) {
                if ($tmp['type'] == 'upload') {
                    $files = $tmp['value'];
                    break;
                }
            }
            if ($files) {
                foreach ($files as $file) {
                    if ($wp_filesystem->is_file(HUMMELT_THEME_V3_DOWNLOAD_DIR . $file['file'])) {
                        $wp_filesystem->delete(HUMMELT_THEME_V3_DOWNLOAD_DIR . $file['file']);
                    }
                }
            }
            apply_filters(HUMMELT_THEME_V3_SLUG.'/delete_form_email', $id);
            $this->responseJson->status = true;
            $this->responseJson->msg = 'E-Mail erfolgreich gelöscht.';
        }
        return $this->responseJson;
    }

    private function get_build_form(): object
    {
        $id = filter_var($this->request->get_param('id'), FILTER_VALIDATE_INT);
        $page = filter_var($this->request->get_param('page'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $args = sprintf('WHERE id=%d', $id);
        $getForm = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_form_builder', $args);
        if (!$getForm->status) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $getForm = $getForm->record;
        $formData = $getForm['form'];

        $this->responseJson->pref = 0;
        $this->responseJson->next = 0;
        $refCount = apply_filters(HUMMELT_THEME_V3_SLUG . '/count_form_builder_ref', '');
        if ($refCount) {
            $args = sprintf('WHERE form_id=%d ORDER BY created_at DESC, id DESC LIMIT 1', $id);
            $last = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_form_builder_ref', $args, true);
            if ($last->status) {
                $lastId = $last->record['id'];
                $nextPrev = apply_filters(HUMMELT_THEME_V3_SLUG . '/next_pref_ref', $lastId, $id);
                $this->responseJson->next = (int)$nextPrev['next'];
                $this->responseJson->prev = (int)$nextPrev['prev'];
            }
        }
        if (!$page) {
            $page = 1;
        }
        $builder = [];
        $pages = [];
        $conditions = [];

        $sites = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_pages', null);

        foreach ($formData['conditions'] as $tmp) {
            $item = [
                'id' => $tmp['id'],
                'label' => $tmp['name']
            ];
            $conditions[] = $item;
        }

        foreach ($formData['builder'] as $tmp) {
            $pages[] = $tmp['page'];
            if ($tmp['page'] == $page) {
                $builder[] = $tmp;
            }
        }
        $pages = array_merge(array_unique(array_filter($pages)));

        $settings = $formData['settings'] ?? null;
        if (!$settings) {
            $settings = [
                'col' => 'lg',
                'gutter' => 'g-3',
                'individuell' => ''
            ];
            $formData['settings'] = $settings;
        }
        unset($formData['send_email']);
        $formData['builder'] = $builder;
        $formData['designation'] = $getForm['designation'];



        $selects = $this->form_selects();
        $selects['pages'] = $sites;
        $this->responseJson->selects = $selects;
        $this->responseJson->form_id = $id;
        $this->responseJson->page = $page;
        $this->responseJson->pages = $pages;
        $this->responseJson->record = $formData;
        $this->responseJson->conditions = $conditions;
        $this->responseJson->sites = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_pages', null);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function load_form_example(): object
    {
        $id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        if (!$id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $example = apply_filters(HUMMELT_THEME_V3_SLUG . '/forms_examples', $id);
        if (!$example || !isset($example['builder'])) {
            $this->responseJson->msg = 'Datei nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $example = $example['builder'];
        $bdId = 'FB' . uniqid();
        $example['id'] = $bdId;
        $record = [
            'designation' => $example['name'],
            'form_id' => $bdId,
            'form' => $example
        ];
        $insert = apply_filters(HUMMELT_THEME_V3_SLUG . '/set_form_builder', $record);

        if (!$insert->status) {
            $this->responseJson->msg = 'Layout konnte nicht gespeichert werden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $this->responseJson->msg = 'Layout erfolgreich importiert.';
        $this->responseJson->title = 'Layout importiert';
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_form_email_settings(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        if (!$form_id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $args = sprintf('WHERE id=%d', $form_id);
        $getForm = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_form_builder', $args);
        if (!$getForm->status) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $getForm->record['form'];
        $formInputs = [];
        $sendEmailSelect = false;
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    if ($form['show_msg']) {
                        if (isset($form['config']['send_email']) && $form['config']['send_email']) {
                            $sendEmailSelect = true;
                        }
                        $item = [
                            'slug' => $form['slug'],
                            'id' => $form['id'],
                            'label' => $form['label']
                        ];
                        $formInputs[] = $item;
                    }
                }
            }
        }
        $data['send_email']['email']['message'] = html_entity_decode($data['send_email']['email']['message']);
        $data['send_email']['responder']['message'] = html_entity_decode($data['send_email']['responder']['message']);
        $this->responseJson->record = $data['send_email'];
        $this->responseJson->email_select_active = $sendEmailSelect;
        $this->responseJson->header_select = $this->select_custom_header();
        $this->responseJson->fields = $formInputs;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_extra_grid(): object
    {
        $form_id = filter_var($this->request->get_param('id'), FILTER_VALIDATE_INT);
        $builder_id = filter_var($this->request->get_param('builder_id'), FILTER_UNSAFE_RAW);
        $grid_id = filter_var($this->request->get_param('grid_id'), FILTER_UNSAFE_RAW);
        $formData = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$builder_id || !$grid_id || !$formData) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if (!$data = $this->get_form($form_id)) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formData = json_decode($formData, true);

        $newBuilder = [];
        foreach ($data['builder'] as $tmp) {
            $gridArr = [];
            if ($tmp['id'] == $builder_id) {
                foreach ($tmp['grid'] as $grid) {
                    if ($grid['id'] == $grid_id) {
                        $grid['css'] = filter_var($formData['css'], FILTER_UNSAFE_RAW);
                    }
                    $gridArr[] = $grid;
                }
                $tmp['grid'] = $gridArr;
            }
            $newBuilder[] = $tmp;
        }
        $data['builder'] = $newBuilder;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_builder_form_position(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $to_group = filter_var($this->request->get_param('to_group'), FILTER_UNSAFE_RAW);
        $to_grid = filter_var($this->request->get_param('to_grid'), FILTER_UNSAFE_RAW);
        $elements = $this->request->get_param('elements');
        if (!$form_id || !$to_group || !$to_grid || !$elements) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if (!$data = $this->get_form($form_id)) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formArr = [];
        $final = [];
        foreach ($elements as $element) {
            $search = $this->search_form_item($data, $element);
            if ($search) {
                $formArr[] = $search;
            }
        }
        $gf = [];

        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $to_group) {
                foreach ($tmp['grid'] as $grid) {
                    if ($grid['id'] == $to_grid) {
                        $grid['forms'] = $formArr;
                    }
                    $gf[] = $grid;
                }
                $tmp['grid'] = $gf;
            }
            $final[] = $tmp;
        }
        $data['builder'] = $final;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_form_error_msg(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        if (!$form_id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if (!$data = $this->get_form($form_id)) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $fieldMsg = [];
        $optArr = [];
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    $required = $form['required'] ?? null;
                    if ($required || $form['type'] == 'checkbox' || $form['type'] == 'upload') {
                        if ($form['type'] == 'upload') {
                            $message = $form['message'];
                        } else {
                            $message = [];
                        }
                        if ($form['type'] == 'checkbox') {
                            foreach ($form['options'] as $option) {
                                if (isset($option['required']) && $option['required']) {
                                    $optItem = [
                                        'id' => $option['id'],
                                        'label' => $option['label'] ?? '',
                                        'value' => $option['err_msg'] ?? ''
                                    ];
                                    $optArr[] = $optItem;
                                }
                            }
                        }

                        $item = [
                            'group' => $tmp['id'],
                            'grid' => $grid['id'],
                            'id' => $form['id'],
                            'type' => $form['type'],
                            'label' => $form['label'],
                            'value' => $form['err_msg'],
                        ];
                        if ($form['type'] == 'checkbox') {
                            $item['checkbox'] = $optArr;
                        }
                        if ($form['type'] == 'upload') {
                            $item['message'] = $message;
                        }

                        $fieldMsg[] = $item;
                    }
                }
            }
        }
        $this->responseJson->status = true;
        $this->responseJson->field_message = $fieldMsg;
        $this->responseJson->form_message = $data['message']['email_sent'] ?? [];
        return $this->responseJson;
    }

    private function add_builder_page(): object
    {
        $form_id = filter_var($this->request->get_param('id'), FILTER_VALIDATE_INT);
        if (!$form_id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if (!$data = $this->get_form($form_id)) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $pageArr = [];
        foreach ($data['builder'] as $tmp) {
            $pageArr[] = $tmp['page'];
        }
        $pageArr = array_merge(array_unique(array_filter($pageArr)));
        $page = count($pageArr) + 1;
        $pageArr = array_merge($pageArr, [$page]);

        $newArr = [
            'id' => uniqid(),
            'page' => (int)$page,
            'grid' => [
                '0' => [
                    'id' => uniqid(),
                    'col' => 12,
                    'forms' => []
                ]
            ]
        ];
        $newData = array_merge_recursive($data['builder'], [$newArr]);
        $data['builder'] = $newData;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);
        $this->set_prev_form($form_id);

        $this->responseJson->page = $page;
        $this->responseJson->pages = $pageArr;
        $this->responseJson->record = [$newArr];
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_builder_page(): object
    {
        $form_id = filter_var($this->request->get_param('id'), FILTER_VALIDATE_INT);
        $page = filter_var($this->request->get_param('page'), FILTER_VALIDATE_INT);
        if (!$form_id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if (!$data = $this->get_form($form_id)) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $pageArr = [];
        if ($page - 1 < 1) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $newData = [];
        $pages = [];
        foreach ($data['builder'] as $tmp) {
            if ($tmp['page'] == $page) {
                continue;
            }
            if ($tmp['page'] >= $page) {
                $tmp['page'] = $tmp['page'] - 1;
            }
            $pages[] = $tmp['page'];
            $pageArr[] = $tmp;
        }

        foreach ($pageArr as $tmp) {
            if ($tmp['page'] == 1) {
                $newData[] = $tmp;
            }
        }

        $pages = array_merge(array_unique(array_filter($pages)));
        $data['builder'] = $pageArr;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);
        $this->set_prev_form($form_id);

        $this->responseJson->page = 1;
        $this->responseJson->pages = $pages;
        $this->responseJson->record = $newData;
        $this->responseJson->status = true;

        return $this->responseJson;
    }

    private function add_builder_row(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_UNSAFE_RAW);
        $id = filter_var($this->request->get_param('id'), FILTER_VALIDATE_INT);
        $row = filter_var($this->request->get_param('row'), FILTER_VALIDATE_INT);
        $page = filter_var($this->request->get_param('page'), FILTER_VALIDATE_INT);
        if (!$form_id || !$id || !$row || !$page) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $newArr = [
            'id' => uniqid(),
            'page' => (int)$page,
            'grid' => [
                '0' => [
                    'id' => uniqid(),
                    'col' => 12,
                    'forms' => []
                ]
            ]
        ];

        $data = $this->get_form($id);
        if (!$data) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $add = array_merge_recursive($data['builder'], [$newArr]);
        $data['builder'] = $add;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $id);
        $this->set_prev_form($id);

        $this->responseJson->status = true;
        $this->responseJson->record = $newArr;
        return $this->responseJson;
    }

    private function delete_builder_group(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_UNSAFE_RAW);
        $id = filter_var($this->request->get_param('id'), FILTER_VALIDATE_INT);
        $group_id = filter_var($this->request->get_param('group_id'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$group_id || !$id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $data = $this->get_form($id);
        if (!$data) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $groupArr = [];
        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $group_id) {
                continue;
            }
            $groupArr[] = $tmp;
        }
        $data['builder'] = $groupArr;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $id);
        $this->set_prev_form($id);

        $this->responseJson->title = 'Änderungen gespeichert';
        $this->responseJson->msg = 'Die Änderungen wurden erfolgreich gespeichert.';
        $this->responseJson->group = $group_id;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function builder_splitt_col(): object
    {
        $id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $groupId = filter_var($this->request->get_param('groupId'), FILTER_UNSAFE_RAW);
        $colId = filter_var($this->request->get_param('colId'), FILTER_UNSAFE_RAW);
        $col = filter_var($this->request->get_param('col'), FILTER_VALIDATE_INT);
        if (!$colId || !$col || !$groupId || !$id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $addColCount = floor(($col / 2));
        $addContent = [
            'id' => uniqid(),
            'col' => $addColCount,
            'forms' => []
        ];
        $splitt = $col - $addColCount;

        $data = $this->get_form($id);
        if (!$data) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $gridAddData = [];
        foreach ($data['builder'] as $tmp) {
            $gridArr = [];
            if ($tmp['id'] == $groupId) {
                foreach ($tmp['grid'] as $grid) {
                    if ($grid['id'] == $colId) {
                        $grid['col'] = $splitt;
                    }
                    $gridArr[] = $grid;
                }
                $addGrid = array_merge_recursive($gridArr, [$addContent]);
                $tmp['grid'] = $addGrid;
            }
            $gridAddData[] = $tmp;
        }
        $data['builder'] = $gridAddData;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $id);
        $this->set_prev_form($id);

        $this->responseJson->group_id = $groupId;
        $this->responseJson->col_id = $colId;
        $this->responseJson->splitt = $splitt;
        $this->responseJson->record = $addContent;
        $this->responseJson->addCol = $addColCount;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function remove_builder_col(): object
    {
        $id = filter_var($this->request->get_param('id'), FILTER_VALIDATE_INT);
        $col = filter_var($this->request->get_param('col'), FILTER_VALIDATE_INT);
        $group_id = filter_var($this->request->get_param('group_id'), FILTER_UNSAFE_RAW);
        $grid = filter_var($this->request->get_param('grid'), FILTER_UNSAFE_RAW);
        $grid_id = filter_var($this->request->get_param('grid_id'), FILTER_UNSAFE_RAW);

        if (!$grid || !$col || !$grid_id || !$group_id || !$id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $grid = json_decode($grid, true);
        $newCols = $grid['grid'][$col - 1]['col'] + $grid['grid'][$col]['col'];
        $copyForms = $grid['grid'][$col]['forms'];
        $delGridId = $grid['grid'][$col]['id'];

        unset($grid['grid'][$col]);
        $grid['grid'] = array_filter(array_merge_recursive($grid['grid']));
        $forms = array_merge_recursive($grid['grid'][$col - 1]['forms'], $copyForms);

        $grid['grid'][$col - 1]['forms'] = $forms;
        $grid['grid'][$col - 1]['col'] = $newCols;

        $data = $this->get_form($id);
        if (!$data) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $newData = [];
        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $group_id) {
                $tmp['grid'] = $grid['grid'];
            }
            $newData[] = $tmp;
        }
        $data['builder'] = $newData;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $id);
        $this->set_prev_form($id);

        $this->responseJson->status = true;
        $this->responseJson->record = $grid;
        return $this->responseJson;

    }

    private function update_builder_group_position(): object
    {
        $id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $elements = $this->request->get_param('elements');
        $page = filter_var($this->request->get_param('page'), FILTER_VALIDATE_INT);
        if (!$id || !$elements || !$page) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $this->get_form($id);
        if (!$data) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        // $elements = explode(',', $elements);
        $groupData = [];
        foreach ($elements as $element) {
            $search = $this->search_group_element($data, $element);
            if ($search) {
                $groupData[] = $search;
            }
        }
        $otherPage = [];
        foreach ($data['builder'] as $tmp) {
            if ($tmp['page'] == $page) {
                continue;
            }
            $otherPage[] = $tmp;
        }
        if (!$groupData) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        global $themeV3Helper;
        if ($otherPage) {
            $groupData = array_merge_recursive($groupData, $otherPage);
            $groupData = $themeV3Helper->order_by_args($groupData, 'page', 2);
        }
        $data['builder'] = $groupData;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $id);
        $this->set_prev_form($id);

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_builder_grid_position(): object
    {
        $id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $elements = $this->request->get_param('elements');
        $group = filter_var($this->request->get_param('group'), FILTER_UNSAFE_RAW);
        if (!$id || !$elements || !$group) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $this->get_form($id);
        if (!$data) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $gridArr = [];
        foreach ($elements as $element) {
            $search = $this->search_grid_element($data, $element);
            if ($search) {
                $gridArr[] = $search;
            }
        }

        $newData = [];
        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                $tmp['grid'] = $gridArr;
            }
            $newData[] = $tmp;
        }

        $data['builder'] = $newData;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $id);
        $this->set_prev_form($id);

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function set_form_field(): object
    {
        $id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $form_type = filter_var($this->request->get_param('form_type'), FILTER_UNSAFE_RAW);
        $grid = filter_var($this->request->get_param('grid'), FILTER_UNSAFE_RAW);
        $group = filter_var($this->request->get_param('group'), FILTER_UNSAFE_RAW);
        if (!$form_type || !$id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $field = $this->form_types('', $form_type);
        if (!$field) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $this->get_form($id);
        if (!$data) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formArr = [];
        foreach ($data['builder'] as $tmp) {
            $gridArr = [];
            if ($tmp['id'] == $group) {
                foreach ($tmp['grid'] as $gridForm) {
                    if ($gridForm['id'] == $grid) {
                        $forms = $gridForm['forms'];
                        $forms = array_merge_recursive($forms, [$field]);
                        $gridForm['forms'] = $forms;
                    }
                    $gridArr[] = $gridForm;
                }
                $tmp['grid'] = $gridArr;
            }

            $formArr[] = $tmp;
        }
        $data['builder'] = $formArr;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $id);
        $this->set_prev_form($id);

        $this->responseJson->grid = $grid;
        $this->responseJson->group = $group;
        $this->responseJson->record = $field;
        $this->responseJson->status = true;
        return $this->responseJson;

    }

    private function get_form_fields(): object
    {
        $handle = filter_var($this->request->get_param('handle'), FILTER_UNSAFE_RAW);
        $this->responseJson->grid = filter_var($this->request->get_param('grid'), FILTER_UNSAFE_RAW);
        $this->responseJson->group = filter_var($this->request->get_param('group'), FILTER_UNSAFE_RAW);
        if (!$handle) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if ($handle == 'modal') {
            $this->responseJson->record = $this->form_types();
            $this->responseJson->status = true;
        }
        return $this->responseJson;
    }

    private function get_build_edit_data(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $grid = filter_var($this->request->get_param('grid'), FILTER_UNSAFE_RAW);
        $group = filter_var($this->request->get_param('group'), FILTER_UNSAFE_RAW);
        $inputId = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$group || !$grid || !$inputId) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $data = $this->get_form($form_id);
        if (!$data) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formData = [];
        $gridId = '';
        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                foreach ($tmp['grid'] as $grid) {
                    foreach ($grid['forms'] as $form) {
                        if ($form['id'] == $inputId) {
                            $formData = $form;
                            $gridId = $grid['id'];
                            break;
                        }
                    }
                }
            }
        }
        if (!$formData || !$gridId) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $this->responseJson->rating = false;
        if ($formData['type'] == 'rating') {
            $this->responseJson->rating = true;
            $this->responseJson->rating_select = $this->rating_options_field();
        }
        $this->responseJson->record = $formData;
        $this->responseJson->grid_id = $gridId;
        $this->responseJson->group_id = $group;
        $this->responseJson->input_id = $inputId;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_form_input(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $grid = filter_var($this->request->get_param('grid'), FILTER_UNSAFE_RAW);
        $group = filter_var($this->request->get_param('group'), FILTER_UNSAFE_RAW);
        $input_id = filter_var($this->request->get_param('input_id'), FILTER_UNSAFE_RAW);

        if (!$grid || !$form_id || !$group || !$input_id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $this->get_form($form_id);
        if (!$data) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $newData = [];
        $d = [];
        $fd = [];
        foreach ($data['builder'] as $tmp) {

            if ($tmp['id'] == $group) {
                foreach ($tmp['grid'] as $gridData) {
                    if ($gridData['id'] == $grid) {
                        foreach ($gridData['forms'] as $form) {
                            if ($form['id'] == $input_id) {
                                continue;
                            }
                            $fd[] = $form;
                        }
                        $gridData['forms'] = $fd;
                    }
                    $d[] = $gridData;
                }
                $tmp['grid'] = $d;
            }
            $newData[] = $tmp;
        }
        $data['builder'] = $newData;
        $conArr = [];
        foreach ($data['conditions'] as $tmp) {
            $del = false;
            foreach ($tmp['group'] as $conGroup) {
                foreach ($conGroup['rules'] as $rule) {
                    if ($rule['field'] == $input_id) {
                        $del = true;
                    }
                }
            }
            if ($del) {
                continue;
            }
            $conArr[] = $tmp;
        }
        $data['conditions'] = $conArr;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);
        $this->set_prev_form($form_id);

        $this->responseJson->group = $group;
        $this->responseJson->grid = $grid;
        $this->responseJson->input = $input_id;
        $this->responseJson->status = true;

        return $this->responseJson;
    }

    private function update_builder_grid_form(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $from_grid = filter_var($this->request->get_param('from_grid'), FILTER_UNSAFE_RAW);
        $from_group = filter_var($this->request->get_param('from_group'), FILTER_UNSAFE_RAW);
        $to_grid = filter_var($this->request->get_param('to_grid'), FILTER_UNSAFE_RAW);
        $to_group = filter_var($this->request->get_param('to_group'), FILTER_UNSAFE_RAW);
        $elements = $this->request->get_param('elements');
        if (!$form_id || !$from_group || !$from_grid || !$to_group || !$to_grid || !$elements) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $data = $this->get_form($form_id);
        if (!$data) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $newData = [];
        $d = [];
        $fd = [];
        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $from_group) {
                foreach ($tmp['grid'] as $grid) {
                    if ($grid['id'] == $from_grid) {
                        foreach ($grid['forms'] as $form) {
                            if (in_array($form['id'], $elements)) {
                                continue;
                            }
                            $fd[] = $form;
                        }
                        $grid['forms'] = $fd;
                    }
                    $d[] = $grid;
                }
                $tmp['grid'] = $d;
                $newData = $tmp;
            }
        }
        $newBuilder = [];
        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $from_group) {
                $tmp['grid'] = $newData['grid'];
            }
            $newBuilder[] = $tmp;
        }
        $formArr = [];
        $final = [];
        foreach ($elements as $element) {
            $search = $this->search_form_item($data, $element);
            if ($search) {
                $formArr[] = $search;
            }
        }
        $gf = [];
        foreach ($newBuilder as $tmp) {
            if ($tmp['id'] == $to_group) {
                foreach ($tmp['grid'] as $grid) {
                    if ($grid['id'] == $to_grid) {
                        $grid['forms'] = $formArr;
                    }
                    $gf[] = $grid;
                }
                $tmp['grid'] = $gf;
            }
            $final[] = $tmp;
        }
        $data['builder'] = $final;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);
        $this->set_prev_form($form_id);

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_edit_form_field(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $grid = filter_var($this->request->get_param('grid'), FILTER_UNSAFE_RAW);
        $group = filter_var($this->request->get_param('group'), FILTER_UNSAFE_RAW);
        $inputId = filter_var($this->request->get_param('input_id'), FILTER_UNSAFE_RAW);
        $formData = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$group || !$grid || !$inputId || !$formData) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formData = json_decode($formData, true);
        $data = $this->get_form($form_id);
        if (!$data) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $is_slug = false;

        if ($formData['slug']) {
            $formData['slug'] = $this->check_data_slug($data, $formData);
            $is_slug = true;
            $this->responseJson->slug = $formData['slug'];
        }

        $this->responseJson->is_slug = $is_slug;

        if ($formData['type'] == 'select') {
            $formData = $this->check_input_data($data, $formData);
        }
        if ($formData['type'] == 'date') {
            $formData = $this->check_config_date($data, $formData);
        }
        if ($formData['type'] == 'privacy-check') {
            $formData = $this->check_data_protection($data, $formData);
        }

        global $themeV3Helper;
        if ($formData['type'] == 'upload') {
            $accept = $formData['config']['accept'];
            $accept = $themeV3Helper->trim_string($accept);
            $accept = str_replace([',', ';', '.'], [',', ',', ''], $accept);
            $accept = explode(',', $accept);
            $acArr = [];
            foreach ($accept as $ac) {
                $acArr[] = '.' . $ac;
            }
            $accept = implode(',', $acArr);
            $formData['config']['accept'] = $accept;
        }

        if ($formData['type'] == 'privacy-check') {
            $regEx = '/({(.+?.*?)})/';
            preg_match($regEx, $formData['config']['default'], $matches);
            $placeholder = $matches[0] ?? null;
            $linkStr = $matches[2] ?? null;
            if ($placeholder && $linkStr) {
                $href = '<a href="' . $formData['config']['url'] . '">' . $matches[2] . '</a>';
                $link = str_replace($matches[0], $href, $formData['config']['default']);
                $formData['config']['link'] = $link;
            }
        }
        $newData = [];
        $d = [];
        $fd = [];
        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                foreach ($tmp['grid'] as $gridData) {
                    if ($gridData['id'] == $grid) {
                        foreach ($gridData['forms'] as $form) {
                            if ($form['id'] == $inputId) {
                                $form = $formData;
                            }
                            $fd[] = $form;
                        }
                        $gridData['forms'] = $fd;
                    }
                    $d[] = $gridData;
                }
                $tmp['grid'] = $d;
            }
            $newData[] = $tmp;
        }
        $data['builder'] = $newData;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);
        $this->set_prev_form($form_id);

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function add_selection_option(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $grid = filter_var($this->request->get_param('grid'), FILTER_UNSAFE_RAW);
        $group = filter_var($this->request->get_param('group'), FILTER_UNSAFE_RAW);
        $inputId = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        $handle = filter_var($this->request->get_param('handle'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$group || !$grid || !$inputId || !$handle) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $data = $this->get_form($form_id);
        if (!$data) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $newData = [];
        $d = [];
        $fd = [];
        $addData = [];
        if ($handle == 'select') {
            $addData = $this->select_options_field();
        }
        if ($handle == 'checkbox') {
            $addData = $this->checkbox_options_field();
        }

        if (!$addData) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                foreach ($tmp['grid'] as $gridData) {
                    if ($gridData['id'] == $grid) {
                        foreach ($gridData['forms'] as $form) {
                            if ($form['id'] == $inputId) {
                                $form['options'] = array_merge_recursive($form['options'], [$addData]);
                            }
                            $fd[] = $form;
                        }
                        $gridData['forms'] = $fd;
                    }
                    $d[] = $gridData;
                }
                $tmp['grid'] = $d;
            }
            $newData[] = $tmp;
        }

        $data['builder'] = $newData;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);
        $this->set_prev_form($form_id);

        $this->responseJson->record = $addData;
        $this->responseJson->group = $group;
        $this->responseJson->grid = $grid;
        $this->responseJson->input = $inputId;
        $this->responseJson->handle = $handle;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_select_option(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $grid = filter_var($this->request->get_param('grid'), FILTER_UNSAFE_RAW);
        $group = filter_var($this->request->get_param('group'), FILTER_UNSAFE_RAW);
        $inputId = filter_var($this->request->get_param('input'), FILTER_UNSAFE_RAW);
        $optionId = filter_var($this->request->get_param('options'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$group || !$grid || !$inputId || !$optionId) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $data = $this->get_form($form_id);
        if (!$data) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $newData = [];
        $d = [];
        $fd = [];
        $opt = [];
        $def = false;

        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                foreach ($tmp['grid'] as $gridData) {
                    if ($gridData['id'] == $grid) {
                        foreach ($gridData['forms'] as $form) {
                            if ($form['id'] == $inputId) {
                                foreach ($form['options'] as $option) {
                                    if ($option['id'] == $optionId) {
                                        if ($option['default']) {
                                            $def = true;
                                        }
                                        continue;
                                    }
                                    $opt[] = $option;
                                }
                                if ($def) {
                                    $form['config']['standard'] = true;
                                }
                                $form['options'] = $opt;
                            }
                            $fd[] = $form;
                        }
                        $gridData['forms'] = $fd;
                    }
                    $d[] = $gridData;
                }
                $tmp['grid'] = $d;
            }
            $newData[] = $tmp;
        }
        $data['builder'] = $newData;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);
        $this->set_prev_form($form_id);
        $this->responseJson->default = $def;
        $this->responseJson->optionId = $optionId;
        $this->responseJson->group = $group;
        $this->responseJson->grid = $grid;
        $this->responseJson->input = $inputId;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_select_position(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $grid = filter_var($this->request->get_param('grid'), FILTER_UNSAFE_RAW);
        $group = filter_var($this->request->get_param('group'), FILTER_UNSAFE_RAW);
        $inputId = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        $elements = $this->request->get_param('elements');
        if (!$form_id || !$group || !$grid || !$inputId || !$elements) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $data = $this->get_form($form_id);
        if (!$data) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $newOptions = [];
        foreach ($elements as $element) {
            $newOptions[] = $this->search_form_options($data, $element);
        }
        if (!$newOptions) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $newData = [];
        $d = [];
        $fd = [];
        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $group) {
                foreach ($tmp['grid'] as $gridData) {
                    if ($gridData['id'] == $grid) {
                        foreach ($gridData['forms'] as $form) {
                            if ($form['id'] == $inputId) {
                                $form['options'] = $newOptions;
                            }
                            $fd[] = $form;
                        }
                        $gridData['forms'] = $fd;
                    }
                    $d[] = $gridData;
                }
                $tmp['grid'] = $d;
            }
            $newData[] = $tmp;
        }

        $data['builder'] = $newData;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);
        $this->set_prev_form($form_id);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_builder_settings(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $updData = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$updData) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if (!$data = $this->get_form($form_id)) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $updData = json_decode($updData, true);
        $data['settings'] = $updData;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_form_conditions(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        if (!$form_id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if (!$data = $this->get_form($form_id)) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $this->responseJson->conditions = $data['conditions'];
        $this->responseJson->status = true;

        return $this->responseJson;
    }

    private function add_form_conditions(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $name = filter_var($this->request->get_param('name'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$name) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if (!$data = $this->get_form($form_id)) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        global $themeV3Helper;
        $name = $themeV3Helper->pregWhitespace($name);

        $conId = uniqid();
        $add = [
            'id' => $conId,
            'type' => 'show',
            'name' => $name,
            'fields' => [],
            'group' => []
        ];
        $con = array_merge_recursive($data['conditions'], [$add]);
        $data['conditions'] = $con;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);

        $this->responseJson->forms = $this->get_builder_form_fields($form_id);
        $this->responseJson->conditions = $data['conditions'];
        $this->responseJson->edit = $add;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_form_condition_by_id(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        if (!$id || !$form_id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        if (!$data = $this->get_form($form_id)) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $arr = [];
        $g = [];
        $fields = [];
        foreach ($data['conditions'] as $tmp) {
            if ($tmp['id'] == $id) {
                foreach ($tmp['group'] as $group) {
                    $r = [];
                    foreach ($group['rules'] as $rule) {
                        if ($rule['field'] && $rule['is_select']) {
                            $select = $this->get_builder_form_fields($form_id, $rule['field']);
                            $rule['selects'] = $select['form']['options'];
                        }
                        if ($rule['field']) {
                            $fields[] = $rule['field'];
                        }
                        $r[] = $rule;
                    }
                    $group['rules'] = $r;
                    $g[] = $group;

                }

                $tmp['group'] = $g;
                $arr = $tmp;
            }
        }

        $this->responseJson->edit = $arr;
        $this->responseJson->fields = $fields;
        $this->responseJson->forms = $this->get_builder_form_fields($form_id);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_condition_rule(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        $conData = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$id || !$conData) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        if (!$data = $this->get_form($form_id)) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $conData = json_decode($conData, true);
        $updData = [];
        foreach ($data['conditions'] as $tmp) {
            if ($tmp['id'] == $id) {
                $tmp['name'] = $conData['name'];
                $tmp['type'] = $conData['type'];
                $tmp['group'] = $conData['group'];
            }
            $updData[] = $tmp;
        }
        $data['conditions'] = $updData;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);

        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function add_form_condition_type(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        $field = filter_var($this->request->get_param('field'), FILTER_UNSAFE_RAW);
        $handle = filter_var($this->request->get_param('handle'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$id || !$field || !$handle) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        if (!$data = $this->get_form($form_id)) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $updData = $this->form_condition_handle($data['builder'], $field, $handle, $id);
        $data['builder'] = $updData;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);

        $this->responseJson->forms = $this->get_builder_form_fields($form_id);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function add_condition_rule(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        if (!$data = $this->get_form($form_id)) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $conData = $data['conditions'];
        $ruleId = uniqid();

        $addGroup = [
            'id' => $ruleId,
            'compare' => 'is',
            'is_select' => false,
            'field' => '',
            'value' => ''
        ];
        $conArr = [];
        $editRule = [];

        $newId = uniqid();
        foreach ($conData as $tmp) {
            if ($tmp['id'] == $id) {
                $add = [
                    'id' => $newId,
                    'rules' => [$addGroup]
                ];

                $g = [];
                if (isset($tmp['group'])) {
                    foreach ($tmp['group'] as $group) {
                        $r = [];
                        if (isset($group['rules'])) {
                            foreach ($group['rules'] as $rule) {
                                if ($rule['is_select']) {
                                    if ($rule['field']) {
                                        $select = $this->get_builder_form_fields($form_id, $rule['field']);
                                        $rule['selects'] = $select['form']['options'];
                                    } else {
                                        $rule['selects'] = [];
                                    }
                                }
                                $r[] = $rule;
                            }
                        }
                        $group['rules'] = $r;
                        $g[] = $group;
                    }
                    $tmp['group'] = $g;
                }
                $tmp['group'] = array_merge_recursive($tmp['group'], [$add]);
            }
            $conArr[] = $tmp;
        }

        foreach ($conArr as $tmp) {
            if ($tmp['id'] == $id) {
                foreach ($tmp['group'] as $group) {
                    if ($group['id'] == $newId) {
                        $editRule = $tmp;
                    }
                }
            }
        }

        $data['conditions'] = $conArr;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);

        $this->responseJson->conditions = $conArr;
        $this->responseJson->edit = $editRule;
        $this->responseJson->id = $id;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_builder_form_options(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $field_id = filter_var($this->request->get_param('field_id'), FILTER_UNSAFE_RAW);
        $rule_group = filter_var($this->request->get_param('rule_group'), FILTER_UNSAFE_RAW);
        $rule_id = filter_var($this->request->get_param('rule_id'), FILTER_UNSAFE_RAW);
        $con_id = filter_var($this->request->get_param('con_id'), FILTER_UNSAFE_RAW);
        $handle = filter_var($this->request->get_param('handle'), FILTER_UNSAFE_RAW);
        $reload = filter_var($this->request->get_param('reload'), FILTER_VALIDATE_BOOLEAN);
        if ($reload) {
            $this->responseJson->type = 'reload_get_builder_form_options';
        }
        if (!$form_id || !$field_id || !$rule_group || !$rule_id || !$con_id || !$handle) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        if (!$data = $this->get_form($form_id)) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $form = $this->get_builder_form_fields($form_id, $field_id);
        if (!$form) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $newCont = [];
        $editCont = [];
        $g = [];
        $r = [];
        $fields = [];
        $editRule = [];

        foreach ($data['conditions'] as $tmp) {

            if ($tmp['id'] == $con_id) {
                foreach ($tmp['group'] as $group) {

                    if ($group['id'] == $rule_group) {
                        foreach ($group['rules'] as $rule) {

                            if ($rule['id'] == $rule_id) {

                                if ($handle == 'field') {
                                    $rule['field'] = $field_id;
                                    $rule['is_select'] = $form['is_option'];
                                    $rule['value'] = '';
                                    if ($form['is_option']) {
                                        $select = $this->get_builder_form_fields($form_id, $rule['field']);
                                        $rule['selects'] = $select['form']['options'];
                                    }
                                }
                                if ($handle == 'value') {
                                    $rule['value'] = $field_id;
                                }
                                if ($handle == 'compare') {
                                    $rule['compare'] = $field_id;
                                }
                                $editRule = $rule;
                            }

                            $r[] = $rule;
                        }
                        $group['rules'] = $r;
                    }
                    $g[] = $group;
                }
                $tmp['group'] = $g;
            }
            $newCont[] = $tmp;
        }

        foreach ($newCont as $tmp) {
            if ($tmp['id'] == $con_id) {
                foreach ($tmp['group'] as $group) {
                    foreach ($group['rules'] as $rule) {
                        if ($rule['field']) {
                            $fields[] = $rule['field'];
                        }
                    }
                }
            }
        }

        $data['conditions'] = $newCont;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);

        foreach ($newCont as $tmp) {
            if ($tmp['id'] == $con_id) {
                $editCont = $tmp;
            }
        }

        if (isset($editRule['is_select']) && $editRule['is_select']) {
            $form_value = [
                'is_select' => true,
                'record' => [
                    'form_id' => $editRule['id'],
                    'select' => $editRule['selects'] ?? []
                ]
            ];
        } else {
            $form_value = [
                'is_select' => false,
                'record' => [
                    'form_id' => $editRule['id'],
                    'value' => $editRule['id'],
                ]
            ];
        }

        $this->responseJson->is_select = $editRule['is_select'];
        $this->responseJson->status = true;
        $this->responseJson->fields = $fields;
        $this->responseJson->form_value = $form_value;
        $this->responseJson->edit = $editCont;
        return $this->responseJson;
    }

    private function add_rule_line(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $group_id = filter_var($this->request->get_param('group_id'), FILTER_UNSAFE_RAW);
        $con_id = filter_var($this->request->get_param('con_id'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$group_id || !$con_id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if (!$data = $this->get_form($form_id)) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $addId = uniqid();
        $addRule = [
            'id' => $addId,
            'compare' => 'is',
            'is_select' => false,
            'field' => '',
            'value' => ''
        ];

        $newCont = [];
        $g = [];
        foreach ($data['conditions'] as $tmp) {
            if ($tmp['id'] == $con_id) {
                foreach ($tmp['group'] as $group) {
                    if ($group['id'] == $group_id) {
                        $group['rules'] = array_merge_recursive($group['rules'], [$addRule]);
                    }
                    $g[] = $group;
                }
                $tmp['group'] = $g;
            }
            $newCont[] = $tmp;
        }

        $data['conditions'] = $newCont;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);

        $this->responseJson->rule = $addRule;
        $this->responseJson->group_id = $group_id;
        $this->responseJson->con_id = $con_id;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_form_line(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $rule_group = filter_var($this->request->get_param('group_id'), FILTER_UNSAFE_RAW);
        $rule_id = filter_var($this->request->get_param('rule_id'), FILTER_UNSAFE_RAW);
        $con_id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$rule_group || !$rule_id || !$con_id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        if (!$data = $this->get_form($form_id)) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $editCont = [];
        $g = [];
        $r = [];
        $delGroup = false;
        $fields = [];

        foreach ($data['conditions'] as $tmp) {
            if ($tmp['id'] == $con_id) {
                foreach ($tmp['group'] as $group) {
                    if ($group['id'] == $rule_group) {
                        foreach ($group['rules'] as $rule) {
                            if ($rule['id'] == $rule_id) {
                                continue;
                            }
                            $r[] = $rule;
                        }
                        $group['rules'] = $r;
                    }
                    if (count($group['rules']) == 0) {
                        $delGroup = true;
                        continue;
                    }
                    $g[] = $group;
                }
                $tmp['group'] = $g;
            }
            $editCont[] = $tmp;
        }
        foreach ($editCont as $tmp) {
            if ($tmp['id'] == $con_id) {
                foreach ($tmp['group'] as $group) {
                    foreach ($group['rules'] as $rule) {
                        if ($rule['field']) {
                            $fields[] = $rule['field'];
                        }
                    }
                }
            }
        }

        $data['conditions'] = $editCont;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);

        $this->responseJson->delete_group = $delGroup;
        $this->responseJson->group_id = $rule_group;
        $this->responseJson->rule_id = $rule_id;
        $this->responseJson->fields = $fields;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function delete_form_condition(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $id = filter_var($this->request->get_param('id'), FILTER_UNSAFE_RAW);
        if (!$form_id || !$id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if (!$data = $this->get_form($form_id)) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $newData = [];
        $updData = [];
        foreach ($data['conditions'] as $tmp) {
            if ($tmp['id'] == $id) {
                continue;
            }
            $newData[] = $tmp;
        }

        $data['conditions'] = $newData;

        foreach ($data['builder'] as $tmp) {
            $d = [];
            foreach ($tmp['grid'] as $grid) {
                $fd = [];
                foreach ($grid['forms'] as $form) {
                    if ($form['condition'] && isset($form['condition']['type'])) {
                        if ($form['condition']['type'] == $id) {
                            $form['condition'] = [];
                        }
                    }
                    $fd[] = $form;
                }
                $grid['forms'] = $fd;
                $d[] = $grid;
            }
            $tmp['grid'] = $d;
            $updData[] = $tmp;
        }
        $data['builder'] = $updData;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);

        $this->responseJson->conditions = $newData;
        $this->responseJson->status = true;
        $this->responseJson->msg = 'Formular Bedingung erfolgreich gelöscht.';
        return $this->responseJson;
    }

    private function set_referenz(): object
    {
        $id = filter_var($this->request->get_param('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $args = sprintf('WHERE id=%d', $id);
        $ref = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_form_builder_ref', $args);
        if (!$ref->status) {
            $this->responseJson->msg = 'Referenz nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $ref = $ref->record;
        $pages = [];
        foreach ($ref['form']['builder'] as $tmp) {
            $pages[] = $tmp['page'];
        }
        $prev = apply_filters(HUMMELT_THEME_V3_SLUG . '/next_pref_ref', $id, $ref['form_id']);
        $this->responseJson->prev = (int)$prev['prev'];
        $this->responseJson->next = (int)$prev['next'];

        $pages = array_merge(array_unique(array_filter($pages)));
        $this->responseJson->page = 1;
        $this->responseJson->pages = $pages;
        $this->responseJson->builder = $ref['form']['builder'];
        $this->responseJson->conditions = $ref['form']['conditions'];
        $this->responseJson->active = (int)$id;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function get_form_referenzen(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        if (!$form_id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $limit = 10;
        $count = apply_filters(HUMMELT_THEME_V3_SLUG . '/count_form_builder_ref', '');
        $rows = 0;
        if ($count) {
            $rows = (int)ceil($count / $limit);
        }

        $args = sprintf('WHERE form_id=%d ORDER BY created_at DESC', $form_id);
        $ref = apply_filters(HUMMELT_THEME_V3_SLUG . '/builder_ref_selects', $args);
        $this->responseJson->referenz = $ref;
        $this->responseJson->rows = $rows;
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function update_form_email_settings(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $formData = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        if (!$form_id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $formData = json_decode($formData, true);
        if (!$data = $this->get_form($form_id)) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        global $themeV3Helper;
        $cc = $themeV3Helper->trim_string($formData['email']['cc']);
        $bcc = $themeV3Helper->trim_string($formData['email']['bcc']);
        $cc = str_replace([';', ','], '#', $cc);
        $cc = explode('#', $cc);
        $bcc = str_replace([';', ','], '#', $bcc);
        $bcc = explode('#', $bcc);
        //$formData['email']['cc']
        $header = [];
        if(isset($formData['email']['header'])) {
            $header = $formData['email']['header'];
        }
        $sendMail = [
            'email' => [
                'recipient' => $formData['email']['recipient'],
                'subject' => $formData['email']['subject'],
                'cc' => implode(',', $cc),
                'bcc' => implode(',', $bcc),
                'header' => $header,
                'message' => htmlentities($themeV3Helper->fn_compress_string($formData['email']['message']))
            ],
            'responder' => [
                'subject' => $formData['responder']['subject'],
                'active' => filter_var($formData['responder']['active'], FILTER_VALIDATE_BOOLEAN),
                'message' => htmlentities($themeV3Helper->fn_compress_string($formData['responder']['message']))
            ],
        ];
        $data['send_email'] = $sendMail;
        apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);

        $this->responseJson->status = true;
        $this->responseJson->msg = 'Einstellungen erfolgreich gespeichert.';
        return $this->responseJson;
    }

    private function update_form_message(): object
    {
        $form_id = filter_var($this->request->get_param('form_id'), FILTER_VALIDATE_INT);
        $handle = filter_var($this->request->get_param('handle'), FILTER_UNSAFE_RAW);
        $update = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        $checkbox = filter_var($this->request->get_param('checkbox'), FILTER_UNSAFE_RAW);
        if (!$checkbox) {
            $checkbox = [];
        }
        if (!$form_id || !$handle || !$update) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        if (!$data = $this->get_form($form_id)) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $update = json_decode($update, true);
        $groupId = $update['group'] ?? '';
        $gridId = $update['grid'] ?? '';
        $formId = $update['id'] ?? '';

        $formArr = [];
        if ($handle == 'form') {
            foreach ($data['message']['email_sent'] as $tmp) {
                if ($tmp['id'] == $formId) {
                    $tmp['value'] = $update['value'];
                }
                $formArr[] = $tmp;
            }
            $data['message']['email_sent'] = $formArr;
            apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);
        }
        if ($handle == 'checkbox') {
            $checkbox = json_decode($checkbox, true);
        }
        if ($handle == 'field' || $handle == 'message' || $handle == 'checkbox') {
            $newData = [];
            $d = [];
            $fd = [];

            foreach ($data['builder'] as $tmp) {
                if ($tmp['id'] == $groupId) {
                    foreach ($tmp['grid'] as $gridData) {
                        if ($gridData['id'] == $gridId) {
                            foreach ($gridData['forms'] as $form) {
                                $fc = [];
                                if ($form['id'] == $formId) {
                                    $form['err_msg'] = $update['value'];
                                    if ($handle == 'message') {
                                        $form['message'] = $update['message'];
                                    }
                                    if ($handle == 'checkbox') {
                                        foreach ($form['options'] as $option) {
                                            if ($option['id'] == $checkbox['id']) {
                                                $option['err_msg'] = $checkbox['value'];
                                            }
                                            $fc[] = $option;
                                        }
                                        $form['options'] = $fc;
                                    }
                                }
                                $fd[] = $form;
                            }
                            $gridData['forms'] = $fd;
                        }
                        $d[] = $gridData;
                    }
                    $tmp['grid'] = $d;
                }
                $newData[] = $tmp;
            }

            $data['builder'] = $newData;
            apply_filters(HUMMELT_THEME_V3_SLUG . '/update_form', $data, $form_id);
        }
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function duplicate_forms(): object
    {
        $id = filter_var($this->request->get_param('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $args = sprintf('WHERE id=%d', $id);
        $form = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_form_builder', $args);
        if (!$form->status) {
            $this->responseJson->msg = 'Formular nicht gefunden. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        $form = $form->record;

        $fbId = 'FB' . uniqid();
        $form['form_id'] = $fbId;
        $form['designation'] = $form['designation'] . ' - copy';
        $form['form']['id'] = $fbId;
        $form['form']['name'] = $form['designation'];

        unset($form['id']);
        unset($form['created_at']);
        $insert = apply_filters(HUMMELT_THEME_V3_SLUG . '/set_form_builder', $form);
        if (!$insert->status) {
            $this->responseJson->msg = 'Kopieren fehlgeschlagen. (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $this->responseJson->status = true;
        $this->responseJson->msg = 'Kopie erfolgreich erstellt. (rest ' . __LINE__ . ')';
        return $this->responseJson;
    }

    private function delete_form_builder(): object
    {
        $id = filter_var($this->request->get_param('id'), FILTER_VALIDATE_INT);
        if (!$id) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }
        apply_filters(HUMMELT_THEME_V3_SLUG . '/delete_form_builder', $id);
        $this->responseJson->status = true;
        $this->responseJson->msg = 'Form Builder erfolgreich gelöscht und alle Seiten aktualisiert.';
        $this->responseJson->title = 'Form-Builder gelöscht';
        return $this->responseJson;
    }

    private function get_email_settings(): object
    {
        $this->responseJson->email_settings = get_option(HUMMELT_THEME_V3_SLUG . '/smtp_settings');
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function set_email_settings(): object
    {
        $data = filter_var($this->request->get_param('data'), FILTER_UNSAFE_RAW);
        if (!$data) {
            $this->responseJson->msg = 'Ajax transmission error (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $data = json_decode($data, true);
        $data['status'] = filter_var($data['status'], FILTER_VALIDATE_BOOLEAN);
        $data['active'] = filter_var($data['active'], FILTER_VALIDATE_BOOLEAN);
        $data['email_save_active'] = filter_var($data['email_save_active'], FILTER_VALIDATE_BOOLEAN);
        $data['email_reply_to'] = filter_var($data['email_reply_to'], FILTER_VALIDATE_EMAIL);
        $data['test_msg'] = filter_var($data['test_msg'], FILTER_UNSAFE_RAW);
        $data['smtp_host'] = filter_var($data['smtp_host'], FILTER_UNSAFE_RAW);
        $data['smtp_auth_active'] = filter_var($data['smtp_auth_active'], FILTER_VALIDATE_BOOLEAN);
        $data['smtp_port'] = filter_var($data['smtp_port'], FILTER_VALIDATE_INT);
        $data['email_username'] = filter_var($data['email_username'], FILTER_UNSAFE_RAW);
        $data['email_password'] = filter_var($data['email_password'], FILTER_UNSAFE_RAW);
        $data['smtp_secure'] = filter_var($data['smtp_secure'], FILTER_UNSAFE_RAW);
        $data['smtp_from_email'] = filter_var($data['smtp_from_email'], FILTER_VALIDATE_EMAIL);
        $data['smtp_from_name'] = filter_var($data['smtp_from_name'], FILTER_UNSAFE_RAW);
        update_option(HUMMELT_THEME_V3_SLUG . '/smtp_settings', $data);
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function email_smtp_test(): object
    {

        $smtpTest = apply_filters(HUMMELT_THEME_V3_SLUG . '/smtp_test', null);
        $this->responseJson->msg = $smtpTest['msg'];
        $this->responseJson->status = $smtpTest['status'];
        $emailSettings = get_option(HUMMELT_THEME_V3_SLUG . '/smtp_settings');
        $emailSettings['status'] = $smtpTest['status'];
        update_option(HUMMELT_THEME_V3_SLUG . '/smtp_settings', $emailSettings);
        return $this->responseJson;

    }

    private function send_test_email(): object
    {
        $email = filter_var($this->request->get_param('email'), FILTER_VALIDATE_EMAIL);
        if (!$email) {
            $this->responseJson->msg = 'Ungültige E-Mail-Adresse (rest ' . __LINE__ . ')';
            return $this->responseJson;
        }

        $message = '<p>Test E-Mail</p>';
        $headers[] = 'From: ' . get_bloginfo('name') . '  <' . get_option('admin_email') . '>';
        $send = wp_mail($email, 'Test-Email', $message, $headers, $attachments = array());
        if ($send) {
            $this->responseJson->status = true;
            $this->responseJson->msg = 'E-Mail gesendet';
        } else {
            $errorLog = json_decode(get_option(HUMMELT_THEME_V3_SLUG . '/mail_error'), true);
            if (isset($errorLog['errors']['wp_mail_failed'])) {
                $this->responseJson->msg = implode(',', $errorLog['errors']['wp_mail_failed']);
            } else {
                $this->responseJson->msg = 'E-Mail wurde nicht gesendet';
            }
        }
        $emailSettings = get_option(HUMMELT_THEME_V3_SLUG . '/smtp_settings');
        $emailSettings['test_msg'] = '';
        update_option(HUMMELT_THEME_V3_SLUG . '/smtp_settings', $emailSettings);
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

    private function search_group_element($data, $elementId)
    {
        foreach ($data['builder'] as $tmp) {
            if ($tmp['id'] == $elementId) {
                return $tmp;
            }
        }

        return [];
    }

    private function get_builder_form_fields($form_id, $id = null): array
    {
        if (!$data = $this->get_form($form_id)) {
            return [];
        }
        $optionsArr = ['switch', 'radio', 'checkbox', 'select'];
        $arr = [];
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    if ($id && $form['id'] == $id) {
                        return [
                            'is_option' => in_array($form['type'], $optionsArr),
                            'form' => $form
                        ];
                    }

                    $item = [
                        'is_option' => in_array($form['type'], $optionsArr),
                        'form' => $form
                    ];
                    $arr[] = $item;
                }
            }
        }
        return $arr;
    }

    private function search_grid_element($data, $elementId)
    {
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                if ($grid['id'] == $elementId) {
                    return $grid;
                }
            }
        }

        return [];
    }

    private function search_form_item($data, $elementId)
    {
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    if ($form['id'] == $elementId) {
                        return $form;
                    }
                }
            }
        }

        return [];
    }

    private function check_input_data($data, $formData): array
    {
        global $themeV3Helper;
        // $slug = str_replace([' ', '-', ',', '.', '(', ')', '/', '\\'], '', $formData['slug']);
        $reg = '@[^A-Za-z0-9_]@';
        $slug = preg_replace($reg, '', $formData['slug']);
        $selects = 0;
        $checkData = [];

        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    if ($form['id'] == $formData['id']) {
                        if ($formData['type'] == 'select' && isset($formData['config']['send_email'])) {
                            $checkSend = $this->check_email_selects($data);
                            if ($checkSend) {
                                $formData['config']['send_email'] = false;
                            }
                        }

                        $checkSlug = $this->check_config_slug($data, $slug);
                        if ($checkSlug) {
                            $formData['slug'] = $formData['slug'] . '_' . $themeV3Helper->generate_callback_pw(5, 0, 5);
                        }
                        $checkData = $formData;
                    }
                }
            }
        }

        return $checkData;
    }

    private function check_email_selects($data): bool
    {

        $count = 0;
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    if (isset($form['config']['send_email']) && $form['config']['send_email']) {
                        $count++;
                    }
                }
            }
        }

        return $count > 1;
    }

    private function check_config_slug($data, $slug): bool
    {
        $count = 0;
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    if ($form['slug'] == $slug) {
                        $count++;
                    }
                }
            }
        }
        return $count > 0;
    }

    private function check_config_date($data, $formData): array
    {
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {

                    if ($form['id'] == $formData['id']) {
                        if ($formData['config']['date_type'] == 'date') {
                            if ($formData['config']['date_min']) {
                                $formData['config']['date_min'] = date('Y-m-d', strtotime($formData['config']['date_min']));
                            }
                            if ($formData['config']['date_min']) {
                                $formData['config']['date_max'] = date('Y-m-d', strtotime($formData['config']['date_max']));
                            }
                        }
                        if ($formData['config']['date_type'] == 'time') {
                            if ($formData['config']['date_min']) {
                                $formData['config']['date_min'] = date('H:i', strtotime($formData['config']['date_min']));
                            }
                            if ($formData['config']['date_min']) {
                                $formData['config']['date_max'] = date('H:i', strtotime($formData['config']['date_max']));
                            }
                        }
                        if ($formData['config']['date_type'] == 'month') {
                            if ($formData['config']['date_min']) {
                                $formData['config']['date_min'] = date('Y-m', strtotime($formData['config']['date_min']));
                            }
                            if ($formData['config']['date_min']) {
                                $formData['config']['date_max'] = date('Y-m', strtotime($formData['config']['date_max']));
                            }
                        }
                        if ($formData['config']['date_type'] == 'datetime-local') {
                            if ($formData['config']['date_min']) {
                                $formData['config']['date_min'] = date('Y-m-d\TH:i', strtotime($formData['config']['date_min']));
                            }
                            if ($formData['config']['date_min']) {
                                $formData['config']['date_max'] = date('Y-m-d\TH:i', strtotime($formData['config']['date_max']));
                            }
                        }
                    }
                }
            }
        }
        return $formData;
    }

    private function check_data_slug($data, $formData): string
    {
        $count = 0;
        global $themeV3Helper;
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    if ($formData['slug'] == $form['slug']) {
                        $count++;
                    }
                }
            }
        }
        if ($count > 1) {
            return Transliterator::urlize($formData['slug'], '_') . '_' . $themeV3Helper->generate_callback_pw(4, 0, 4);
        } else {
            return $formData['slug'];
        }
    }

    private function check_data_protection($data, $formData): array
    {
        $checkData = [];
        $regEx = '/.*?{(.+).*?}/';
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    if ($form['id'] == $formData['id']) {
                        if ($formData['type'] == 'privacy-check' && $formData['config']['url'] || $formData['config']['id'] && $formData['config']['default']) {
                            preg_match($regEx, $formData['config']['default'], $matches);
                            $placeholder = $matches[0] ?? null;
                            $text = $matches[1] ?? null;
                            if ($placeholder && $text) {
                                if ($formData['config']['new_tab']) {
                                    $tab = 'target="_blank"';
                                } else {
                                    $tab = '';
                                }
                                if ($formData['config']['id']) {
                                    $full_permalink = get_permalink($formData['config']['id']);
                                    $relative_permalink = str_replace(trailingslashit(site_url()), './', $full_permalink);
                                    if ($relative_permalink == './') {
                                        $relative_permalink = '/';
                                    }
                                    $formData['config']['url'] = $relative_permalink;
                                }
                                $link = sprintf('<a %s href="%s">%s</a>', $tab, $formData['config']['url'], $text);
                                $formData['config']['link'] = str_replace($placeholder, $link, $formData['config']['default']);
                            } else {
                                $formData['config']['link'] = $formData['config']['default'];
                            }
                        }
                        $checkData = $formData;
                    }
                }
            }
        }
        return $checkData;
    }

    private function search_form_options($data, $elementId): array
    {
        foreach ($data['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                foreach ($grid['forms'] as $form) {
                    foreach ($form['options'] as $option) {
                        if (isset($option['id']) && $option['id'] == $elementId) {
                            return $option;
                        }
                    }
                }
            }
        }

        return [];
    }

    private function form_condition_handle($data, $formId, $handle, $condition = null): array
    {

        $newData = [];
        foreach ($data as $tmp) {
            $d = [];
            foreach ($tmp['grid'] as $grid) {
                $fd = [];
                foreach ($grid['forms'] as $form) {

                    if ($form['id'] == $formId) {
                        if ($handle == 'add') {
                            $form['condition']['type'] = $condition;
                        }
                        if ($handle == 'delete') {
                            $form['condition'] = [];
                        }
                    }
                    $fd[] = $form;
                }
                $grid['forms'] = $fd;
                $d[] = $grid;
            }
            $tmp['grid'] = $d;
            $newData[] = $tmp;
        }

        return $newData;
    }

    private function set_prev_form($id): void
    {
        $this->responseJson->pref = 0;
        $this->responseJson->next = 0;
        $refCount = apply_filters(HUMMELT_THEME_V3_SLUG . '/count_form_builder_ref', '');
        if ($refCount) {
            $args = sprintf('WHERE form_id=%d ORDER BY created_at DESC', $id);
            $last = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_form_builder_ref', $args, true);
            if ($last->status) {
                $lastId = $last->record['id'];
                $nextPrev = apply_filters(HUMMELT_THEME_V3_SLUG . '/next_pref_ref', $lastId, $id);
                $this->responseJson->next = (int)$nextPrev['next'];
                $this->responseJson->prev = (int)$nextPrev['prev'];
            }
        }
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