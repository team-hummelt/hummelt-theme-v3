<?php

namespace Hummelt\ThemeV3;

trait hummelt_theme_v3_selects
{
    protected function select_align(): array
    {
        return [
            '0' => [
                'id' => 'start',
                'label' => 'links'
            ],
            '1' => [
                'id' => 'center',
                'label' => 'center'
            ],
            '2' => [
                'id' => 'end',
                'label' => 'rechts'
            ],
        ];
    }

    protected function select_user_role($value = ''): array
    {
        $return = [
            "0" => [
                'value' => 'read',
                'name' => __('Abonnent', 'bootscore'),
                'cap' => 'subscriber'
            ],
            "1" => [
                'value' => 'edit_posts',
                'name' => __('Mitarbeiter', 'bootscore'),
                'cap' => 'contributor'
            ],
            "2" => [
                'value' => 'publish_posts',
                'name' => __('Autor', 'bootscore'),
                'cap' => 'author'
            ],
            "3" => [
                'value' => 'publish_pages',
                'name' => __('Editor', 'bootscore'),
                'cap' => 'editor'
            ],
            "4" => [
                'value' => 'manage_options',
                'name' => __('Administrator', 'bootscore'),
                'cap' => 'administrator'
            ],
        ];
        if($value){
            foreach ($return as $tmp) {
                if($tmp['value'] == $value){
                    return $tmp;
                }
            }
        }
        return $return;
    }

    protected function select_bg_position(): array
    {
        return [
            '0' => [
                'id' => '',
                'label' => 'standard'
            ],
            '1' => [
                'id' => 'left top',
                'label' => 'links'
            ],
            '2' => [
                'id' => 'center top',
                'label' => 'center top'
            ],
            '3' => [
                'id' => 'right top',
                'label' => 'top rechts'
            ],
            '4' => [
                'id' => 'left center',
                'label' => 'center links'
            ],
            '5' => [
                'id' => 'center center',
                'label' => 'center center'
            ],
            '6' => [
                'id' => 'right center',
                'label' => 'rechts center'
            ],
            '7' => [
                'id' => 'left bottom',
                'label' => 'links unten'
            ],
            '8' => [
                'id' => 'right bottom',
                'label' => 'rechts unten'
            ],
        ];
    }

    protected function select_bg_style(): array
    {
        return [
            '0' => [
                'id' => '',
                'label' => 'standard'
            ],
            '1' => [
                'id' => 'cover',
                'label' => 'Cover'
            ],
            '2' => [
                'id' => 'contain',
                'label' => 'Contain'
            ],
            '3' => [
                'id' => 'no-repeat',
                'label' => 'No repeat'
            ],
            '4' => [
                'id' => 'repeat',
                'label' => 'Repeat'
            ],
        ];
    }

    protected function select_parallax_type(): array
    {
        return [
            '0' => [
                'id' => 'scroll',
                'label' => 'scroll'
            ],
            '1' => [
                'id' => 'scale',
                'label' => 'scale'
            ],
            '2' => [
                'id' => 'opacity',
                'label' => 'opacity'
            ],
            '3' => [
                'id' => 'scroll-opacity',
                'label' => 'scroll-opacity'
            ],
            '4' => [
                'id' => 'scale-opacity',
                'label' => 'scale-opacity'
            ],
        ];
    }

    protected function add_default_slider($bezeichnung): array
    {
        return [
            'id' => uniqid(),
            'designation' => $bezeichnung,
            "type" => "slide",
            "perPage" => 4,
            "container" => false,
            "thumbnail" => false,
            "perMove" => 4,
            "arrows" => true,
            "cover" => true,
            "keyboard" => true,
            "pauseOnFocus" => true,
            "drag" => true,
            "rewind" => true,
            "pauseOnHover" => true,
            "pagination" => false,
            "autoplay" => true,
            "lazyLoad" => "nearby",
            "gap" => "0.75rem",
            "preloadPages" => 1,
            "trimSpace" => "move",
            "interval" => 10000,
            "speed" => 900,
            "rewindSpeed" => 1200,
            "flickPower" => 500,
            "height" => '',
            "width" => '',
            "fixedWidth" => '',
            "fixedHeight" => '',
            "padding" => [
                "left" => "",
                "right" => "",
                "top" => "",
                "bottom" => "",
            ],
            'breakpoints' => [
                '0' => [
                    'id' => uniqid(),
                    "breakpoint" => 1400,
                    "perPage" => 3,
                    "perMove" => 3,
                    "gap" => "0.75rem",
                    "height" => '',
                    "width" => '',
                    "padding" => [
                        "left" => "",
                        "right" => "",
                        "top" => "",
                        "bottom" => "",
                    ]
                ]
            ]
        ];
    }

