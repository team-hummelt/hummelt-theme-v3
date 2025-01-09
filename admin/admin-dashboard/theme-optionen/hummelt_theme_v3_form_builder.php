<?php
namespace Hummelt\ThemeV3;

defined('ABSPATH') or die();
use Hummelt_Theme_V3;
use stdClass;

class hummelt_theme_v3_form_builder
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

    public function fn_theme_v3_get_form_builder($args = false, $fetchMethod = true): object
    {
        $return = new stdClass();
        $return->status = false;
        $return->count = 0;

        global $wpdb;
        $fetchMethod ? $fetch = 'get_row' : $fetch = 'get_results';
        $table = $wpdb->prefix . $this->table_forms;
        $result = $wpdb->$fetch("SELECT * FROM $table $args", ARRAY_A);

        if (!$result) {
            return $return;
        }
        $return->status = true;
        if ($fetch !== 'get_row') {
            $return->count = count($result);
        }
        if($fetchMethod){
            $result['form'] = json_decode($result['form'], true);
        }
        $return->record = $result;

        return $return;
    }

    public function fn_theme_v3_count_form_builder():int
    {
        global $wpdb;
        $table = $wpdb->prefix . $this->table_forms; // Tabelle mit Prefix
        return $wpdb->get_var("SELECT COUNT(*) FROM $table");
    }

    public function fn_theme_v3_set_form_builder($record): object
    {
        $return = new stdClass();
        global $wpdb;
        $table = $wpdb->prefix . $this->table_forms;
        $wpdb->insert(
            $table,
            array(
                'designation' => $record['designation'],
                'form_id' => $record['form_id'],
                'form' => json_encode($record['form'])
               ),
            array('%s', '%s', '%s')
        );
        if (!$wpdb->insert_id) {
            $return->status = false;
            return $return;
        }
        $return->status = true;
        $return->id = $wpdb->insert_id;

        return $return;
    }

    public function fn_theme_v3_update_form_builder($record): void
    {
        global $wpdb;
        $table = $wpdb->prefix . $this->table_forms;
        $wpdb->update(
            $table,
            array(
                'designation' => $record['designation'],
                'form' => json_encode($record['form'])
            ),
            array('id' => $record['id']),
            array('%s', '%s'),
            array('%d')
        );
    }

    public function fn_theme_v3_update_form_designation($designation, $id): void
    {
        global $wpdb;
        $table = $wpdb->prefix . $this->table_forms;
        $wpdb->update(
            $table,
            array(
                'designation' => $designation
            ),
            array('id' => $id),
            array('%s'),
            array('%d')
        );
    }

    public function fn_theme_v3_update_form($form, $id): void
    {
        global $wpdb;
        $table = $wpdb->prefix . $this->table_forms;
        $wpdb->update(
            $table,
            array(
                'form' => json_encode($form)
            ),
            array('id' => $id),
            array('%s'),
            array('%d')
        );

        $this->fn_theme_v3_add_form_ref($form, $id);
    }

    public function  fn_theme_v3_add_form_ref($form, $id):object
    {
        $return = new stdClass();
        global $wpdb;
        $table = $wpdb->prefix . $this->table_forms_ref;
        $wpdb->insert(
            $table,
            array(
                'form_id' => $id,
                'form' => json_encode($form)
            ),
            array('%s', '%s')
        );
        if (!$wpdb->insert_id) {
            $return->status = false;
            return $return;
        }
        $return->status = true;
        $return->id = $wpdb->insert_id;

        return $return;
    }

    public function fn_theme_v3_count_form_builder_ref():int
    {
        global $wpdb;
        $table = $wpdb->prefix . $this->table_forms_ref;
        return $wpdb->get_var("SELECT COUNT(*) FROM $table");
    }

    public function fn_theme_v3_get_form_builder_ref($args = false, $fetchMethod = true): object
    {
        $return = new stdClass();
        $return->status = false;
        $return->count = 0;

        global $wpdb;
        $fetchMethod ? $fetch = 'get_row' : $fetch = 'get_results';
        $table = $wpdb->prefix . $this->table_forms_ref;
        $result = $wpdb->$fetch("SELECT * FROM $table $args", ARRAY_A);

        if (!$result) {
            return $return;
        }
        $return->status = true;
        if ($fetch !== 'get_row') {
            $resArr = [];
            $return->count = count($result);
            foreach ($result as $tmp) {
                $tmp['form'] = json_decode($tmp['form'], true);
                $resArr[] = $tmp;
            }
            $result = $resArr;
        }
        if($fetchMethod){
            $result['form'] = json_decode($result['form'], true);
        }
        $return->record = $result;

        return $return;
    }

    public function fn_theme_v3_get_form_builder_ref_selects($args): array
    {
        global $wpdb;
        $table = $wpdb->prefix . $this->table_forms_ref;
        $result = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT id, DATE_FORMAT(created_at, '%%d.%%m.%%Y %%H:%%i:%%s') AS created_date
         FROM $table
         $args"
            ),
            ARRAY_A
        );
        if($result) {
            return $result;
        }
        return [];
    }

    public function fn_theme_v3_next_pref_ref($id, $form_id): array
    {
        global $wpdb;
        $table = $wpdb->prefix . $this->table_forms_ref;
        $query = $wpdb->prepare(
            "(
        SELECT * 
        FROM $table 
        WHERE id < %d AND form_id=%d 
        ORDER BY id DESC 
        LIMIT 1
    )
    UNION ALL
    (
        SELECT * 
        FROM $table 
        WHERE id > %d AND form_id=%d 
        ORDER BY id ASC 
        LIMIT 1
    )",
            $id, $form_id, $id, $form_id
        );

        $results = $wpdb->get_results($query);
        $previous_entry = 0;
        $next_entry = 0;

        if (!empty($results)) {
            foreach ($results as $result) {
                if ($result->id < $id) {
                    $previous_entry = $result;
                } elseif ($result->id > $id) {
                    $next_entry = $result;
                }
            }
        }

        if ($previous_entry) {
            $previous_entry =  $previous_entry->id;
        }

        if ($next_entry) {
            $next_entry = $next_entry->id;
        }

        return [
            'prev' => $previous_entry,
            'next' => $next_entry
        ];
    }



    public function fn_theme_v3_delete_form_builder($id): void
    {
        global $wpdb;
        $table = $wpdb->prefix . $this->table_forms;
        $wpdb->delete(
            $table,
            array(
                'id' => $id
            ),
            array('%d')
        );
    }

    public function fn_theme_v3_set_form_email($record): object
    {
        $return = new stdClass();
        global $wpdb;
        $table = $wpdb->prefix . $this->table_forms_email;
        $wpdb->insert(
            $table,
            array(
                'form_id' => $record['form_id'],
                'subject' => $record['subject'],
                'abs_ip' => $record['abs_ip'],
                'send_data' => $record['send_data'],
                'cc_bcc' => $record['cc_bcc'],
                'message' => $record['message']
            ),
            array('%d', '%s', '%s', '%s', '%s', '%s')
        );
        if (!$wpdb->insert_id) {
            $return->status = false;
            return $return;
        }
        $return->status = true;
        $return->id = $wpdb->insert_id;

        return $return;
    }

    public function fn_theme_v3_get_form_email($args = false, $fetchMethod = true): object
    {
        $return = new stdClass();
        $return->status = false;
        $return->count = 0;

        global $wpdb;
        $fetchMethod ? $fetch = 'get_row' : $fetch = 'get_results';
        $table = $wpdb->prefix . $this->table_forms_email;
        $result = $wpdb->$fetch("SELECT * FROM $table $args", ARRAY_A);

        if (!$result) {
            return $return;
        }
        $return->status = true;
        if ($fetch !== 'get_row') {
            $return->count = count($result);
        }
        $return->record = $result;

        return $return;
    }

    public function fn_theme_v3_count_form_builder_email():int
    {
        global $wpdb;
        $table = $wpdb->prefix . $this->table_forms_email;
        return $wpdb->get_var("SELECT COUNT(*) FROM $table");
    }

    public function fn_theme_v3_delete_form_email($id): void
    {
        global $wpdb;
        $table = $wpdb->prefix . $this->table_forms_email;
        $wpdb->delete(
            $table,
            array(
                'id' => $id
            ),
            array('%d')
        );
    }

}