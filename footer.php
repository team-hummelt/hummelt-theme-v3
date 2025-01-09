<?php

/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Bootscore
 * @version 6.0.0
 */

// Exit if accessed directly
defined('ABSPATH') || exit;

?>


<footer class="bootscore-footer">
    <?= apply_filters( 'hummelt-theme-v3/edit_link', 'edit_link') ?>
    <?php if (is_active_sidebar('footer-top')) : ?>
        <div class="<?= apply_filters('bootscore/class/footer/top', 'bg-body-tertiary border-bottom py-5'); ?> bootscore-footer-top">
            <div class="<?= apply_filters('bootscore/class/container', 'container', 'footer-top'); ?>">
                <?php dynamic_sidebar('footer-top'); ?>
            </div>
        </div>
    <?php endif; ?>

    <?php if (apply_filters('hummelt-theme-v3/show/widget_footer', false)): ?>
    <div class="<?= apply_filters('bootscore/class/footer/columns', 'pt-5 pb-4'); ?> bootscore-footer-columns">
        <div class="<?= apply_filters('bootscore/class/container', 'container', 'footer-columns'); ?>">

            <div class="row">
                <div class="<?= apply_filters('bootscore/class/footer/col', 'col-lg-3', 'footer-1'); ?> col-12">
                    <?php if (is_active_sidebar('footer-1')) : ?>
                        <?php dynamic_sidebar('footer-1'); ?>
                    <?php endif; ?>
                </div>

                <div class="<?= apply_filters('bootscore/class/footer/col', 'col-lg-3', 'footer-2'); ?> col-12">
                    <?php if (is_active_sidebar('footer-2')) : ?>
                        <?php dynamic_sidebar('footer-2'); ?>
                    <?php endif; ?>
                </div>

                <div class="<?= apply_filters('bootscore/class/footer/col', 'col-lg-3', 'footer-3'); ?> col-12">
                    <?php if (is_active_sidebar('footer-3')) : ?>
                        <?php dynamic_sidebar('footer-3'); ?>
                    <?php endif; ?>
                </div>

                <div class="<?= apply_filters('bootscore/class/footer/col', 'col-lg-3', 'footer-4'); ?> col-12">
                    <?php if (is_active_sidebar('footer-4')) : ?>
                        <?php dynamic_sidebar('footer-4'); ?>
                    <?php endif; ?>
                </div>
            </div>
            <!-- Bootstrap 5 Nav Walker Footer Menu -->
            <?php //get_template_part('template-parts/footer/footer-menu'); ?>
        </div>
    </div>
    <?php endif; ?>
    <?=apply_filters('hummelt-theme-v3/theme/footer', get_the_ID(), is_404() ? '404' : 'page')?>
    <?php if (apply_filters('hummelt-theme-v3/show/footer', true)): ?>
        <div class="<?= apply_filters('bootscore/class/footer/info', 'bg-body-tertiary text-body-secondary border-top py-2 text-center'); ?> bootscore-footer-info">
            <div class="<?= apply_filters('bootscore/class/container', 'container', 'footer-info'); ?>">
                <?php if (is_active_sidebar('footer-info')) : ?>
                    <?php dynamic_sidebar('footer-info'); ?>
                <?php else: ?>
                    <div class="bootscore-copyright"><span class="cr-symbol">&copy;</span>&nbsp;<?= date('Y'); ?>
                        hummelt
                        und partner
                    </div>
                <?php endif; ?>
            </div>
        </div>
    <?php endif; ?>
</footer>

<!-- To top button -->
<a href="#"
   class="<?= apply_filters('bootscore/class/footer/to_top_button', 'btn btn-primary shadow'); ?> position-fixed zi-1000 top-button"><i
            class="bi bi-chevron-up"></i><span class="visually-hidden-focusable">To top</span></a>

</div><!-- #page -->

<?php wp_footer(); ?>

</body>

</html>