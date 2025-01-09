<?php

namespace Hummelt\ThemeV3;

use Exception;
use Hummelt_Theme_V3;
use Behat\Transliterator\Transliterator;
class hummelt_them_v3_admin_ajax
{
    private static $instance;
    private string $method;
    private object $responseJson;

    use hummelt_theme_v3_form_settings;

    /**
     * Store plugin main class to allow admin access.
     *
     * @since    2.0.0
     * @access   private
     * @var Hummelt_Theme_V3 $main The main class.
     */
    protected Hummelt_Theme_V3 $main;

    /**
     * @return static
     */
    public static function instance(Hummelt_Theme_V3 $main): self
    {
        if (is_null(self::$instance)) {
            self::$instance = new self($main);
        }
        return self::$instance;
    }

    public function __construct(Hummelt_Theme_V3 $main)
    {
        $this->main = $main;
        $this->method = filter_input(INPUT_POST, 'method', FILTER_UNSAFE_RAW, FILTER_FLAG_STRIP_HIGH);

        $this->responseJson = (object)[
            'status' => false,
            'msg' => date('H:i:s', current_time('timestamp')),
            'type' => $this->method
        ];
    }

    /**
     * @throws Exception
     */
    public function admin_ajax_handle()
    {
        if (!method_exists($this, $this->method)) {
            throw new Exception("Method not found!#Not Found");
        }

        return call_user_func_array(self::class . '::' . $this->method, []);
    }

    /**
     * @throws Exception
     */
    private function font_upload(): object
    {
        try {
            global $wp_filesystem;
            $chunkIndex = filter_input(INPUT_POST, 'dzchunkindex', FILTER_VALIDATE_INT); //chunk
            $chunksCount = filter_input(INPUT_POST, 'dztotalchunkcount', FILTER_VALIDATE_INT);//chunks
            $chunkAktiv = filter_input(INPUT_POST, 'chunkAktiv', FILTER_VALIDATE_INT);
            $file_id = filter_input(INPUT_POST, 'dzuuid', FILTER_UNSAFE_RAW);

            $file = $_FILES['file'] ?? null;
            if (!$file || !isset($chunkIndex)) {
                throw new Exception('Ungültige Anfrage.');
            }
            $fileName = sanitize_file_name($file['name']);
            $upload_dir = wp_upload_dir();
            $chunkDir = $upload_dir['basedir'] . '/chunks/' . $file_id;
            $chunkFile = $chunkDir . "/chunk_{$chunkIndex}";


            if (!$wp_filesystem->is_dir($chunkDir)) {
                wp_mkdir_p($chunkDir);
            }

            // Chunk speichern
            if (!move_uploaded_file($file['tmp_name'], $chunkFile)) {
                throw new Exception('Fehler beim Speichern des Chunks.');
            }

            if ($chunkIndex === $chunksCount - 1) {
                $finalFile = HUMMELT_THEME_V3_FONTS_DIR . $fileName;
                $out = fopen($finalFile, 'wb');

                // Chunks zusammenfügen
                for ($i = 0; $i < $chunksCount; $i++) {
                    $chunkPath = $chunkDir . "/chunk_{$i}";
                    if (!$wp_filesystem->is_file($chunkPath)) {
                        throw new Exception("Chunk {$i} fehlt.");
                    }
                    $in = fopen($chunkPath, 'rb');
                    while ($buff = fread($in, 4096)) {
                        fwrite($out, $buff);
                    }
                    fclose($in);
                    $wp_filesystem->delete($chunkPath); // Chunk löschen
                }
                fclose($out);
                $wp_filesystem->rmdir($chunkDir, true); // Chunk-Verzeichnis löschen
                if (!$wp_filesystem->is_file($finalFile)) {
                    throw new Exception('Fehler beim Speichern des Files.');
                }
                $fileInfo = pathinfo($finalFile);
                $extension = $fileInfo['extension'];
                if ($extension == 'ttf') {
                    $import = apply_filters(HUMMELT_THEME_V3_SLUG . '/theme_hummelt_v3_font_import', $fileInfo);
                    if ($import->status) {
                        do_action(HUMMELT_THEME_V3_SLUG . '/theme_hummelt_v3_font_face');

                    }
                    $this->responseJson->status = $import->status;
                    $this->responseJson->font = $import->font;
                    $this->responseJson->msg = $import->msg;
                }
            } else {
                $this->responseJson->msg = "Chunk {$chunkIndex} hochgeladen.";
            }

        } catch (Exception $e) {
            $this->responseJson->msg = $e->getMessage();
            return $this->responseJson;
        }

        return $this->responseJson;
    }