    protected function sanitize_slider($data): array
    {
        $return = [
            'id' => filter_var($data['id'], FILTER_UNSAFE_RAW),
            'designation' => filter_var($data['designation'], FILTER_UNSAFE_RAW),
            "type" => filter_var($data['type'], FILTER_UNSAFE_RAW),
            "perPage" => filter_var($data['perPage'], FILTER_VALIDATE_INT),
            "container" => filter_var($data['container'], FILTER_VALIDATE_BOOLEAN),
            "thumbnail" => filter_var($data['thumbnail'], FILTER_VALIDATE_BOOLEAN),
            "perMove" => filter_var($data['perMove'], FILTER_VALIDATE_INT),
            "arrows" => filter_var($data['arrows'], FILTER_VALIDATE_BOOLEAN),
            "cover" => filter_var($data['cover'], FILTER_VALIDATE_BOOLEAN),
            "keyboard" => filter_var($data['keyboard'], FILTER_VALIDATE_BOOLEAN),
            "pauseOnFocus" => filter_var($data['pauseOnFocus'], FILTER_VALIDATE_BOOLEAN),
            "drag" => filter_var($data['drag'], FILTER_VALIDATE_BOOLEAN),
            "rewind" => filter_var($data['rewind'], FILTER_VALIDATE_BOOLEAN),
            "pauseOnHover" => filter_var($data['pauseOnHover'], FILTER_VALIDATE_BOOLEAN),
            "pagination" => filter_var($data['pagination'], FILTER_VALIDATE_BOOLEAN),
            "autoplay" => filter_var($data['autoplay'], FILTER_VALIDATE_BOOLEAN),
            "lazyLoad" => filter_var($data['lazyLoad'], FILTER_UNSAFE_RAW),
            "gap" => filter_var($data['gap'], FILTER_UNSAFE_RAW),
            "preloadPages" => filter_var($data['preloadPages'], FILTER_VALIDATE_INT),
            "trimSpace" => filter_var($data['trimSpace'], FILTER_UNSAFE_RAW),
            "interval" => filter_var($data['interval'], FILTER_VALIDATE_INT),
            "speed" => filter_var($data['speed'], FILTER_VALIDATE_INT),
            "rewindSpeed" => filter_var($data['rewindSpeed'], FILTER_VALIDATE_INT),
            "flickPower" => filter_var($data['flickPower'], FILTER_VALIDATE_INT),
            "height" => filter_var($data['height'], FILTER_UNSAFE_RAW),
            "width" => filter_var($data['width'], FILTER_UNSAFE_RAW),
            "fixedWidth" => filter_var($data['fixedWidth'], FILTER_UNSAFE_RAW),
            "fixedHeight" => filter_var($data['fixedHeight'], FILTER_UNSAFE_RAW),
            "padding" => [
                "left" => filter_var($data['padding']['left'], FILTER_UNSAFE_RAW),
                "right" => filter_var($data['padding']['right'], FILTER_UNSAFE_RAW),
                "top" => filter_var($data['padding']['top'], FILTER_UNSAFE_RAW),
                "bottom" => filter_var($data['padding']['bottom'], FILTER_UNSAFE_RAW),
            ]
        ];
        $breakpoints = [];
        foreach ($data['breakpoints'] as $tmp) {
            $breakpoints[] = $this->sanitize_breakpoint($tmp);
        }
        $return['breakpoints'] = $breakpoints;
        return $return;

    }

    protected function sanitize_breakpoint($data): array
    {
        return ['id' => filter_var($data['id'], FILTER_UNSAFE_RAW),
            "breakpoint" => filter_var($data['breakpoint'], FILTER_VALIDATE_INT),
            "perPage" => filter_var($data['perPage'], FILTER_VALIDATE_INT),
            "perMove" => filter_var($data['perMove'], FILTER_VALIDATE_INT),
            "gap" => filter_var($data['gap'], FILTER_UNSAFE_RAW),
            "height" => filter_var($data['height'], FILTER_UNSAFE_RAW),
            "width" => filter_var($data['width'], FILTER_UNSAFE_RAW),
            "fixedWidth" => filter_var($data['fixedWidth'], FILTER_UNSAFE_RAW),
            "fixedHeight" => filter_var($data['fixedHeight'], FILTER_UNSAFE_RAW),
            "padding" => [
                "left" => filter_var($data['padding']['left'], FILTER_UNSAFE_RAW),
                "right" => filter_var($data['padding']['right'], FILTER_UNSAFE_RAW),
                "top" => filter_var($data['padding']['top'], FILTER_UNSAFE_RAW),
                "bottom" => filter_var($data['padding']['bottom'], FILTER_UNSAFE_RAW),
            ]
        ];
    }

