<?php

/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package Bootscore
 * @version 6.0.0
 */

// Exit if accessed directly
defined('ABSPATH') || exit;

get_header();
?>
  <div id="content" class="site-content <?= apply_filters('bootscore/class/container', 'container', '404'); ?> <?= apply_filters('bootscore/class/content/spacer', 'pt-4 pb-5', '404'); ?>">
    <div id="primary" class="content-area">
      <main id="main" class="site-main">
          <?=apply_filters('hummelt-theme-v3/theme/header', get_the_ID(),'404')?>
        <section class="error-404 not-found">
          <div class="page-404">
            <!--<h1 class="mb-3">404</h1>-->
              <?= apply_filters('hummelt-theme-v3/get_the_title', get_the_ID(), '404') ?>
            <!-- Remove this line and place some widgets -->
              <?= apply_filters('hummelt-theme-v3/get_the_page', '404', '404-body') ?>
            <!-- 404 Widget -->
            <?php if (is_active_sidebar('404-page')) : ?>
              <div><?php dynamic_sidebar('404-page'); ?></div>
            <?php endif; ?>
              <?= apply_filters('hummelt-theme-v3/get_the_page', '404', '404-button') ?>
          </div>
        </section><!-- .error-404 -->
      </main><!-- #main -->
    </div><!-- #primary -->
  </div><!-- #content -->

<?php
get_footer();
