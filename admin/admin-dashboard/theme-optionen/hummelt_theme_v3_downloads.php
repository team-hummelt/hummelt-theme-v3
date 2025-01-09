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

use finfo;
use Hummelt_Theme_V3;

class hummelt_theme_v3_downloads
{
    use hummelt_theme_v3_options;
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

    public function fn_hummelt_theme_v3_form_download($id, $type): void
    {
        if(!$id) {
            wp_die(__('Die angeforderte Datei wurde nicht gefunden oder ist nicht lesbar.', 'bootscore'). ' '.__LINE__);
        }

        $getType = 0;

        if($type) {
            $getType = 1;
        }
        global $wp_filesystem;
        $upload_dir = wp_get_upload_dir();
        $htaccess = 'Require all denied';
        $baseDir = $upload_dir['basedir'] . DIRECTORY_SEPARATOR . 'downloads' . DIRECTORY_SEPARATOR;
        if(!$wp_filesystem->is_dir($baseDir)) {
            $wp_filesystem->mkdir($baseDir);
            $wp_filesystem->put_contents($baseDir . '.htaccess', $htaccess);
        }
        if(!$wp_filesystem->exists($baseDir . '.htaccess')) {
            $wp_filesystem->put_contents($baseDir . '.htaccess', $htaccess);
        }

        $scanJson = $this->scan_directory_for_json($baseDir);
        if($scanJson){
            foreach ($scanJson as $tmp) {
                if($wp_filesystem->is_file($baseDir . $tmp)) {
                    $wp_filesystem->delete($baseDir . $tmp);
                }
            }
        }

        $args = sprintf('WHERE id=%d', $id);
        $form = apply_filters(HUMMELT_THEME_V3_SLUG.'/get_form_builder', $args);
        if(!$form->status) {
            wp_die(__('Die angeforderte Datei wurde nicht gefunden oder ist nicht lesbar.', 'bootscore'). ' '.__LINE__);
        }
        $form = $form->record;
        $json = json_encode($form['form'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_HEX_QUOT | JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);

        $filePath = $baseDir . 'form-builder-' . $form['form_id'].'.json';
        if(!$wp_filesystem->is_writable($baseDir) ) {
            wp_die(__('Die angeforderte Datei wurde nicht gefunden oder ist nicht lesbar.', 'bootscore'). ' '.__LINE__);
        }

        $wp_filesystem->put_contents($filePath, $json);
        if(!$wp_filesystem->exists($filePath) || !$wp_filesystem->is_readable($filePath)) {
            wp_die(__('Die angeforderte Datei wurde nicht gefunden oder ist nicht lesbar.', 'bootscore'). ' '.__LINE__);
        }
        $realPath = realpath($filePath);
        if (!str_starts_with($realPath, $upload_dir['basedir'])) {
            wp_die(__('Ungültiger Dateipfad.', 'bootscore'));
        }
        $mimeType = mime_content_type($filePath);

        header("Content-Type: $mimeType");
        switch ($getType) {
            case '0':
                header("Content-Type: $mimeType");
                header('Pragma: public');
                header('Expires: 0');
                header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
                header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
                header('Content-Length: ' . filesize($filePath));
                header('Content-Transfer-Encoding: binary');

                if (ob_get_level()) {
                    ob_end_clean();
                }
                flush();
                readfile($filePath);
                exit;
            case '1':
                if (ob_get_level()) {
                    ob_end_clean();
                }
                flush();
                readfile($filePath);
                break;
        }
    }

    public function fn_hummelt_theme_v3_download_email_attachment($file, $name,  $type = 0): void
    {
        if(!$file || !$name){
            wp_die(__('Die angeforderte Datei wurde nicht gefunden oder ist nicht lesbar.', 'bootscore'). ' '.__LINE__);
        }
        global $wp_filesystem;
        if (empty($wp_filesystem)) {
            require_once(ABSPATH . 'wp-admin/includes/file.php');
            WP_Filesystem();
        }
        if(!$wp_filesystem->is_file(HUMMELT_THEME_V3_DOWNLOAD_DIR . $file)) {
            wp_die(__('Die angeforderte Datei wurde nicht gefunden oder ist nicht lesbar.', 'bootscore'). ' '.__LINE__);
        }

        $fullsize_path = HUMMELT_THEME_V3_DOWNLOAD_DIR . $file;
        $mimeType = mime_content_type($fullsize_path);
        $ext = pathinfo($file, PATHINFO_EXTENSION);
        $fileName = $name . '.'. $ext;

        if (headers_sent()) {
            wp_die(__('Die Header wurden bereits gesendet. Datei kann nicht heruntergeladen werden.', 'bootscore'));
        }

        header('HTTP/1.1 200 OK');
        header("Content-Type: $mimeType");
        $type ? $getType = 1 : $getType = 0;
        switch ($getType) {
            case '0':
                header('Pragma: public');
                header('Expires: 0');
                header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
                header('Content-Disposition: attachment; filename="' . $fileName . '"');
                header('Content-Length: ' . filesize($fullsize_path));
                header('Content-Transfer-Encoding: binary');
                if (ob_get_level()) {
                    ob_end_clean();
                }
                flush();
                readfile($fullsize_path);
                break;
            case '1':
                if (ob_get_level()) {
                    ob_end_clean();
                }
                flush();
                readfile($fullsize_path);
                break;
        }
    }

    public function fn_hummelt_theme_v3_pdf_download($file, $type): void
    {
        if(!$file){
            wp_die(__('Die angeforderte Datei wurde nicht gefunden oder ist nicht lesbar.', 'bootscore'). ' '.__LINE__);
        }

        $fileObj = $this->get_attachment_id_by_filename($file);
        if(!$fileObj) {
            wp_die(__('Die angeforderte Datei wurde nicht gefunden oder ist nicht lesbar.', 'bootscore'). ' '.__LINE__);
        }
        global $wp_filesystem;
        $fullsize_path = get_attached_file($fileObj->ID );
        if(!$fullsize_path || !$wp_filesystem->exists($fullsize_path) || !$wp_filesystem->is_readable($fullsize_path)) {
            wp_die(__('Die angeforderte Datei wurde nicht gefunden oder ist nicht lesbar.', 'bootscore'). ' '.__LINE__);
        }

        $type ? $getType = 1 : $getType = 0;


        $mimeType = mime_content_type($fullsize_path);
        header("Content-Type: $mimeType");

        switch ($getType) {
            case '0':
                header("Content-Type: $mimeType");
                header('Pragma: public');
                header('Expires: 0');
                header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
                header('Content-Disposition: attachment; filename="' . basename($fullsize_path) . '"');
                header('Content-Length: ' . filesize($fullsize_path));
                header('Content-Transfer-Encoding: binary');
                if (ob_get_level()) {
                    ob_end_clean();
                }
                flush();
                readfile($fullsize_path);
                break;
            case '1':
                if (ob_get_level()) {
                    ob_end_clean();
                }
                flush();
                readfile($fullsize_path);
                break;
        }
    }

    private function scan_directory_for_json($directory): array
    {

        global $wp_filesystem;
        // Sicherstellen, dass das Verzeichnis existiert
        $realDirectory = realpath($directory);
        if (!$realDirectory || !$wp_filesystem->is_dir($realDirectory)) {
            return [];
        }

        // Ergebnisarray für gefundene Dateien
        $jsonFiles = [];
        // Verzeichnis scannen
        $files = scandir($realDirectory);
        foreach ($files as $file) {
            // Nur Dateien berücksichtigen, keine Verzeichnisse
            if (!$wp_filesystem->is_file($realDirectory . DIRECTORY_SEPARATOR . $file)) {
                continue;
            }

            // Überprüfen, ob die Datei eine .json-Datei ist und mit "form-builder" beginnt
            if (pathinfo($file, PATHINFO_EXTENSION) === 'json' && str_starts_with($file, 'form-builder')) {
                $jsonFiles[] = $file;
            }
        }
        return $jsonFiles;
    }

    private function get_attachment_id_by_filename($filename) {
        global $wpdb;

        // Sicherheitsmaßnahmen: Platzhalter verwenden
        $query = $wpdb->prepare(
            "SELECT guid, ID FROM $wpdb->posts WHERE guid LIKE %s AND post_type = 'attachment'",
            '%' . $wpdb->esc_like($filename) . '%'
        );

        // Datenbankabfrage ausführen
        $attachments = $wpdb->get_results($query, OBJECT);

        // Ergebnis prüfen und zurückgeben
        return !empty($attachments) ? $attachments[0] : false;
    }

}