    protected function add_default_breakpoint(): array
    {
        return [
            'id' => uniqid(),
            "breakpoint" => 1400,
            "perPage" => 3,
            "perMove" => 3,
            "gap" => "0.75rem",
            "height" => '',
            "width" => '',
            "fixedWidth" => '',
            "fixedHeight" => '',
            "padding" => [
                "left" => "",
                "right" => "",
                "top" => "",
                "bottom" => "",
            ]
        ];
    }

    protected function gallery_default_breakpoints($bezeichnung): array
    {
        return [
            'id' => uniqid(),
            'galleryType' => 'gallery',
            'designation' => $bezeichnung,
            'description' => '',
            'width' => 260,
            'height' => 160,
            'size' => 'medium',
            'animation' => '',
            'crop' => true,
            'show_designation' => false,
            'show_description' => false,
            'lazy_load' => true,
            'lazy_load_animation' => false,
            'animation_repeat' => true,
            'breakpoints' => [
                'xxl' => [
                    'id' => 'xxl',
                    'breakpoint' => 1400,
                    'columns' => 5,
                    'gutter' => 1,
                ],
                'xl' => [
                    'id' => 'xl',
                    'breakpoint' => 1200,
                    'columns' => 5,
                    'gutter' => 1,
                ],
                'lg' => [
                    'id' => 'lg',
                    'breakpoint' => 992,
                    'columns' => 4,
                    'gutter' => 1,
                ],
                'md' => [
                    'id' => 'md',
                    'breakpoint' => 768,
                    'columns' => 3,
                    'gutter' => 1,
                ],
                'sm' => [
                    'id' => 'sm',
                    'breakpoint' => 576,
                    'columns' => 2,
                    'gutter' => 1,
                ],
                'xs' => [
                    'id' => 'xs',
                    'breakpoint' => 450,
                    'columns' => 2,
                    'gutter' => 1,
                ],
            ]
        ];
    }

    protected function gallery_sanitize($data): array
    {
        return [
            'id' => filter_var($data['id'], FILTER_UNSAFE_RAW),
            'galleryType' => filter_var($data['galleryType'], FILTER_UNSAFE_RAW),
            'designation' => filter_var($data['designation'], FILTER_UNSAFE_RAW),
            'description' => filter_var($data['description'], FILTER_UNSAFE_RAW),
            'width' => filter_var($data['width'], FILTER_VALIDATE_INT),
            'height' => filter_var($data['height'], FILTER_VALIDATE_INT),
            'size' => filter_var($data['size'], FILTER_UNSAFE_RAW),
            'animation' => filter_var($data['animation'], FILTER_UNSAFE_RAW),
            'crop' => filter_var($data['crop'], FILTER_VALIDATE_BOOLEAN),
            'show_designation' => filter_var($data['show_designation'], FILTER_VALIDATE_BOOLEAN),
            'show_description' => filter_var($data['show_description'], FILTER_VALIDATE_BOOLEAN),
            'lazy_load' => filter_var($data['lazy_load'], FILTER_VALIDATE_BOOLEAN),
            'lazy_load_animation' => filter_var($data['lazy_load_animation'], FILTER_VALIDATE_BOOLEAN),
            'animation_repeat' => filter_var($data['animation_repeat'], FILTER_VALIDATE_BOOLEAN),
            'breakpoints' => [
                'xxl' => [
                    'id' => 'xxl',
                    'breakpoint' => 1400,
                    'columns' => filter_var($data['breakpoints']['xxl']['columns'], FILTER_VALIDATE_INT),
                    'gutter' => filter_var($data['breakpoints']['xxl']['gutter'], FILTER_VALIDATE_INT),
                ],
                'xl' => [
                    'id' => 'xl',
                    'breakpoint' => 1200,
                    'columns' => filter_var($data['breakpoints']['xl']['columns'], FILTER_VALIDATE_INT),
                    'gutter' => filter_var($data['breakpoints']['xl']['gutter'], FILTER_VALIDATE_INT),
                ],
                'lg' => [
                    'id' => 'lg',
                    'breakpoint' => 992,
                    'columns' => filter_var($data['breakpoints']['lg']['columns'], FILTER_VALIDATE_INT),
                    'gutter' => filter_var($data['breakpoints']['lg']['gutter'], FILTER_VALIDATE_INT),
                ],
                'md' => [
                    'id' => 'md',
                    'breakpoint' => 768,
                    'columns' => filter_var($data['breakpoints']['md']['columns'], FILTER_VALIDATE_INT),
                    'gutter' => filter_var($data['breakpoints']['md']['gutter'], FILTER_VALIDATE_INT),
                ],
                'sm' => [
                    'id' => 'sm',
                    'breakpoint' => 576,
                    'columns' => filter_var($data['breakpoints']['sm']['columns'], FILTER_VALIDATE_INT),
                    'gutter' => filter_var($data['breakpoints']['sm']['gutter'], FILTER_VALIDATE_INT),
                ],
                'xs' => [
                    'id' => 'xs',
                    'breakpoint' => 450,
                    'columns' => filter_var($data['breakpoints']['xs']['columns'], FILTER_VALIDATE_INT),
                    'gutter' => filter_var($data['breakpoints']['xs']['gutter'], FILTER_VALIDATE_INT),
                ],
            ]
        ];
    }