    private function hummelt_theme_v3_post_order(): object
    {
        $post_type = filter_input(INPUT_POST, 'post_type', FILTER_UNSAFE_RAW);
        $paged = filter_input(INPUT_POST, 'paged', FILTER_VALIDATE_INT);
        $elements = filter_input(INPUT_POST, 'elements', FILTER_UNSAFE_RAW);
        if (!$elements) {
            return $this->responseJson;
        }
        $elements = json_decode($elements, true);
        $elementIds = [];
        foreach ($elements as $tmp) {
            preg_match('/\d{1,9}/', $tmp, $matches);
            if (isset($matches[0])) {
                $elementIds[] = $matches[0];
            }
        }

        global $wpdb, $userdata;
        $mysql_query = $wpdb->prepare("SELECT ID FROM " . $wpdb->posts . " 
                                                            WHERE post_type = %s AND post_status IN ('publish', 'pending', 'draft', 'private', 'future', 'inherit')
                                                            ORDER BY menu_order, post_date DESC", $post_type);
        $results = $wpdb->get_results($mysql_query);
        if (!$results) {
            return $this->responseJson;
        }
        $objects_ids = [];

        foreach ($results as $result) {
            $objects_ids[] = (int)$result->ID;
        }

        $objects_per_page = get_user_meta($userdata->ID, 'edit_' . $post_type . '_per_page', TRUE);
        if (!$objects_per_page) {
            $objects_per_page = 20;
        }

        $edit_start_at = $paged * $objects_per_page - $objects_per_page;
        $index = 0;

        for ($i = $edit_start_at; $i < ($edit_start_at + $objects_per_page); $i++) {
            if (!isset($objects_ids[$i])) {
                break;
            }
            $objects_ids[$i] = (int)$elementIds[$index];
            $index++;
        }

        foreach ($objects_ids as $menu_order => $id) {
            $data = array(
                'menu_order' => $menu_order
            );

            $wpdb->update($wpdb->posts, $data, array('ID' => $id));
            clean_post_cache($id);
        }
        $this->responseJson->status = true;
        return $this->responseJson;
    }

    private function hummelt_theme_v3_duplicate_post(): object
    {
        $post_type = filter_input(INPUT_POST, 'post_type', FILTER_UNSAFE_RAW);
        $paged = filter_input(INPUT_POST, 'paged', FILTER_SANITIZE_NUMBER_INT);
        $postId = filter_input(INPUT_POST, 'postId', FILTER_SANITIZE_NUMBER_INT);

        if (!$post_type || !$postId) {
            $this->responseJson->msg = 'Es konnte keine Kopie erstellt werden.';
            return $this->responseJson;
        }
        $optionen = get_option(HUMMELT_THEME_V3_SLUG . '/optionen');
        $theme_sort_options = $optionen['theme_sort_options'];
        $themeDuplicateTypes = $optionen['duplicate_post_types'];
        global $wpdb;
        $post = get_post($postId);

        $checkPostType = function ($type) use ($themeDuplicateTypes) {
            foreach ($themeDuplicateTypes as $tmp) {
                if ($tmp['name'] == $type) {
                    return $tmp['value'];
                }
            }
            return '';
        };

        $ifPostType = $checkPostType($post_type);
        if ($ifPostType != 'show') {
            $this->responseJson->msg = 'keine Berechtigung für diesen Beitragstyp!';
            return $this->responseJson;
        }

        $sql_query_sel = [];
        if (isset($post) && $post != null) {
            $args = array(
                'post_author' => $post->post_author,
                'post_content' => $post->post_content,
                'post_title' => $post->post_title,
                'post_excerpt' => $post->post_excerpt,
                'post_status' => 'draft',
                'comment_status' => $post->comment_status,
                'ping_status' => $post->ping_status,
                'post_password' => $post->post_password,
                'post_name' => $post->post_name,
                'to_ping' => $post->to_ping,
                'post_parent' => $post->post_parent,
                'menu_order' => $post->menu_order,
                'post_type' => $post->post_type,
            );

            $new_post_id = wp_insert_post($args);

            //TODO returns array of taxonomy names for post type, ex array("category", "post_tag");
            $taxonomies = get_object_taxonomies($post->post_type);
            foreach ($taxonomies as $taxonomy) {
                $post_terms = wp_get_object_terms($postId, $taxonomy, array('fields' => 'slugs'));
                wp_set_object_terms($new_post_id, $post_terms, $taxonomy, false);
            }

            //TODO duplicate all post meta just in two SQL queries
            $post_meta_infos = $wpdb->get_results("SELECT meta_key, meta_value FROM $wpdb->postmeta WHERE post_id=$postId");
            if (count($post_meta_infos) != 0) {
                $sql_query = "INSERT INTO $wpdb->postmeta (post_id, meta_key, meta_value) ";
                foreach ($post_meta_infos as $meta_info) {
                    $meta_key = $meta_info->meta_key;
                    if ($meta_key == '_wp_old_slug') continue;
                    $meta_value = addslashes($meta_info->meta_value);
                    $sql_query_sel[] = "SELECT $new_post_id, '$meta_key', '$meta_value'";
                }
                $sql_query .= implode(" UNION ALL ", $sql_query_sel);
                $wpdb->query($sql_query);
            }
        } else {
            $this->responseJson->msg = __('Duplicate failed, could not find the original post: ', 'bootscore');
            return $this->responseJson;
        }

        $this->responseJson->status = true;
        $this->responseJson->reload = true;
        return $this->responseJson;
    }

    private function import_page_builder():object
    {
        global $wp_filesystem;
        $file = $_FILES['file'];
        if (empty($_FILES['file'])) {
            $this->responseJson->msg ='Keine Datei hochgeladen. (ajx-'.__LINE__.')';
            return $this->responseJson;
        }
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
        $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if($file_extension != 'json') {
            $this->responseJson->msg ='Ungültige Dateiendung: ' .$file_extension. ' (ajx-'.__LINE__.')';
            return $this->responseJson;
        }
        $basename = pathinfo($file['name'], PATHINFO_FILENAME);
        $fileName = Transliterator::urlize($basename, '-').uniqid(). '.'. $file_extension;

        $dest = $baseDir . $fileName;
        if(!move_uploaded_file($file['tmp_name'], $dest)) {
            $this->responseJson->msg = 'Fehler beim Verschieben der Datei.';
            return $this->responseJson;
        }
        if(!$wp_filesystem->is_file($dest)) {
            $this->responseJson->msg = 'Fehler beim Importieren der Datei.';
            return $this->responseJson;
        }
        $import = $wp_filesystem->get_contents($dest);
        $import = json_decode($import, true);
        if(!isset($import['name']) || !isset($import['id']) || !isset($import['bu_version']) || !isset($import['builder'])) {
            $this->delete_import_file($fileName);
            $this->responseJson->msg = 'Die Version ist nicht kompatibel.';
            return $this->responseJson;
        }

        if($import['bu_version'] !=  $this->version ) {
            $this->responseJson->msg = 'Die Version ist nicht kompatibel.';
            $this->delete_import_file($fileName);
            return $this->responseJson;
        }

        $id = 'FB'.uniqid();
        $import['id'] = $id;
        $record = [
            'form_id' => $id,
            'designation' => $import['name'],
            'form' => $import
        ];

        $insert = apply_filters(HUMMELT_THEME_V3_SLUG.'/set_form_builder', $record);
        if(!$insert->status) {
            $this->responseJson->msg = 'Fehler beim Speichern der Datei.';
            return $this->responseJson;
        }
        $this->delete_import_file($fileName);
        $this->responseJson->status = true;
        $this->responseJson->msg = 'Datei erfolgreich Importiert.';
        $this->responseJson->title = 'Import erfolgreich';

        return $this->responseJson;
    }

    private function delete_import_file($filename): void
    {
        global $wp_filesystem;
        $upload_dir = wp_get_upload_dir();
        $baseDir = $upload_dir['basedir'] . DIRECTORY_SEPARATOR . 'downloads' . DIRECTORY_SEPARATOR;
        if($wp_filesystem->is_file($baseDir . $filename)) {
            $wp_filesystem->delete($baseDir . $filename);
        }
    }

    private function email_table():object
    {
        $columns = array(
            "created_at",
            "form_id",
            "subject",
            '',
            '',
            '',
            ''
        );
        $query = '';
        $search = $_POST['search']['value'];
        if (isset( $_POST['search']['value'])) {
            $query = ' WHERE subject LIKE "%' . $_POST['search']['value'] . '%"
             OR form_id LIKE "%' . $_POST['search']['value'] . '%"
             OR created_at LIKE "%' . $_POST['search']['value'] . '%"
            ';
        }

        if (isset($_POST['order'])) {
            $query .= ' ORDER BY ' . $columns[$_POST['order']['0']['column']] . ' ' . $_POST['order']['0']['dir'] . ' ';
        } else {
            $query .= ' ORDER BY created_at DESC';
        }

        $limit = '';
        if ($_POST["length"] != -1) {
            $limit = ' LIMIT ' . $_POST['start'] . ', ' . $_POST['length'];
        }
        $table = apply_filters(HUMMELT_THEME_V3_SLUG.'/get_form_email', $query . $limit, false);

        $data_arr = [];
        if (!$table->status) {
            $this->responseJson->draw = $_POST['draw'];
            $this->responseJson->recordsTotal = 0;
            $this->responseJson->recordsFiltered = 0;
            $this->responseJson->data = $data_arr;
            return $this->responseJson;
        }

        foreach ($table->record as $tmp) {
            $cc_bcc = json_decode($tmp['cc_bcc'], true);
            $args = sprintf('WHERE id=%d', $tmp['form_id']);
            $form = apply_filters(HUMMELT_THEME_V3_SLUG.'/get_form_builder', $args);

            $data_item = [];
            $data_item[] = '<span>'.date('d.m.Y', strtotime($tmp['created_at'])).'</span><small class="small-lg d-block lh-1">'.date('H:i:s', strtotime($tmp['created_at'])).' Uhr</small>';
            $data_item[] = '<small>'.$form->record['designation'].'</small>';
            $data_item[] = '<small>'.$tmp['subject'].'</small>';
            $data_item[] = '<small>'.implode(', ',$cc_bcc['cc']).'</small>';
            $data_item[] = '<small>'.implode(', ',$cc_bcc['bcc']).'</small>';
            $data_item[] = $tmp['id'];
            $data_item[] = $tmp['id'];
            $data_arr[] = $data_item;
        }
        $countAll = apply_filters(HUMMELT_THEME_V3_SLUG.'/count_form_email', '');
        $this->responseJson->recordsTotal = $countAll;
        $this->responseJson->draw = $_POST['draw'];
        if($search){
            $this->responseJson->recordsFiltered = $table->count;
        } else {
            $this->responseJson->recordsFiltered = $countAll;
        }
        $this->responseJson->data = $data_arr;
        return $this->responseJson;
    }

    private function form_table(): object
    {
        $columns = array(
            "designation",
            "form_id",
            "created_at",
            '',
            '',
            '',
            ''
        );
        $query = '';
        $search = $_POST['search']['value'];
        if (isset( $_POST['search']['value'])) {
            $query = ' WHERE designation LIKE "%' . $_POST['search']['value'] . '%"
             OR form_id LIKE "%' . $_POST['search']['value'] . '%"
             OR created_at LIKE "%' . $_POST['search']['value'] . '%"
            ';
        }

        if (isset($_POST['order'])) {
            $query .= ' ORDER BY ' . $columns[$_POST['order']['0']['column']] . ' ' . $_POST['order']['0']['dir'] . ' ';
        } else {
            $query .= ' ORDER BY designation DESC';
        }

        $limit = '';
        if ($_POST["length"] != -1) {
            $limit = ' LIMIT ' . $_POST['start'] . ', ' . $_POST['length'];
        }
        $table = apply_filters(HUMMELT_THEME_V3_SLUG.'/get_form_builder', $query . $limit, false);

        $this->responseJson->examples = apply_filters(HUMMELT_THEME_V3_SLUG . '/forms_examples', null);

        $data_arr = [];
        if (!$table->status) {
            $this->responseJson->draw = $_POST['draw'];
            $this->responseJson->recordsTotal = 0;
            $this->responseJson->recordsFiltered = 0;
            $this->responseJson->data = $data_arr;
            return $this->responseJson;
        }

        foreach ($table->record as $tmp) {
            $data_item = [];
            $data_item[] = $tmp['designation'];
            $data_item[] = $tmp['form_id'];
            $data_item[] = '<span>'.date('d.m.Y', strtotime($tmp['created_at'])).'</span><small class="small-lg d-block lh-1">'.date('H:i:s', strtotime($tmp['created_at'])).' Uhr</small>';
            $data_item[] = $tmp['id'];
            $data_item[] = $tmp['id'];
            $data_item[] = $tmp['id'];
            $data_item[] = $tmp['id'];
            $data_arr[] = $data_item;
        }

        $countAll = apply_filters(HUMMELT_THEME_V3_SLUG.'/count_form_builder', '');
        $this->responseJson->recordsTotal = $countAll;
        $this->responseJson->draw = $_POST['draw'];
        if($search){
            $this->responseJson->recordsFiltered = $table->count;
        } else {
            $this->responseJson->recordsFiltered = $countAll;
        }
        $this->responseJson->data = $data_arr;
        return $this->responseJson;
    }
}