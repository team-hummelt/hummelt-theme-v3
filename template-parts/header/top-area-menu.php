<?php

/**
 * Template part to initialize the navbar menu
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Bootscore
 * @version 6.0.0
 */


// Exit if accessed directly
defined('ABSPATH') || exit;
?>


<?php
// Bootstrap 5 Nav Walker
wp_nav_menu(array(
  'theme_location' => 'top-area-menu',
  'container'      => false,
  'menu_class'     => '',
  'fallback_cb'    => '__return_false',
  'items_wrap'     => '<ul id="top-area-navbar" class="navbar-top-area-menu navbar-nav list-unstyled">%3$s</ul>',
  'depth'          => 2,
  'walker'         => new bootstrap_5_wp_nav_menu_walker()
));
?>