    protected function gallery_default_image(): array
    {
        return [
            'id' => uniqid(),
            'name' => '',
            'img_id' => '',
            'img_type' => '',
            'img_alt' => '',
            'img_title' => '',
            'img_description',
            'designation' => '',
            'description' => '',
            'width' => 260,
            'height' => 160,
            'size' => 'medium',
            'animation' => '',
            'url_type' => 'lightbox',
            'url' => '',
            'lightbox_type' => 'slide',
            'gallery_settings' => true,
            'crop' => true,
            'show_designation' => false,
            'show_description' => false,
            'new_tab' => false,
            'lazy_load' => true,
            'lazy_load_animation' => false,
        ];
    }

    protected function select_order_default(): array
    {
        return [
            '0' => [
                'id' => 'asc',
                'label' => 'ASC'
            ],
            '1' => [
                'id' => 'desc',
                'label' => 'DESC'
            ]
        ];
    }

    private function default_custom_field_selects(): array
    {
        return [
            '0' => [
                'id' => 'text',
                'label' => 'Text'
            ],
            '1' => [
                'id' => 'mailto',
                'label' => 'mailto'
            ],
            '2' => [
                'id' => 'tel',
                'label' => 'tel'
            ],
            '3' => [
                'id' => 'url',
                'label' => 'url'
            ],
        ];
    }

    protected function select_video_extern_types(): array
    {
        return [
            '0' => [
                'id' => 'youtube',
                'label' => 'YouTube'
            ],
            '1' => [
                'id' => 'vimeo',
                'label' => 'Vimeo'
            ],
            '2' => [
                'id' => 'url',
                'label' => 'Url'
            ]
        ];
    }

    protected function default_video_entry(): array
    {
        return [
            'id' => uniqid(),
            'video_title' => '',
            'video_url' => '',
            'extern_title' => false,
            'extern_type' => '',
            'extern_id' => '',
            'media_id' => '',
            'extern_url' => '',
            'cover_url' => '',
        ];
    }

    protected function tools_plugins_menu(): array
    {
        return [
            '0' => [
                'id' => 'medien-slider',
                'first' => '',
                'first-label' => '',
                'label' => 'Slider',
                'headline' => 'Slider',
                'icon' => 'bi-arrow-left-right',
                'sub' => []
            ],
            '1' => [
                'id' => 'custom-fields',
                'first' => '',
                'first-label' => '',
                'label' => 'Custom Fields',
                'headline' => 'Custom Fields',
                'icon' => 'bi-alt',
                'sub' => []
            ],
            '2' => [
                'id' => 'maps',
                'first' => 'gmaps-api',
                'first-label' => 'G-Maps API',
                'label' => 'Maps',
                'headline' => 'Map',
                'icon' => 'bi bi-pin',
                'sub' => [
                    '0' => [
                        'id' => 'gmaps-api',
                        'label' => 'G-Maps API',
                        'headline' => 'G-Maps API',
                    ],
                    '1' => [
                        'id' => 'open-street-leaflet',
                        'label' => 'OSM Leaflet',
                        'headline' => 'OpenStreetMap Leaflet',
                    ],
                    '2' => [
                        'id' => 'maps-ds',
                        'label' => 'Map Datenschutz',
                        'headline' => 'Map Datenschutz',
                    ],
                ]
            ],
            '3' => [
                'id' => 'top-area',
                'first' => '',
                'first-label' => 'Einstellungen',
                'label' => 'Top-Area',
                'headline' => 'Top-Area ',
                'icon' => 'bi-collection',
                'sub' => []
            ],

        ];
    }

