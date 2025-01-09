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
class hummelt_theme_v3_cronjob
{
    use hummelt_theme_v3_settings;
    private string $interval = '';

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
        $dsSettings = get_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses');
        $themeSettings = $dsSettings['theme'];
        if(isset($themeSettings['cronjob']) && $themeSettings['cronjob']) {
            $this->interval = $themeSettings['cronjob'];
            if (!wp_next_scheduled('hummelt_theme_v3_sync')) {
                wp_schedule_event(time(), $this->interval, 'hummelt_theme_v3_sync');
            }
        }
    }

    public function fn_hummelt_theme_v3_run_schedule_task():void
    {
        $schedule = $this->interval;
        if($schedule) {
            $time = get_gmt_from_date(gmdate('Y-m-d H:i:s', current_time('timestamp')), 'U');
            $args = [
                'timestamp' => $time,
                'recurrence' => $schedule->recurrence,
                'hook' => 'hummelt_theme_v3_sync'
            ];

            $this->schedule_task($args);
        }
    }

    public function fn_hummelt_theme_v3_wp_un_schedule_task():void
    {
        $timestamp = wp_next_scheduled('hummelt_theme_v3_sync');
        wp_unschedule_event($timestamp, 'hummelt_theme_v3_sync');
    }

    public function fn_hummelt_theme_v3_wp_delete_task():void
    {
        wp_clear_scheduled_hook('hummelt_theme_v3_sync');
    }

    /**
     * @param $task
     * @return void
     */
    private function schedule_task($task): void
    {

        /* Must have task information. */
        if (!$task) {
            return;
        }

        /* Set list of required task keys. */
        $required_keys = array(
            'timestamp',
            'recurrence',
            'hook'
        );

        /* Verify the necessary task information exists. */
        $missing_keys = [];
        foreach ($required_keys as $key) {
            if (!array_key_exists($key, $task)) {
                $missing_keys[] = $key;
            }
        }

        /* Check for missing keys. */
        if (!empty($missing_keys)) {
            return;
        }

        /* Task darf nicht bereits geplant sein. */
        if (wp_next_scheduled($task['hook'])) {
            wp_clear_scheduled_hook($task['hook']);
        }

        /* Schedule the task to run. */
        wp_schedule_event($task['timestamp'], $task['recurrence'], $task['hook']);
    }

    public function fn_hummelt_theme_v3_sync(): void
    {
        $dsSettings = get_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses');
        $isTestUrl = apply_filters(HUMMELT_THEME_V3_SLUG . '/test_url', site_url());

        $isPlugin = function ($slug) use ($dsSettings) {
            foreach ($dsSettings['plugins'] as $plugin) {
                if ($plugin['slug'] == $slug) {
                    return $plugin;
                }
            }
            return [];
        };

        $plugins = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_plugins', null);
        foreach ($plugins as $tmp) {
            if (!$isPlugin($tmp['slug'])) {
                if ($isTestUrl) {
                    $tmp['aktiv'] = true;
                } else {
                    $tmp['aktiv'] = false;
                }
                $tmp['license'] = '';
                $dsSettings['plugins'] = array_merge_recursive($dsSettings['plugins'], [$tmp]);
                update_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses', $dsSettings);

            }
        }

        if ($isTestUrl) {
            if (!$dsSettings['theme']['license']) {
                $license = '';
            } else {
                $license = $dsSettings['theme']['license'];
            }
            $theme = [
                'aktiv' => true,
                'license' => $license,
            ];
            $dsSettings['theme'] = $theme;
            update_option(HUMMELT_THEME_V3_SLUG . '/hupa-licenses', $dsSettings);
        }
    }
}