<?php
/**
 * Template Post Type: post
 *
 * @package Bootscore
 * @version 6.0.0
 */

// Exit if accessed directly
defined('ABSPATH') || exit;

get_header();
$singleOptions = apply_filters('hummelt-theme-v3/post/options', 'block');
?>
    <div id="content" class="site-content <?= apply_filters('bootscore/class/container', 'container', 'single-sidebar-none'); ?> <?= apply_filters('bootscore/class/content/spacer', 'pt-3 pb-5', 'single-sidebar-none'); ?>">
        <div id="primary" class="content-area">
            <?=apply_filters('hummelt-theme-v3/theme/header', get_the_ID(), is_404() ? '404' : 'post')?>
            <?php isset($singleOptions['post_breadcrumb']) && $singleOptions['post_breadcrumb'] && the_breadcrumb(); ?>
            <main id="main" class="site-main">
                <div class="entry-header">
                    <?php the_post(); ?>
                    <?php isset($singleOptions['show_kategorie']) && $singleOptions['show_kategorie'] && bootscore_category_badge(); ?>
                    <?= apply_filters('hummelt-theme-v3/get_the_title', get_the_ID(), 'post') ?>
                    <p class="entry-meta <?=$singleOptions['show']?>">
                        <small class="text-body-secondary">
                            <?php
                            isset($singleOptions['show_post_date']) && $singleOptions['show_post_date'] && bootscore_date();
                            isset($singleOptions['show_post_author']) && $singleOptions['show_post_author'] && bootscore_author();
                            isset($singleOptions['show_post_kommentar']) && $singleOptions['show_post_kommentar'] && bootscore_comment_count();
                            ?>
                        </small>
                    </p>
                    <?php isset($singleOptions['show_post_image']) && $singleOptions['show_post_image'] && bootscore_post_thumbnail(); ?>
                </div>

                <div class="entry-content">
                    <?php the_content(); ?>
                </div>

                <div class="entry-footer clear-both">
                    <div class="mb-4">
                        <?php isset($singleOptions['show_post_tags']) && $singleOptions['show_post_tags'] && bootscore_tags(); ?>
                    </div>
                    <!-- Related posts using bS Swiper plugin -->
                    <?php if (function_exists('bootscore_related_posts')) bootscore_related_posts(); ?>
                    <nav aria-label="bs page navigation">
                        <ul class="pagination justify-content-center">
                            <li class="page-item">
                                <?php previous_post_link('%link'); ?>
                            </li>
                            <li class="page-item">
                                <?php next_post_link('%link'); ?>
                            </li>
                        </ul>
                    </nav>
                    <?php comments_template(); ?>
                </div>

            </main>

        </div>
    </div>

<?php
get_footer();
