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
class hummelt_theme_v3_server_api
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

    public function fn_get_hummelt_theme_v3_plugins()
    {
        $conf = get_option(HUMMELT_THEME_V3_SLUG . '/theme_v3_config');
        $url = $conf['server_url'] . '/api/product?is_standalone=1';
        $response = wp_remote_get($url, [
            'headers' => [
                'Accept' => 'application/json',
            ],
        ]);

        $data = [];
        // Überprüfen, ob die Anfrage erfolgreich war
        if (is_wp_error($response)) {
            echo 'Fehler: ' . $response->get_error_message();
        } else {
            // Statuscode abrufen
            $status_code = wp_remote_retrieve_response_code($response);
            // JSON-Inhalt abrufen und dekodieren
            if ($status_code === 200) {
                $body = wp_remote_retrieve_body($response);
                $data = json_decode($body, true); // In ein Array dekodieren
            }
        }
        return $data;
    }

    public function fn_hummelt_theme_v3_get_license($license)
    {
        $conf = get_option(HUMMELT_THEME_V3_SLUG . '/theme_v3_config');
        $url = $conf['server_url'] . '/api/license/'.$license;
        $response = wp_remote_get($url, [
            'headers' => [
                'Accept' => 'application/json',
                'X-Origin-URL'=> site_url()
            ],
        ]);
        $data = [];
        // Überprüfen, ob die Anfrage erfolgreich war
        if (is_wp_error($response)) {
            echo 'Fehler: ' . $response->get_error_message();
        } else {
            // Statuscode abrufen
            $status_code = wp_remote_retrieve_response_code($response);
            // JSON-Inhalt abrufen und dekodieren
            if ($status_code === 200) {
                $body = wp_remote_retrieve_body($response);
                $data = json_decode($body, true); // In ein Array dekodieren
            }
        }
        return $data;
    }
}