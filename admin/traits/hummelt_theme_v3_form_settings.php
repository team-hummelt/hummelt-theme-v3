<?php

namespace Hummelt\ThemeV3;

defined('ABSPATH') or die();

trait hummelt_theme_v3_form_settings
{
    protected string $version = '1.0.0';

    protected function form_types($group = '', $type = '', $id = ''): array
    {
        $selectId = uniqid();
        $radioChecked = uniqid();
        $switchChecked = uniqid();
        $forms = [
            '0' => [
                'name' => 'Basic',
                'slug' => 'basic',
                'forms' => [
                    '0' => [
                        'id' => uniqid(),
                        'label' => 'Label Text',
                        'form_type' => 'textfeld',
                        'slug' => 'textfeld_' . $this->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'text',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'Text',
                        'icon' => 'bi bi-card-text',
                        'err_msg' => 'Dieses Feld muss ausgefüllt werden.',
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '1' => [
                        'id' => uniqid(),
                        'label' => 'Label E-Mail',
                        'form_type' => 'textfeld',
                        'slug' => 'email_' . $this->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'email',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'is_autoresponder' => true,
                        'select' => 'E-Mail',
                        'icon' => 'bi bi-envelope',
                        'err_msg' => 'Die eingegebene E-Mail-Adresse ist ungültig.',
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '2' => [
                        'id' => uniqid(),
                        'label' => 'Label Nummer',
                        'form_type' => 'textfeld',
                        'slug' => 'number_' . $this->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'number',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'Nummer',
                        'icon' => 'bi bi-123',
                        'err_msg' => 'Das Zahlenformat ist ungültig.',
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '3' => [
                        'id' => uniqid(),
                        'label' => 'Label Textarea',
                        'form_type' => 'textfeld',
                        'slug' => 'message_' . $this->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'textarea',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'Textarea',
                        'icon' => 'bi bi-textarea-t',
                        'err_msg' => 'Dieses Feld muss ausgefüllt werden.',
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'rows' => 4,
                            'height' => 100,
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '4' => [
                        'id' => uniqid(),
                        'label' => 'Label Url',
                        'form_type' => 'textfeld',
                        'slug' => 'url_' . $this->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'url',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'Url',
                        'icon' => 'bi bi-globe-americas',
                        'err_msg' => 'Die URL ist unzulässig.',
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '5' => [
                        'id' => uniqid(),
                        'label' => 'Label Telefon',
                        'form_type' => 'textfeld',
                        'slug' => 'phone_' . $this->generate_callback_pw(6, 0, 6),
                        'type' => 'phone',
                        'show_msg' => true,
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'Telefon',
                        'icon' => 'bi bi-telephone',
                        'err_msg' => 'Das Format ist ungültig.',
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '6' => [
                        'id' => uniqid(),
                        'label' => 'Passwort',
                        'form_type' => 'textfeld',
                        'slug' => 'password_' . $this->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'password',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'Passwort',
                        'icon' => 'bi bi-incognito',
                        'err_msg' => 'Dieses Feld muss ausgefüllt werden.',
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '7' => [
                        'id' => uniqid(),
                        'label' => 'Versteckt',
                        'form_type' => 'textfeld',
                        'slug' => 'hidden_' . $this->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'hidden',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'Versteckt',
                        'icon' => 'bi bi-eye-slash',
                        'err_msg' => '',
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '8' => [
                        'id' => uniqid(),
                        'label' => 'Button',
                        'form_type' => 'textfeld',
                        'slug' => 'button_' . $this->generate_callback_pw(6, 0, 6),
                        'show_msg' => false,
                        'type' => 'button',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'Button',
                        'icon' => 'bi bi-hand-index',
                        'err_msg' => '',
                        'condition' => [],
                        'options' => [
                            '0' => [
                                'type' => 'submit',
                                'name' => 'Submit',
                            ],
                            '1' => [
                                'type' => 'button',
                                'name' => 'Button',
                            ],
                            '2' => [
                                'type' => 'next',
                                'name' => 'nächste Seite',
                            ],
                            '3' => [
                                'type' => 'prev',
                                'name' => 'Vorherige Seite',
                            ],
                            '4' => [
                                'type' => 'reset',
                                'name' => 'Reset',
                            ],
                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => false,
                            'custom_class' => '',
                            'btn_type' => 'submit',
                            'btn_class' => 'btn btn-secondary'
                        ],
                    ],
                    '9' => [
                        'id' => uniqid(),
                        'label' => 'TinyMce',
                        'form_type' => 'textfeld',
                        'slug' => 'tinymce_' . $this->generate_callback_pw(6, 0, 6),
                        'type' => 'tinymce',
                        'show_msg' => true,
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'TinyMce',
                        'icon' => 'bi bi-text-indent-left',
                        'err_msg' => 'Dieses Feld muss ausgefüllt werden.',
                        'condition' => [],
                        'options' => [
                            '0' => [
                                'type' => 'restriktiv',
                                'name' => 'Restrictive',
                            ],
                            '1' => [
                                'type' => 'permissiv',
                                'name' => 'Permissiv',
                            ],
                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => '',
                            'sanitize' => 'permissiv'
                        ],
                    ],
                ],
            ],
            '1' => [
                'name' => 'Select',
                'slug' => 'select',
                'show_msg' => true,
                'forms' => [
                    '0' => [
                        'id' => uniqid(),
                        'label' => 'Select',
                        'form_type' => 'select',
                        'slug' => 'select_' . $this->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'select',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'Select',
                        'icon' => 'bi bi-caret-down',
                        'err_msg' => 'Es muss ein Feld ausgewählt werden.',
                        'condition' => [],
                        'options' => [
                            '0' => [
                                'default' => true,
                                'label' => 'bitte auswählen',
                                'value' => 'option_' . $selectId,
                                'id' => $selectId,
                            ]
                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => '',
                            'selected' => $selectId,
                            'standard' => false,
                            'send_email' => false,
                        ],
                    ],
                    '1' => [
                        'id' => uniqid(),
                        'label' => 'Checkbox',
                        'form_type' => 'select',
                        'slug' => 'checkbox_' . $this->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'checkbox',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'Checkbox',
                        'icon' => 'bi bi-toggle-on',
                        'err_msg' => 'Sie müssen dieser Bedingung zustimmen.',
                        'condition' => [],
                        'options' => [
                            '0' => [
                                'checked' => false,
                                'required' => false,
                                'err_msg' => 'Sie müssen dieser Bedingung zustimmen.',
                                'label' => 'Checkbox',
                                'value' => 'checkbox_' . (int)$this->generate_callback_pw(10, 0, 10),
                                'id' => uniqid(),
                            ]
                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => '',
                            'switch' => true,
                            'inline' => false,
                            'animated' => false,
                            'animated_color' => '#0165E7'
                        ],
                    ],
                    '2' => [
                        'id' => uniqid(),
                        'label' => 'Radio',
                        'form_type' => 'select',
                        'slug' => 'radio_' . $this->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'radio',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'Radio',
                        'icon' => 'bi bi-ui-radios',
                        'err_msg' => 'Es muss ein Feld ausgewählt werden.',
                        'condition' => [],
                        'options' => [
                            '0' => [
                                'checked' => true,
                                'default' => true,
                                'label' => 'Radio 1',
                                'value' => 'radio_' . $radioChecked,
                                'id' => $radioChecked,
                            ],
                            '1' => [
                                'checked' => false,
                                'default' => false,
                                'label' => 'Radio 2',
                                'value' => 'radio_' . (int)$this->generate_callback_pw(10, 0, 10),
                                'id' => uniqid(),
                            ]
                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => '',
                            'selected' => $radioChecked,
                            'standard' => false,
                            'inline' => false,
                        ],
                    ],
                    '3' => [
                        'id' => uniqid(),
                        'label' => 'Switch',
                        'form_type' => 'select',
                        'slug' => 'switch_' . $this->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'switch',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'Switch',
                        'icon' => 'bi bi-ui-radios-grid',
                        'err_msg' => ' Es muss ein Feld ausgewählt werden.',
                        'condition' => [],
                        'options' => [
                            '0' => [
                                'default' => true,
                                'label' =>  'Switch -1',
                                'value' => 'switch_' . $switchChecked,
                                'id' => $switchChecked,
                            ],
                            '1' => [
                                'default' => false,
                                'label' =>  'Switch -2',
                                'value' => 'switch_' . (int)$this->generate_callback_pw(10, 0, 10),
                                'id' => uniqid(),
                            ]
                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => '',
                            'btn_size' => 'normal',
                            'alignment' => 'horizontal',
                            'selected' => $switchChecked,
                            'standard' => false,
                            // 'send_email'=> false,
                        ],
                    ],
                    '4' => [
                        'id' => uniqid(),
                        'label' => 'Datum',
                        'form_type' => 'select',
                        'slug' => 'date_' . $this->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'date',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'Datum',
                        'icon' => 'bi bi-calendar-date',
                        'err_msg' => 'Das Datumsformat ist falsch.',
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => '',
                            'date_type' => 'date',
                            'date_min' => '',
                            'date_max' => '',
                            // 'send_email'=> false,
                        ],
                    ],
                    '5' => [
                        'id' => uniqid(),
                        'label' => 'Farbwähler',
                        'form_type' => 'textfeld',
                        'slug' => 'color_' . $this->generate_callback_pw(6, 0, 6),
                        'type' => 'color',
                        'show_msg' => true,
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'Farbwähler',
                        'icon' => 'bi bi-palette',
                        'err_msg' => 'Dieses Feld muss ausgefüllt werden.',
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '#ffffff',
                            'custom_class' => ''
                        ],
                    ],//Sie müssen die {Datenschutzerklärung} akzeptieren.
                    '6' => [
                        'id' => uniqid(),
                        'label' => 'Datenschutz',
                        'form_type' => 'select',
                        'slug' => 'privacy_check',
                        'show_msg' => true,
                        'type' => 'privacy-check',
                        'required' => true,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'Datenschutz',
                        'icon' => 'bi bi-toggle-off',
                        'err_msg' => 'Sie müssen dieser Bedingung zustimmen.',
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'selected' => false,
                            'placeholder' => '',
                            'new_tab' => false,
                            'default' => 'Datenschutzinformation gelesen und akzeptiert.',
                            'link' => '<a href="">Datenschutzinformation gelesen und akzeptiert.',
                            'url' => '',
                            'id' => '',
                            'custom_class' => '',
                            'switch' => false,
                            'inline' => false,
                            'animated' => false,
                            'animated_color' => '#0165E7'
                        ],
                    ],
                ]
            ],
            '2' => [
                'name' => 'File upload',
                'slug' => 'upload',
                'show_msg' => true,
                'forms' => [
                    '0' => [
                        'id' => uniqid(),
                        'label' => 'File upload',
                        'form_type' => 'upload',
                        'slug' => 'upload_' . $this->generate_callback_pw(6, 0, 6),
                        'type' => 'upload',
                        'show_msg' => false,
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'File upload',
                        'icon' => 'bi bi-upload',
                        'err_msg' => 'Die ausgewählte Datei ist ungültig.',
                        'condition' => [],
                        'options' => [],
                        'message' => [
                            //Datei auswählen
                            'drag_file_label' => 'Upload Text',
                            'drag_file_txt' => 'Dateien hier per Drag & Drop ablegen oder klicken.',
                            //erneut versuchen
                            //Datei ist zu groß
                            'file_large_label' => 'Datei ist zu groß',
                            'file_large_txt' => 'Datei ist zu groß ({{filesize}} MB). Maximale Dateigröße {{maxFilesize}} MB.' ,
                            //Maximale Dateigröße ist {filesize}
                            'max_filesize_label' => 'Maximale Dateigröße {{maxFilesize}} MB.',
                            'max_filesize_txt' => 'Maximale Dateigröße ist {{maxFiles}}',
                            //Maximale Uploads ({{maxFiles}}) überschritten.
                            'max_total_file_label' => 'Maximale Gesamtgröße der Datei',
                            'max_total_file_txt' => 'Maximale Uploads ({{maxFiles}}) überschritten.',
                            //Ungültiger Dateityp
                            'invalid_type_label' => 'Ungültiger Dateityp',
                            'invalid_type_txt' => 'Ungültiger Dateityp',

                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => [
                                'files' => []
                            ],
                            'custom_class' => '',
                            'show_btn' => true,
                            'datei_select_txt' => 'Datei auswählen',
                            'chunk_upload' => true,
                            'allowFileSizeValidation' => true,
                            'minFileSize' => '',
                            'maxTotalFileSize' => 10,
                            'maxFileSize' => 2,
                            'maxFiles' => 5,
                            'accept' => '.jpg,.jpeg,.png,.gif,.pdf',
                        ],
                    ]
                ]
            ],
            '3' => [
                'name' => 'Inhalt',
                'slug' => 'content',
                'show_msg' => true,
                'forms' => [
                    '0' => [
                        'id' => uniqid(),
                        'label' => 'HTML',
                        'form_type' => 'html',
                        'slug' => 'html_' . $this->generate_callback_pw(6, 0, 6),
                        'type' => 'html',
                        'show_msg' => false,
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'HTML',
                        'icon' => 'bi bi-code-square',
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '1' => [
                        'id' => uniqid(),
                        'label' => 'HR Tag',
                        'form_type' => 'html',
                        'slug' => 'hr_' . $this->generate_callback_pw(6, 0, 6),
                        'type' => 'hr',
                        'show_msg' => false,
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'HR Tag',
                        'icon' => 'bi bi-code-square',
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => 100,
                            'custom_class' => ''
                        ],
                    ],
                ]
            ],
            '4' => [
                'name' => 'Extra',
                'slug' => 'extra',
                'show_msg' => true,
                'forms' => [
                    '0' => [
                        'id' => uniqid(),
                        'label' => 'Slider',
                        'form_type' => 'extra',
                        'slug' => 'slider_' . $this->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'range',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'Slider',
                        'icon' => 'bi bi-sliders',
                        'err_msg' => 'Es muss ein Wert ausgewählt werden.',
                        'condition' => [],
                        'options' => [],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => 1,
                            'show_value' => true,
                            'min' => 0,
                            'max' => 100,
                            'step' => 1,
                            'prefix' => '',
                            'suffix' => '',
                            'custom_class' => ''
                        ],
                    ],
                    '1' => [
                        'id' => uniqid(),
                        'label' => 'Bewertung',
                        'form_type' => 'extra',
                        'slug' => 'rating_' . $this->generate_callback_pw(6, 0, 6),
                        'show_msg' => true,
                        'type' => 'rating',
                        'required' => false,
                        'hide_label' => false,
                        'floating' => false,
                        'select' => 'Bewertung',
                        'err_msg' => '',
                        'icon' => 'bi bi-star',
                        'condition' => [],
                        'options' => [
                            '0' => [
                                'icon' => 'bi bi-star',
                                'active' => 'bi bi-star-fill',
                                'id' => 'star',
                                'name' => 'star',
                            ],
                            '1' => [
                                'icon' => 'bi bi-heart',
                                'active' => 'bi bi-heart-fill',
                                'id' => 'heart',
                                'name' => 'Heart',
                            ],
                            '2' => [
                                'icon' => 'bi bi-emoji-neutral',
                                'active' => 'bi bi-emoji-smile-fill',
                                'id' => 'smiley',
                                'name' => 'Smiley',
                            ],
                            '3' => [
                                'icon' => 'bi bi-circle',
                                'active' => 'bi bi-circle-fill',
                                'id' => 'dot',
                                'name' => 'Dot',
                            ],
                            '4' => [
                                'icon' => 'bi bi-hand-thumbs-up',
                                'active' => 'bi bi-hand-thumbs-up-fill',
                                'id' => 'hand',
                                'name' => 'Hand',
                            ],
                        ],
                        'config' => [
                            'caption' => '',
                            'placeholder' => '',
                            'default' => 0,
                            'reset' => false,
                            'count' => 5,
                            'type' => 'star',
                            'icon' => 'bi bi-star',
                            'icon_active' => 'bi bi-star-fill',
                            'font_size' => '18px',
                            'distance' => '3px',
                            'color_fill' => '#FFAA00',
                            'color' => '#AFAFAF',
                            'custom_class' => ''
                        ],
                    ],
                ]
            ]
        ];
        if ($type) {
            foreach ($forms as $tmp) {
                foreach ($tmp['forms'] as $form) {
                    if ($form['type'] == $type) {
                        return $form;
                    }
                }
            }
        }
        if ($id) {
            foreach ($forms as $tmp) {
                foreach ($tmp['forms'] as $form) {
                    if ($form['id'] == $id) {
                        return $form;
                    }
                }
            }
        }
        if ($group) {
            foreach ($forms as $tmp) {
                if ($tmp['slug'] == $group) {
                    return $tmp;
                }
            }
        }
        return $forms;
    }

    protected function form_selects(): array
    {
        return [
            'group_size' => [
                '0' => [
                    'type' => 'btn-group-sm',
                    'name' => 'klein',
                ],
                '1' => [
                    'type' => 'normal',
                    'name' => 'normal',
                ],
                '2' => [
                    'type' => 'btn-group-lg',
                    'name' => 'groß',
                ]
            ],
            'group_alignment' => [
                '0' => [
                    'type' => 'horizontal',
                    'name' => 'horizontal',
                ],
                '1' => [
                    'type' => 'w-100',
                    'name' => 'volle Breite'
                ],
                '2' => [
                    'type' => 'vertikal',
                    'name' => 'vertikal',
                ],
                '3' => [
                    'type' => 'vertikal full-width',
                    'name' => 'vertikal volle Breite',
                ]
            ],
            'date_formats' => [
                '0' => [
                    'value' => 'date',
                    'label' => 'Datum',
                ],
                '1' => [
                    'value' => 'datetime-local',
                    'label' => 'Datum / Zeit',
                ],
                '2' => [
                    'value' => 'time',
                    'label' => 'Zeit',
                ],
                '3' => [
                    'value' => 'month',
                    'label' => 'Monat',
                ]
            ]
        ];
    }

    protected function rating_options_field($id = null): array
    {
        $return = [
            '0' => [
                'icon' => 'bi bi-star',
                'active' => 'bi bi-star-fill',
                'id' => 'star',
                'name' => 'star',
            ],
            '1' => [
                'icon' => 'bi bi-heart',
                'active' => 'bi bi-heart-fill',
                'id' => 'heart',
                'name' => 'Heart',
            ],
            '2' => [
                'icon' => 'bi bi-emoji-neutral',
                'active' => 'bi bi-emoji-smile-fill',
                'id' => 'smiley',
                'name' => 'Smiley',
            ],
            '3' => [
                'icon' => 'bi bi-circle',
                'active' => 'bi bi-circle-fill',
                'id' => 'dot',
                'name' => 'Dot',
            ],
            '4' => [
                'icon' => 'bi bi-hand-thumbs-up',
                'active' => 'bi bi-hand-thumbs-up-fill',
                'id' => 'hand',
                'name' => 'Hand',
            ],
        ];

        if ($id) {
            foreach ($return as $tmp) {
                if ($tmp['id'] == $id) {
                    return $tmp;
                }
            }
        }
        return $return;
    }

    protected function select_options_field(): array
    {

        $selectId = uniqid();
        return [
            'default' => false,
            'label' => 'Option-' . $selectId,
            'value' => 'option_' . $selectId,
            'id' => $selectId,
        ];
    }

    protected function checkbox_options_field(): array
    {

        $selectId = uniqid();
        return [
            'checked' => false,
            'label' => 'Checkbox-' . $selectId,
            'value' => 'checkbox_' . $selectId,
            'err_msg' => 'Sie müssen dieser Bedingung zustimmen.',
            'id' => $selectId,
        ];
    }

    protected function generate_callback_pw($passwordlength = 8, $numNonAlpha = 1, $numNumberChars = 3, $useCapitalLetter = true): string
    {
        $numberChars = '123456789';
        $specialChars = '!$&=;%?*-.+@_';
        //$specialChars = '!$%&=?*-:;.,+~@_';
        $secureChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';

        $stack = $secureChars;
        if ($useCapitalLetter) {
            $stack .= strtoupper($secureChars);
        }
        $count = $passwordlength - $numNonAlpha - $numNumberChars;
        $temp = str_shuffle($stack);
        $stack = substr($temp, 0, $count);
        if ($numNonAlpha > 0) {
            $temp = str_shuffle($specialChars);
            $stack .= substr($temp, 0, $numNonAlpha);
        }
        if ($numNumberChars > 0) {
            $temp = str_shuffle($numberChars);
            $stack .= substr($temp, 0, $numNumberChars);
        }
        return str_shuffle($stack);
    }
}