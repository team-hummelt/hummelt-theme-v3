<?php

/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Bootscore
 * @version 6.0.0
 */

// Exit if accessed directly
defined('ABSPATH') || exit;

get_header();
?>

    <div id="content" class="site-content <?= apply_filters('bootscore/class/container', 'container', 'page-sidebar-none'); ?> <?= apply_filters('bootscore/class/content/spacer', 'pt-4 pb-5', 'page-sidebar-none'); ?>">
        <div id="primary" class="content-area">
            <main id="main" class="site-main">
                <div class="entry-header">
                    <?=apply_filters('hummelt-theme-v3/theme/header', get_the_ID(), 'page')?>
                    <?php the_post(); ?>
                    <?= apply_filters('hummelt-theme-v3/get_the_title', get_the_ID(), 'page') ?>
                    <?php //bootscore_post_thumbnail(); ?>
                </div>
                <div class="entry-content">
                    <?php the_content(); ?>
                </div>
                <div class="entry-footer">
                    <?php comments_template(); ?>
                </div>
            </main>
        </div>
    </div>

<?php
get_footer();
