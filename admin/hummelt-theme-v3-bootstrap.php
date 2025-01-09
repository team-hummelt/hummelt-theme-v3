<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

$theme_data = wp_get_theme('hummelt-theme-v3');
$child_data = wp_get_theme('hummelt-theme-v3-child');
if ($child_data->exists()) {
    $childVersion = $child_data->get('Version');
    $ifChild = true;
} else {
    $childVersion = false;
    $ifChild = false;
}


const HUMMELT_THEME_V3_SCSS_DISABLE_COMPILER = false;
const WP_ENVIRONMENT_TYPE = 'production';

/**
 * Font Folder
 */
const HUMMELT_THEME_V3_FONT_FOLDER_NAME = 'hummelt-theme-v3-fonts';

/**
 * Update Folder
 */
const HUMMELT_THEME_V3_UPDATE_FOLDER_NAME = 'hummelt-theme-v3-fonts';

/**
 * PDF Folder
 */
const HUMMELT_THEME_V3_PDF_FOLDER_NAME = 'hummelt-theme-v3-pdf';

/**
 * ADMIN ROOT PATH
 */
define('HUMMELT_THEME_V3_ADMIN_DIR', dirname(__FILE__) . DIRECTORY_SEPARATOR);
/**
 * THEME ROOT PATH
 */
define('HUMMELT_THEME_V3_DIR',dirname(__DIR__) . DIRECTORY_SEPARATOR);
/**
 * THEME ROOT PATH
 */
define('HUMMELT_THEME_V3_SLUG', wp_basename(dirname(__DIR__)));

/**
 * ADMIN ROOT URL
 */
define('HUMMELT_THEME_V3_ADMIN_URL', get_template_directory_uri() . '/admin/');


/**
 * Includes DIR
 */
const HUMMELT_THEME_V3_INCLUDES_DIR = HUMMELT_THEME_V3_ADMIN_DIR . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR;

/**
 * FONTs DIR | URL
 */
$upload_dir = wp_get_upload_dir();
define('HUMMELT_THEME_V3_FONTS_DIR', $upload_dir['basedir'] . DIRECTORY_SEPARATOR . HUMMELT_THEME_V3_FONT_FOLDER_NAME . DIRECTORY_SEPARATOR);
define('HUMMELT_THEME_V3_FONTS_URL', $upload_dir['baseurl'] . '/' . HUMMELT_THEME_V3_FONT_FOLDER_NAME . '/');
define('HUMMELT_THEME_V3_PDF_DIR', $upload_dir['basedir'] . DIRECTORY_SEPARATOR . HUMMELT_THEME_V3_PDF_FOLDER_NAME . DIRECTORY_SEPARATOR);
define('HUMMELT_THEME_V3_DOWNLOAD_DIR', $upload_dir['basedir'] . DIRECTORY_SEPARATOR . 'downloads' . DIRECTORY_SEPARATOR);

/**
 * Temp-Update DIR
 */
define('UPDATE_TEMP_FOLDER_DIR', $upload_dir['basedir'] . DIRECTORY_SEPARATOR . HUMMELT_THEME_V3_UPDATE_FOLDER_NAME . DIRECTORY_SEPARATOR);

/**
 * VENDOR URL
 */
const HUMMELT_THEME_V3_VENDOR_URL = HUMMELT_THEME_V3_ADMIN_URL . 'vendor/';

/**
 * VENDOR DIR
 */
const HUMMELT_THEME_V3_VENDOR_DIR = HUMMELT_THEME_V3_ADMIN_DIR . 'vendor';

/**
 * THEME VERSION
 */
define("HUMMELT_THEME_V3_VERSION", $theme_data->get('Version'));

/**
 * CHILD VERSION
 */
define("HUMMELT_THEME_V3_CHILD_VERSION", $childVersion);

/**
 * IF CHILD
 */
define("IF_THEME_CHILD", $ifChild);

/**
 * Gutenberg Bootstrap CSS
 */
const HUMMELT_THEME_V3_EDITOR_SHOW_BOOTSTRAP_CSS = true;

/**
 * DB-Version
 */
const HUMMELT_THEME_V3_DB_VERSION = '1.0.3';

global $wp_filesystem;
// create a file interaction object, if it is not already created
if( ! $wp_filesystem ){
    require_once ABSPATH . 'wp-admin/includes/file.php';
    WP_Filesystem();
}
if(!$wp_filesystem->is_dir(HUMMELT_THEME_V3_PDF_DIR)) {
    $wp_filesystem->mkdir(HUMMELT_THEME_V3_PDF_DIR, 0777);
}
if(!$wp_filesystem->is_dir(HUMMELT_THEME_V3_FONTS_DIR)) {
    $wp_filesystem->mkdir(HUMMELT_THEME_V3_FONTS_DIR, 0777);
}

if(!$wp_filesystem->is_dir(HUMMELT_THEME_V3_DOWNLOAD_DIR)) {
    $wp_filesystem->mkdir(HUMMELT_THEME_V3_DOWNLOAD_DIR, 0777);
    $htaccess = 'Require all denied';
    $wp_filesystem->put_contents(HUMMELT_THEME_V3_DOWNLOAD_DIR . '.htaccess', $htaccess);
}



/**
 * CSS Rest Url
 */
define('HUMMELT_THEME_V3_CSS_REST_URL', esc_url(rest_url('theme-v3-css/v' . HUMMELT_THEME_V3_VERSION . '/')));

/**
 * Load the required dependencies for this theme.
 */
require_once 'includes/class_hummelt_theme_v3.php';

global $hummelt_theme_v3;
$hummelt_theme_v3 = new Hummelt_Theme_V3();
$hummelt_theme_v3->run();
