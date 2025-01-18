<?php

/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Bootscore
 * @version 6.0.0
 */

// Exit if accessed directly
defined('ABSPATH') || exit;
global $wp_query;
$paged = $wp_query->get('pagename');
?>
<!doctype html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>

<body <?php body_class($paged); ?>>

<?php wp_body_open(); ?>

<div id="page" class="site">

    <a class="skip-link visually-hidden-focusable"
       href="#primary"><?php esc_html_e('Skip to content', 'bootscore'); ?></a>

    <!-- Top Bar Widget -->
    <!-- <?php if (is_active_sidebar('top-bar')) : ?>
            <?php dynamic_sidebar('top-bar'); ?>

    <?php endif; ?>-->
    <?php if (apply_filters('hummelt-theme-v3/top-menu/active', false)): ?>
        <div class="widget top-bar-widget">
            <div class="<?= apply_filters('hummelt-theme-v3/topbar/container', 'container', 'top_bar'); ?> py-2">
                <div class="d-flex flex-wrap align-items-center">
                    <?php if (has_nav_menu('top-area-menu') && apply_filters('hummelt-theme-v3/top_area_menu_order', 'active', 'menu', false)) : ?>
                        <div class="order-<?= apply_filters('hummelt-theme-v3/top_area_menu_order', 'order', 'menu', 1) ?> <?= apply_filters('hummelt-theme-v3/top_area_menu_order', 'css', 'menu', '') ?>">
                            <nav id="top-area-nav"
                                 class="top-area-navigation- navbar navbar-expand-lg"
                                 role="navigation"
                                 aria-label="<?php esc_attr_e('Hupa Top-Area Menu', 'bootscore'); ?>">

                                <!-- Offcanvas Navbar -->
                                <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvas-navbar-top-area">
                                    <div class="offcanvas-header">

                                        <!-- <span class="h5 offcanvas-title"><?= apply_filters('bootscore/offcanvas/navbar/title', __('Menu', 'bootscore')); ?></span>-->
                                        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"
                                                aria-label="Close"></button>
                                    </div>
                                    <div class="offcanvas-body">
                                        <!-- Bootstrap 5 Nav Walker Main Menu -->
                                        <?php get_template_part('template-parts/header/top-area-menu'); ?>
                                        <!-- Top Nav 2 Widget -->
                                    </div>
                                </div>
                                <button class="<?= apply_filters('bootscore/class/header/button', 'btn btn-outline-secondary', 'nav-toggler'); ?> <?= apply_filters('bootscore/class/header/navbar/toggler/breakpoint', 'd-lg-none'); ?> ms-1 ms-md-2 border-0 nav-toggler"
                                        type="button" data-bs-toggle="offcanvas"
                                        data-bs-target="#offcanvas-navbar-top-area"
                                        aria-controls="offcanvas-navbar">
                                    <i class="bi bi-list"></i><span class="visually-hidden-focusable">Menu</span>
                                </button>
                            </nav>
                        </div>
                    <?php endif; ?>
                    <?php if (is_active_sidebar('top-area-1') && apply_filters('hummelt-theme-v3/top_area_menu_order', 'active', 'top-menu-1', false)) : ?>
                    <div class="order-<?= apply_filters('hummelt-theme-v3/top_area_menu_order', 'order', 'top-menu-1', 2) ?> <?= apply_filters('hummelt-theme-v3/top_area_menu_order', 'css', 'top-menu-1', '') ?>">
                        <?php dynamic_sidebar('top-area-1'); ?>
                    </div>
                    <?php endif; ?>
                    <?php if (is_active_sidebar('top-area-2') && apply_filters('hummelt-theme-v3/top_area_menu_order', 'active', 'top-menu-2', false)) : ?>
                        <div class="order-<?= apply_filters('hummelt-theme-v3/top_area_menu_order', 'order', 'top-menu-2', 3) ?> <?= apply_filters('hummelt-theme-v3/top_area_menu_order', 'css', 'top-menu-2', '') ?>">
                            <?php dynamic_sidebar('top-area-2'); ?>
                        </div>
                    <?php endif; ?>
                    <?php if (is_active_sidebar('top-area-3') && apply_filters('hummelt-theme-v3/top_area_menu_order', 'active', 'top-menu-3', false)) : ?>
                        <div class="order-<?= apply_filters('hummelt-theme-v3/top_area_menu_order', 'order', 'top-menu-3', 4) ?> <?= apply_filters('hummelt-theme-v3/top_area_menu_order', 'css', 'top-menu-3', '') ?>">
                            <?php dynamic_sidebar('top-area-3'); ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    <?php endif; ?>

    <header id="masthead"
            class="<?= apply_filters('bootscore/class/header', 'sticky-top bg-body-tertiary'); ?> site-header">

        <nav id="nav-main"
             class="navbar navbar-root <?= apply_filters('bootscore/class/header/navbar/breakpoint', 'navbar-expand-lg'); ?>">

            <div class="<?= apply_filters('bootscore/class/container', 'container', 'header'); ?>">

                <!-- Navbar Brand -->
                <a class="navbar-brand" href="<?= esc_url(home_url()); ?>">
                    <?= apply_filters('hummelt-theme-v3/navbar/logo', get_template_directory_uri() . '/admin/assets/images/logo_hupa.svg', 'navbar') ?>
                </a>
                <!-- Offcanvas Navbar -->
                <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvas-navbar">
                    <div class="offcanvas-header">
                        <?= apply_filters('hummelt-theme-v3/navbar/logo', get_template_directory_uri() . '/admin/assets/images/logo_hupa.svg', 'mobil') ?>
                        <!-- <span class="h5 offcanvas-title"><?= apply_filters('bootscore/offcanvas/navbar/title', __('Menu', 'bootscore')); ?></span>-->
                        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"
                                aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <!-- Bootstrap 5 Nav Walker Main Menu -->
                        <?php get_template_part('template-parts/header/main-menu'); ?>
                        <!-- Top Nav 2 Widget -->
                        <?php if (is_active_sidebar('top-nav-2')) : ?>
                            <?php dynamic_sidebar('top-nav-2'); ?>
                        <?php endif; ?>
                    </div>
                </div>

                <div class="header-actions d-flex align-items-center">
                    <!-- Top Nav Widget -->
                    <?php if (is_active_sidebar('top-nav')) : ?>
                        <?php dynamic_sidebar('top-nav'); ?>
                    <?php endif; ?>

                    <?php
                    if (class_exists('WooCommerce')) :
                        get_template_part('template-parts/header/actions', 'woocommerce');
                    else :
                        get_template_part('template-parts/header/actions');
                    endif;
                    ?>

                    <!-- Navbar Toggler -->
                    <button class="<?= apply_filters('bootscore/class/header/button', 'btn btn-outline-secondary', 'nav-toggler'); ?> <?= apply_filters('bootscore/class/header/navbar/toggler/breakpoint', 'd-lg-none'); ?> ms-1 ms-md-2 nav-toggler"
                            type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas-navbar"
                            aria-controls="offcanvas-navbar">
                        <i class="bi bi-list"></i><span class="visually-hidden-focusable">Menu</span>
                    </button>

                </div><!-- .header-actions -->

            </div><!-- .container -->

        </nav><!-- .navbar -->

        <?php
        if (class_exists('WooCommerce')) :
            get_template_part('template-parts/header/collapse-search', 'woocommerce');
        else :
            get_template_part('template-parts/header/collapse-search');
        endif;
        ?>

        <!-- Offcanvas User and Cart -->
        <?php
        if (class_exists('WooCommerce')) :
            get_template_part('template-parts/header/offcanvas', 'woocommerce');
        endif;
        ?>

    </header><!-- #masthead -->