    protected function option_sidebar_menu(): array
    {
        return [
            '0' => [
                'id' => 'allgemein',
                'first' => 'layout',
                'first-label' => 'Layout',
                'label' => 'Allgemein',
                'headline' => 'Allgemein',
                'icon' => 'bi-tools',
                'sub' => [
                    '0' => [
                        'id' => 'layout',
                        'label' => 'Layout',
                        'headline' => 'Layout',
                    ],
                    '1' => [
                        'id' => 'logo-favicon',
                        'label' => 'Logo Favicon',
                        'headline' => 'Logo Favicon',
                    ],
                ]
            ],
            '1' => [
                'id' => 'template-einstellungen',
                'first' => '',
                'first-label' => '',
                'label' => 'Template Einstellungen',
                'headline' => 'Template Einstellungen',
                'icon' => 'bi-gear',
                'cap' => 'template-settings',
                'sub' => [

                ]
            ],
            '2' => [
                'id' => 'schriften',
                'first' => 'headlines',
                'first-label' => 'Überschriften',
                'label' => 'Schriften',
                'headline' => 'Schriften',
                'icon' => 'bi-fonts',
                'cap' => 'font-settings',
                'sub' => [
                    '0' => [
                        'id' => 'headlines',
                        'label' => 'Überschriften',
                        'headline' => 'Überschriften',
                    ],
                    '1' => [
                        'id' => 'body',
                        'label' => 'Body | Menü | Button',
                        'headline' => 'Body | Menü | Button',
                    ],
                    '2' => [
                        'id' => 'top-area',
                        'label' => 'Top Area | Footer',
                        'headline' => 'Top Area | Footer',
                    ],
                    '3' => [
                        'id' => 'fonts',
                        'label' => 'Fonts ',
                        'headline' => 'Fonts ',
                        'cap' => 'font-upload',
                    ],
                ]
            ],
            '3' => [
                'id' => 'farben',
                'first' => 'bg-color',
                'first-label' => 'Hintergrundfarben',
                'label' => 'Farben',
                'headline' => 'Farben',
                'icon' => 'bi-palette',
                'cap' => 'farben',
                'sub' => [
                    '0' => [
                        'id' => 'bg-color',
                        'label' => 'Hintergrundfarben',
                        'headline' => 'Hintergrundfarben',
                    ],
                    '1' => [
                        'id' => 'menu-color',
                        'label' => 'Menü Farben',
                        'headline' => 'Menü Farben',
                    ],
                    '2' => [
                        'id' => 'login-seite',
                        'label' => 'Login Seite',
                        'headline' => 'Login Seite',
                    ],
                    '3' => [
                        'id' => 'sonstige',
                        'label' => 'sonstige',
                        'headline' => 'Sonstige',
                    ],
                ]
            ],
            '4' => [
                'id' => 'gutenberg',
                'first' => 'gutenberg',
                'first-label' => 'Einstellungen',
                'label' => 'Gutenberg',
                'headline' => 'Gutenberg',
                'icon' => 'bi-wordpress',
                'cap' => 'gutenberg-layout',
                'sub' => [

                ]
            ],
            '5' => [
                'id' => 'optionen',
                'first' => '',
                'first-label' => '',
                'label' => 'Optionen',
                'headline' => 'Optionen',
                'icon' => 'bi-wordpress',
                'cap' => 'wordpress-optionen',
                'sub' => []
            ],
          /*  '6' => [
                'id' => 'reset',
                'first' => '',
                'first-label' => '',
                'label' => 'Reset',
                'headline' => 'Reset',
                'icon' => 'bi-arrow-repeat',
                'sub' => []
            ],
            '7' => [
                'id' => 'info',
                'first' => '',
                'first-label' => '',
                'label' => 'Info',
                'headline' => 'Info',
                'icon' => 'bi-info-circle',
                'sub' => []
            ],*/
        ];
    }

