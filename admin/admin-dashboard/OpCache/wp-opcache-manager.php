<?php
$opcache_enabled = function_exists('opcache_get_status') && function_exists('opcache_get_configuration');

// Hole OPcache-Konfiguration und -Status
$opcache_config  = $opcache_enabled ? opcache_get_configuration() : false;
$opcache_status  = $opcache_enabled ? opcache_get_status() : false;


?>
    <div class="wrap">
        <h1>WP OPcache Manager</h1>
        <?php if ( ! $opcache_enabled ): ?>
            <p style="color: red;">
                <strong>OPcache ist auf diesem Server nicht aktiv oder nicht verfügbar.</strong>
            </p>
        <?php else: ?>
            <h2>OPcache ist aktiv</h2>

            <!-- OPcache Directives -->
            <?php if ( $opcache_config && isset( $opcache_config['directives'] ) ): ?>
                <table class="widefat striped">
                    <thead>
                    <tr>
                        <th>Einstellung</th>
                        <th>Wert</th>
                    </tr>
                    </thead>
                    <tbody>
                    <?php foreach ( $opcache_config['directives'] as $directive => $value ): ?>
                        <tr>
                            <td><?php echo esc_html( $directive ); ?></td>
                            <td><?php echo is_array($value)
                                    ? esc_html( implode(', ', $value) )
                                    : esc_html( $value ); ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>

            <!-- OPcache Statistiken -->
            <?php if ( $opcache_status && isset( $opcache_status['opcache_statistics'] ) ): ?>
                <?php $stats = $opcache_status['opcache_statistics']; ?>
                <h3>OPcache Statistiken</h3>
                <table class="widefat striped">
                    <thead>
                    <tr>
                        <th>Statistik</th>
                        <th>Wert</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Cached Scripts</td>
                        <td><?php echo esc_html( $stats['num_cached_scripts'] ); ?></td>
                    </tr>
                    <tr>
                        <td>Hits</td>
                        <td><?php echo esc_html( $stats['hits'] ); ?></td>
                    </tr>
                    <tr>
                        <td>Misses</td>
                        <td><?php echo esc_html( $stats['misses'] ); ?></td>
                    </tr>
                    <tr>
                        <td>Hit-Rate</td>
                        <td><?php echo sprintf( '%.2f%%', $stats['opcache_hit_rate'] ); ?></td>
                    </tr>
                    </tbody>
                </table>
            <?php endif; ?>

            <!-- Button zum Leeren des OPcache -->
            <form method="post">
                <?php wp_nonce_field( 'wp_opcache_manager_reset', 'wp_opcache_manager_reset_nonce' ); ?>
                <p>
                    <input type="submit" name="wp_opcache_manager_reset" value="OPcache leeren" class="button button-primary" />
                </p>
            </form>
        <?php endif; ?>
    </div>
<?php

/**
 * Handler für das Leeren des OPcache
 */
add_action('admin_init', 'wp_opcache_manager_reset_handler');
function wp_opcache_manager_reset_handler(): void
{
    if (
        isset($_POST['wp_opcache_manager_reset']) &&
        check_admin_referer( 'wp_opcache_manager_reset', 'wp_opcache_manager_reset_nonce' )
    ) {
        if ( function_exists('opcache_reset') ) {
            opcache_reset();
            add_settings_error(
                'wp-opcache-manager',
                'opcache_reset_success',
                'OPcache wurde erfolgreich geleert.',
                'updated'
            );
        } else {
            add_settings_error(
                'wp-opcache-manager',
                'opcache_reset_failed',
                'OPcache-Reset ist nicht möglich (opcache_reset() nicht verfügbar).',
                'error'
            );
        }
    }
}

/**
 * Admin-Meldungen ausgeben
 */
add_action('admin_notices', 'wp_opcache_manager_admin_notices');
function wp_opcache_manager_admin_notices(): void
{
    settings_errors( 'wp-opcache-manager' );
}