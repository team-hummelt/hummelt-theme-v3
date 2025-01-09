<?php
namespace Hummelt\ThemeV3;

use Exception;
use Hummelt_Theme_V3;
use WP_REST_Request;

class hummelt_theme_v3_formular_ajax
{
    private static $instance;
    private string $method;
    private object $responseJson;
    protected WP_REST_Request $request;
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
      //  $this->method = $this->request->get_param('method');
        $this->responseJson = (object)[
            'status' => false,
            'msg' => date('H:i:s', current_time('timestamp')),
            'type' => $this->method
        ];
    }

    /**
     * @throws Exception
     */
    public function formular_ajax_handle()
    {
        if (!method_exists($this, $this->method)) {
            throw new Exception("Method not found!#Not Found");
        }

        return call_user_func_array(self::class . '::' . $this->method, []);
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