    protected function theme_optionen_sidebar(): array
    {
        return [
            '0' => [
                'id' => 'config',
                'first' => '',
                'first-label' => '',
                'label' => 'WP-Config',
                'headline' => 'WP-Config',
                'icon' => 'bi-tools',
                'sub' => []
            ],
            '1' => [
                'id' => 'update-notizen',
                'first' => '',
                'first-label' => '',
                'label' => 'Update Notizen',
                'headline' => 'Update Notizen',
                'icon' => 'bi-wordpress',
                'sub' => []
            ],
            '2' => [
                'id' => 'post-pages',
                'first' => 'sortable',
                'first-label' => 'Sortieren',
                'label' => 'Beiträge',
                'headline' => 'Beiträge',
                'icon' => 'bi-arrows-move',
                'sub' => [
                    '0' => [
                        'id' => 'sortable',
                        'label' => 'Sortieren',
                        'headline' => 'Sortieren',
                    ],
                    '1' => [
                        'id' => 'duplicate',
                        'label' => 'Duplizieren',
                        'headline' => 'Duplizieren',
                    ],
                ]
            ]
        ];
    }

    protected function menu_breakpoints_select($width = null): array
    {
        $return = [
            '0' => [
                'value' => 'md',
                'label' => 'md',
                'width' => 768
            ],
            '1' => [
                'value' => 'lg',
                'label' => 'lg',
                'width' => 992
            ],
            '2' => [
                'value' => 'xl',
                'label' => 'xl',
                'width' => 1200
            ],
            '3' => [
                'value' => 'xxl',
                'label' => 'xxl',
                'width' => 1400
            ],
        ];
        if ($width) {
            foreach ($return as $tmp) {
                if ($tmp['value'] == $width) {
                    return $tmp;
                }
            }
            return $return[2];
        }
        return $return;
    }

