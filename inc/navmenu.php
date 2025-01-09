<?php

/**
 * Nav menus
 *
 * @package Bootscore
 * @version 6.0.0
 */


// Exit if accessed directly
defined('ABSPATH') || exit;


/**
 * Register the nav menus
 */
if (!function_exists('bootscore_register_navmenu')) :
    function bootscore_register_navmenu()
    {
       // Register Menus
        register_nav_menu('main-menu', 'Main menu');
        register_nav_menu('top-area-menu', 'Top area menu');
        register_nav_menu('footer-menu', 'Footer menu');
        register_nav_menu('mega-menu-eins', 'Mega Menu (eins)');
        register_nav_menu('mega-menu-zwei', 'Mega Menu (zwei)');
        register_nav_menu('mega-menu-drei', 'Mega Menu (drei)');
        register_nav_menu('mega-menu-vier', 'Mega Menu (vier)');
    }
endif;
add_action('after_setup_theme', 'bootscore_register_navmenu');
