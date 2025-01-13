<?php

namespace Hummelt\ThemeV3;

use Exception;
use Hummelt_Theme_V3;

class Child_Theme_Public_Ajax
{
    protected string $method;
    private object $responseJson;

    /**
     * The AJAX DATA
     *
     * @access   private
     * @var      array|object $data The AJAX DATA.
     */
    protected $data;


    protected Hummelt_Theme_V3 $main;
    private static $child_ajax_instance;

    /**
     * @return static
     */
    public static function child_theme_ajax_instance(Hummelt_Theme_V3 $main): self
    {
        if (is_null(self::$child_ajax_instance)) {
            self::$child_ajax_instance = new self($main);
        }
        return self::$child_ajax_instance;
    }

    public function __construct(Hummelt_Theme_V3 $main)
    {
        $this->main = $main;
        $this->method = filter_input(INPUT_POST, 'method', FILTER_UNSAFE_RAW, FILTER_FLAG_STRIP_HIGH);
        $this->responseJson = (object)['status' => false, 'msg' => date('H:i:s'), 'type' => $this->method];
    }

    /**
     * PUBLIC AJAX RESPONSE.
     * @throws Exception
     */
    public function theme_ajax_handle(): object
    {
        if (!method_exists($this, $this->method)) {
            throw new Exception("Method not found!#Not Found");
        }
        return call_user_func_array(self::class . '::' . $this->method, []);
    }

    private function get_app_form_builder():object
    {
        $builder_id = filter_var($this->request->get_param('builder_id'), FILTER_VALIDATE_INT);
        $page = filter_var($this->request->get_param('page'), FILTER_VALIDATE_INT);

        $builder_id = filter_input(INPUT_POST, 'builder_id', FILTER_VALIDATE_INT);
        $page = filter_input(INPUT_POST, 'page', FILTER_VALIDATE_INT);

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

    private function chunk_upload():object
    {
        try {
            global $wp_filesystem;
            $chunkIndex = filter_input(INPUT_POST, 'dzchunkindex', FILTER_VALIDATE_INT); //chunk
            $chunksCount = filter_input(INPUT_POST, 'dztotalchunkcount', FILTER_VALIDATE_INT);//chunks
            $chunkAktiv = filter_input(INPUT_POST, 'chunkAktiv', FILTER_VALIDATE_INT);
            $file_id = filter_input(INPUT_POST, 'dzuuid', FILTER_UNSAFE_RAW);
            $ids = filter_input(INPUT_POST, 'form_data', FILTER_UNSAFE_RAW);

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
                $file_extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                $basename = pathinfo($fileName, PATHINFO_FILENAME);
                $fileName = $file_id . '.' . $file_extension;
                $finalFile = HUMMELT_THEME_V3_DOWNLOAD_DIR . $fileName;
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
                if(!$this->check_upload_type($ids, $extension)) {
                    $wp_filesystem->delete($finalFile);
                    throw new Exception('Falscher Dateityp.');
                }
                $this->responseJson->file = $fileName;
                $this->responseJson->id = $file_id;
                $this->responseJson->file_name = $basename;
                $this->responseJson->status = true;

            } else {
                $this->responseJson->msg = "Chunk {$chunkIndex} hochgeladen.";
            }

        } catch (Exception $e) {
            $this->responseJson->msg = $e->getMessage();
            return $this->responseJson;
        }

        return $this->responseJson;
    }

    private function check_upload_type($ids, $ext): bool
    {
        if(!$ids) {
            return false;
        }
        $ids = json_decode($ids, true);
        $args = sprintf('WHERE id=%d', $ids['id']);
        $form = apply_filters(HUMMELT_THEME_V3_SLUG.'/get_form_builder', $args);
        if(!$form->status) {
            return false;
        }
        $form = $form->record;
        $form = $form['form'];
        if(!isset($form['builder'])) {
            return false;
        }
        foreach ($form['builder'] as $tmp) {
            foreach ($tmp['grid'] as $grid) {
                if($grid['id'] == $ids['grid_id']) {
                    foreach ($grid['forms'] as $f) {
                        if($f['id'] == $ids['form_id'] && $f['form_type'] == 'upload') {
                            $config = $f['config'];
                            if(isset($config['accept'])) {
                                $config['accept'] = str_replace([' ','.'], '', $config['accept']);
                                $config['accept'] = explode(',', $config['accept']);
                                if(in_array($ext, $config['accept'])) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
}