    protected function osm_tile_layers($args = ''): array
    {
        $return = [
            '0' => [
                'id' => 'original',
                'alt' => 'default',
                'loading' => 'lazy',
                'title' => 'openstreetmap.org',
                'width' => 800,
                'height' => 509,
                'src' => HUMMELT_THEME_V3_ADMIN_URL . 'assets/images/osm-tile-layers/orginal.jpg',
                'tiles_url' => 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'url_text' => 'contributors',
                'url_anbieter' => 'https://creativecommons.org/licenses/by-sa/2.0/'
            ],
            '1' => [
                'id' => 'originalde',
                'alt' => 'default',
                'loading' => 'lazy',
                'title' => 'openstreetmap.de',
                'width' => 800,
                'height' => 509,
                'src' => HUMMELT_THEME_V3_ADMIN_URL . 'assets/images/osm-tile-layers/osm_de.jpg',
                'tiles_url' => 'https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png',
                'url_text' => 'contributors',
                'url_anbieter' => 'https://creativecommons.org/licenses/by-sa/2.0/'
            ],
            '2' => [
                'id' => 'wikimedia',
                'alt' => 'wikimedia',
                'loading' => 'lazy',
                'title' => 'wikimedia.org',
                'width' => 800,
                'height' => 509,
                'src' => HUMMELT_THEME_V3_ADMIN_URL . 'assets/images/osm-tile-layers/wikimedia.jpg',
                'tiles_url' => 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
                'url_text' => 'wikimedia',
                'url_anbieter' => 'https://www.wikimedia.org/'
            ],
            '3' => [
                'id' => 'stadiamaps',
                'alt' => 'stadiamaps',
                'loading' => 'lazy',
                'title' => 'Stadia Map outdoors',
                'width' => 800,
                'height' => 509,
                'src' => HUMMELT_THEME_V3_ADMIN_URL . 'assets/images/osm-tile-layers/stadiamaps.jpg',
                'tiles_url' => 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png',
                'url_text' => 'Stadia Map',
                'url_anbieter' => 'https://stadiamaps.com/'
            ],
            '4' => [
                'id' => 'stadiamaps-osm_bright',
                'alt' => 'stadiamaps osm bright',
                'loading' => 'lazy',
                'title' => 'Stadia Map bright',
                'width' => 800,
                'height' => 509,
                'src' => HUMMELT_THEME_V3_ADMIN_URL . 'assets/images/osm-tile-layers/stadiamaps-osm_bright.jpg',
                'tiles_url' => 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}.png',
                'url_text' => 'Stadia Map',
                'url_anbieter' => 'https://stadiamaps.com/'
            ],
            '5' => [
                'id' => 'openrailwaymap',
                'alt' => 'openrailwaymap',
                'loading' => 'lazy',
                'title' => 'OpenRailwayMap',
                'width' => 800,
                'height' => 509,
                'src' => HUMMELT_THEME_V3_ADMIN_URL . 'assets/images/osm-tile-layers/openrailwaymap.jpg',
                'tiles_url' => 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}.png',
                'url_text' => 'OpenRailwayMap',
                'url_anbieter' => 'https://openrailwaymap.org/'
            ],
            '6' => [
                'id' => 'basemaps-cartocdn-light',
                'alt' => 'basemaps-cartocdn-light',
                'loading' => 'lazy',
                'title' => 'Carto light',
                'width' => 800,
                'height' => 509,
                'src' => HUMMELT_THEME_V3_ADMIN_URL . 'assets/images/osm-tile-layers/basemaps-cartocdn-light.jpg',
                'tiles_url' => 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                'url_text' => 'Carto',
                'url_anbieter' => 'https://basemaps.cartocdn.com/'
            ],
            '7' => [
                'id' => 'dark',
                'alt' => 'dark',
                'loading' => 'lazy',
                'title' => 'Carto dark',
                'width' => 800,
                'height' => 509,
                'src' => HUMMELT_THEME_V3_ADMIN_URL . 'assets/images/osm-tile-layers/dark.jpg',
                'tiles_url' => 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
                'url_text' => 'Carto',
                'url_anbieter' => 'https://basemaps.cartocdn.com/'
            ],
        ];

        if ($args) {
            foreach ($return as $tmp) {
                if ($tmp['id'] == $args) {
                    return $tmp;
                }
            }
        }
        return $return;
    }

    protected function selects_image_size(): array
    {
        return [
            '0' => [
                'label' => 'thumbnail',
                'value' => 'thumbnail'
            ],
            '1' => [
                'label' => 'medium',
                'value' => 'medium'
            ],
            '2' => [
                'label' => 'large',
                'value' => 'large'
            ],
            '3' => [
                'label' => 'full',
                'value' => 'full'
            ],
        ];
    }

    protected function get_animate_option(): array
    {
        $seekers = ["bounce", "flash", "pulse", "rubberBand", "shakeX", "headShake", "swing", "tada", "wobble", "jello", "heartBeat"];
        $entrances = ["backInDown", "backInLeft", "backInRight", "backInUp"];
        //$back_exits = array("backOutDown","backOutLeft","backOutRight","backOutUp");
        $bouncing = ["bounceIn", "bounceInDown", "bounceInLeft", "bounceInRight", "bounceInUp"];
        $fade = ["fadeIn", "fadeInDown", "fadeInDownBig", "fadeInLeft", "fadeInLeftBig", "fadeInRight", "fadeInRightBig", "fadeInUp", "fadeInUpBig", "fadeInTopLeft", "fadeInTopRight", "fadeInBottomLeft", "fadeInBottomRight"];
        $flippers = ["flip", "flipInX", "flipInY", "flipOutX", "flipOutY"];
        $lightspeed = ["lightSpeedInRight", "lightSpeedInLeft", "lightSpeedOutRight", "lightSpeedOutLeft"];
        $rotating = ["rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight"];
        $zooming = ["zoomIn", "zoomInDown", "zoomInLeft", "zoomInRight", "zoomInUp"];
        $sliding = ["slideInDown", "slideInLeft", "slideInRight", "slideInUp"];

        $ani_arr = [];
        for ($i = 0; $i < count($seekers); $i++) {
            $ani_item = [
                "animate" => $seekers[$i]
            ];
            $ani_arr[] = $ani_item;
        }
        $ani_arr[] = ["value" => '-', "animate" => '----', "divider" => true];

        for ($i = 0; $i < count($entrances); $i++) {
            $ani_item = [
                "animate" => $entrances[$i]
            ];
            $ani_arr[] = $ani_item;
        }

        $ani_arr[] = ["value" => '-', "animate" => '----', "divider" => true];

        for ($i = 0; $i < count($bouncing); $i++) {
            $ani_item = array(
                "animate" => $bouncing[$i]
            );
            $ani_arr[] = $ani_item;
        }

        $ani_arr[] = array("value" => '-', "animate" => '----', "divider" => true);

        for ($i = 0; $i < count($fade); $i++) {
            $ani_item = array(
                "animate" => $fade[$i]
            );
            $ani_arr[] = $ani_item;
        }

        $ani_arr[] = array("value" => '-', "animate" => '----', "divider" => true);

        for ($i = 0; $i < count($flippers); $i++) {
            $ani_item = array(
                "animate" => $flippers[$i]
            );
            $ani_arr[] = $ani_item;
        }

        $ani_arr[] = array("value" => '-', "animate" => '----', "divider" => true);

        for ($i = 0; $i < count($lightspeed); $i++) {
            $ani_item = array(
                "animate" => $lightspeed[$i]
            );
            $ani_arr[] = $ani_item;
        }

        $ani_arr[] = array("value" => '-', "animate" => '----', "divider" => true);

        for ($i = 0; $i < count($rotating); $i++) {
            $ani_item = array(
                "animate" => $rotating[$i]
            );
            $ani_arr[] = $ani_item;
        }

        $ani_arr[] = array("value" => '-', "animate" => '----', "divider" => true);

        for ($i = 0; $i < count($zooming); $i++) {
            $ani_item = array(
                "animate" => $zooming[$i]
            );
            $ani_arr[] = $ani_item;
        }

        $ani_arr[] = array("value" => '-', "animate" => '----', "divider" => true);

        for ($i = 0; $i < count($sliding); $i++) {
            $ani_item = array(
                "animate" => $sliding[$i]
            );
            $ani_arr[] = $ani_item;
        }

        return $ani_arr;
    }

    protected function select_custom_types():array
    {
        return [
           '0' => [
               'id' => 'text',
               'label' => 'Text'
           ],
            '1' => [
                'id' => 'mailto',
                'label' => 'mailto'
            ],
            '2' => [
                'id' => 'tel',
                'label' => 'tel'
            ],
            '3' => [
                'id' => 'url',
                'label' => 'url'
            ]
        ];
    }

    protected function default_custom_field($designation, $slug, $type):array
    {
        return [
            'id' => uniqid(),
            'designation' => $designation,
            'slug' => $slug,
            'extra_css' => '',
            'show_url' => 'url',
            'only_icon_display' => false,
            'icon_is_url' => false,
            'new_tab' => false,
            'icon_css' => '',
            'icon' => '',
            'link_type' => $type,
            'value' => ''
        ];
    }
    protected function sanitize_custom_field($data):array
    {
        return [
            'id' => sanitize_text_field($data['id']),
            'designation' => sanitize_text_field($data['designation']),
            'slug' => sanitize_text_field($data['slug']),
            'extra_css' => sanitize_text_field($data['extra_css']),
            'show_url' => sanitize_text_field($data['show_url']),
            'only_icon_display' => filter_var($data['only_icon_display'], FILTER_VALIDATE_BOOLEAN),
            'icon_is_url' => filter_var($data['icon_is_url'], FILTER_VALIDATE_BOOLEAN),
            'new_tab' => filter_var($data['new_tab'], FILTER_VALIDATE_BOOLEAN),
            'icon_css' => sanitize_text_field($data['icon_css']),
            'icon' => sanitize_text_field($data['icon']),
            'link_type' => sanitize_text_field($data['link_type']),
            'value' => sanitize_text_field($data['value']),
        ];
    }

    protected function top_area_widget_types($settings):array
    {
        $return = [
            '0' => [
                'label' => 'Top-Area Menü',
                'sublabel' => 'Top Menü',
                'order' => $settings['menu']['order'],
                'slug' => 'menu',
                'active' => false,
                'css' => '',
            ],
            '1' => [
                'label' => 'Top-Area Widget 1',
                'sublabel' => 'Widget Box',
                'order' => $settings['top-menu-1']['order'],
                'slug' => 'top-menu-1',
                'active' => false,
                'css' => '',
            ],
            '2' => [
                'label' => 'Top-Area Widget 2',
                'sublabel' => 'Widget Box',
                'order' => $settings['top-menu-2']['order'],
                'slug' => 'top-menu-2',
                'active' => false,
                'css' => '',
            ],
            '3' => [
                'label' => 'Top-Area Widget 3',
                'sublabel' => 'Widget Box',
                'order' => $settings['top-menu-3']['order'],
                'slug' => 'top-menu-3',
                'active' => false,
                'css' => '',
            ]
        ];
        global $themeV3Helper;
        return $themeV3Helper->order_by_args($return, 'order', 2);
    }
}