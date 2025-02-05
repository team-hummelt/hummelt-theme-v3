<?php

namespace Hummelt\ThemeV3;

use Hummelt_Theme_V3;
use WP_Error;
use WP_HTTP_Response;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

class hummelt_theme_v3_css_endpoint extends WP_REST_Controller
{
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
        $namespace = 'theme-v3-css/v' . HUMMELT_THEME_V3_VERSION;
        $base = '/';


        @register_rest_route(
            $namespace,
            $base,
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_registered_css_items'),
                'permission_callback' => array($this, 'permissions_check')
            )
        );

        @register_rest_route(
            $namespace,
            $base . '(?P<method>[\S^/]+)',
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'hummelt_theme_v3_get_css_api_rest_endpoint'),
                'permission_callback' => array($this, 'permissions_check')
            )
        );
    }

    public function get_registered_css_items(): WP_Error|WP_REST_Response|WP_HTTP_Response
    {
        $data = [];
        return rest_ensure_response($data);
    }

    public function hummelt_theme_v3_get_css_api_rest_endpoint(WP_REST_Request $request)
    {
        $method = $request->get_param('method');
        if (!$method) {
            return new WP_Error('rest_update_failed', __('Method not found.'), array('status' => 404));
        }
        $method = str_replace('-', '_', $method);
        if (!method_exists($this, $method)) {
            return new WP_Error('rest_failed', __('API Method not found.'), array('status' => 404, 'msg' => gmdate('H:i:s', current_time('timestamp')), 'type' => $method));
        }
        global $themeV3Helper;
        $return = call_user_func_array(self::class . '::' . $method, []);
        header('Content-Type: text/css; charset=UTF-8');
        header('Cache-Control: public, max-age=3600');
        echo $themeV3Helper->fn_compress_string($return);
        exit;
    }

    public function auto_generate_login_style(): string
    {
        global $themeV3Settings;
        $colors = $themeV3Settings->fn_hummelt_theme_v3_optionen('theme_design');
        $colors = $colors['theme_color'];
        return '
        body {
            font-size: 16px;
            background-color: #e0e0e0;
        }

        form#loginform, form#lostpasswordform {
            background-color: ' . $colors['login_site_bg'] . ';
            color: ' . $colors['login_site_color'] . ';
            border-radius: .5rem;
            border-color: #eaeaea;
            box-shadow: 0 5px 12px rgb(0 0 0 / 6%);
        }
        
        #login #wp-submit.button {
            background-color: ' . $colors['login_site_btn_bg'] . ';
            color: ' . $colors['login_site_btn_color'] . ';
            padding: 0 .5rem 0 2rem;
            border-color: #dcdcdc;
            -webkit-transition: all 350ms;
            -moz-transition: all 350ms;
            -o-transition: all 350ms;
            transition: all 350ms
        }
        
        #login #wp-submit.button:hover {
            background-color: ' . $colors['login_site_btn_bg'] . 'ea;
        }
        
        #login .btn-wrapper {
            position: relative;
            float: right;
        }
        
        #login .btn-wrapper:before {
            font-family: "FontAwesome", sans-serif;
            position: absolute;
            height: 100%;
            content: "\f090";
            font-size: 1.3rem;
            left: .5rem;
            top: 0;
            bottom: 0;
            color: ' . $colors['login_site_btn_color'] . ';
            z-index: 0;
        }
        
        .login #login_error, .login .message, .login .success {
            border-left: 4px solid #a9a9a9;
            color: ' . $colors['login_site_color'] . ';
            padding: 12px;
            margin-left: 0;
            margin-bottom: 20px;
            left: .5rem;
            background-color: ' . $colors['login_site_bg'] . ';
            box-shadow: 0 5px 12px rgba(0, 0, 0, .06)
        }
        
        .theme-login-footer {
            text-align: center;
            background-color: #e4e4e4;
            border-top: 1px solid #bfbfbf;
            position: fixed;
            right: 0;
            left: 0;
            bottom: 0;
            z-index: 1030;
            color: #6c757d;
            padding: 1rem 0;
        }
        
        .theme-login-footer .container {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .theme-login-footer .container a {
            color: #E11D2A;
            text-decoration: none;
            font-size: 16px;
        }
        
        .theme-login-footer .hupa-red {
            color: #e0222a;
        }
    ';
    }

    public function auto_generate_editor_style(): string
    {
        global $wp_filesystem;
        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $themeJson = HUMMELT_THEME_V3_JSON;
        $headlines = '';
        $maxWidth = '';
        if ($wp_filesystem->is_file($themeJson)) {
            $editorJson = json_decode($wp_filesystem->get_contents($themeJson), true);
            $elements = $editorJson['styles']['elements'];
            //print_r($editorJson['settings']['layout']);
            $maxWidth = $editorJson['settings']['layout']['wideSize'] .'!important';
            foreach ($elements as $key => $tmp) {
                $headlines .= '.editor-styles-wrapper '. $key . ':not(.wp-block-post-title){';
                if ($tmp['color']['text']) {
                    $headlines .= ' color: ' . $tmp['color']['text'] . ';';
                }
                if ($tmp['typography']['lineHeight']) {
                    $headlines .= ' line-height: ' . $tmp['typography']['lineHeight'] . ';';
                }
                if ($tmp['typography']['fontWeight']) {
                    $headlines .= ' font-weight: ' . $tmp['typography']['fontWeight'] . ';';
                }
                if ($tmp['typography']['fontSize']) {
                    $headlines .= ' font-size: ' . $tmp['typography']['fontSize'] . ';';
                }
                $headlines .= '} ';
            }
        }
        // echo $headlines;
        return '
        body :where(.editor-styles-wrapper) {
        word-break: break-word;
        /* background: #fff; */
        overflow-x: unset!important;
        }
        .editor-visual-editor {
        background-color: #ffffff !important;
        }
        .editor-styles-wrapper {
           max-width: '.$maxWidth.';
           margin: 0 auto;
        }
        :root :where(.editor-styles-wrapper)::after {
         content: "";
         display: block;
         height: 0!important;
         }
        ' . $headlines . '
        .editor-visual-editor__post-title-wrapper > :where(:not(.alignleft):not(.alignright):not(.alignfull)) {
            max-width: '.$maxWidth.';
            margin-left: auto !important;
            margin-right: auto !important;
        }
        .alignfull {
            width: 100vw!important;
            position: relative!important;
            left: 50% !important;
            margin-left: -50vw!important;
        }
        .components-flex.components-input-base.components-select-control {
           
        }

        .wp-block-spacer {
            background-color: #f5f5f5!important;
            position: relative;
        }
        
        .wp-block-spacer::before {
            display: flex !important;
            content: "Abstandshalter" !important;
            align-items: center !important;
            justify-content: center;
            font-size: 16px !important;
        }
        
        .wp-block-spacer.placeholder-shadow, .wp-block-spacer.placeholder-shadow-reverse {
            background-color: #ffdf80!important;
        }
        
        .placeholder-shadow::before {
            content: "Schatten" !important;
        }
        
        .placeholder-shadow-reverse::before {
            content: "Schatten reverse" !important;
        }
        
        .editor-styles-wrapper code { 
            font-family: monospace;
            direction: ltr;
            unicode-bidi: bidi-override;
            font-size: 1em;
            color: #d63384;
            word-wrap: break-word;
        }
        
        .editor-styles-wrapper .wp-block-heading {
            border: 1px solid #efefef!important;
            padding: .25rem;
        }
        
        .editor-styles-wrapper .wp-block-group {
            border: 1px solid #ffdcd9!important;
            padding: .25rem;
        }
        
        .editor-styles-wrapper .wp-block-columns {
            border: 1px solid #8bc34a!important;
            padding: .25rem;
        }
        
        .editor-styles-wrapper h5.cover-content { 
            position: relative;
            z-index: 1
        }
        
        .editor-styles-wrapper .wp-block-paragraph {
            border: 1px solid #efefef!important;
            padding: .25rem;
        }
        
        .editor-styles-wrapper .wp-block-columns {
            flex-wrap: wrap !important;
        }
        
        .block-editor-block-list__block.wp-block.wp-block-columns {
            flex-wrap: wrap !important;
            gap: unset !important;
            flex-direction: unset !important;
            align-items: unset !important;
            justify-content: unset !important;
        }

        .hupa-v3-theme-google-maps .tools-form-panel {
            display: flex;
            align-items: center;
        }
        .hupa-v3-theme-google-maps .hupa-tools-headline {
           display: inline-flex;
           align-items: center;
           font-weight: 500;
           padding: .5rem;
           border: 1px solid #bbb;
           border-radius: .25rem;
           margin-top: 0.5rem!important;
           font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
         }
        .hupa-v3-theme-google-maps .hupa-tools-headline:before  {
          font-family: dashicons, serif;
          content: \'\f18b\'; 
          color: #ea4335;
          padding-right: .25rem;
          font-size: 1.7rem;
          display: inline-block;
          margin-top: .1rem;
       }
        
        @media (min-width: 782px) {
            .wp-block-columns:not(.is-not-stacked-on-mobile) > .wp-block-column {
                flex-basis: unset !important;
                flex-grow: unset !important;
            }
        }
        ';
    }

    public function hummelt_theme_v3_autogenerate_css(): string
    {
        $css = 'body {
              font-family: Roboto, sans-serif;
              font-size: calc(18px + (20 - 18) * ((100vw - 320px) / (1920 - 320))) !important;
              background-color: #ffffff !important;
              font-style: normal;
              font-weight: normal;
              line-height: 1.5;
              color: #3c434a;
            
            }
        ';

        return $css;
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