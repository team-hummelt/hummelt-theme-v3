<?php

namespace Hummelt\ThemeV3;

use Hummelt_Theme_V3;

defined('ABSPATH') or die();

class  theme_v3_gutenberg_patterns
{
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
    }

    public function register_theme_v3_gutenberg_patterns(): void
    {
        $args = array(
            'taxonomy' => 'theme_design_category',
            'hide_empty' => false,
            'parent' => 0
        );
        $cats = get_terms($args);
       // print_r($cats);

        foreach ($cats as $cat) {
            $args = [
                'posts_per_page' => -1,
                'orderby' => 'menu_order',
                'order' => 'ASC',
                'post_type' => 'theme_design',
                'post_status' => 'publish',
                'suppress_filters' => true,
                'tax_query' => [
                    [
                        'taxonomy' => 'theme_design_category',
                        'field' => 'term_id',
                        'terms' => $cat->term_id
                    ]
                ]
            ];

            $items = get_posts($args);
            foreach ($items as $item) {
                $ID = $item->ID;
                $content = get_post_field('post_content', $ID);
                $title = $item->post_title . " Vorlage";
                $slug = $item->post_name . "-pattern";
                register_block_pattern(
                    $slug,
                    array(
                        'title' => $title,
                        'description' => 'Theme V3 Designvorlage',
                        'content' => $content,
                        'categories' => [
                            'hupaPattern/' . $cat->slug,
                        ],
                    )
                );
            }
        }
    }

    public function register_theme_v3_block_pattern_category(): void
    {

        $args = array(
            'taxonomy' => 'theme_design_category',
            'hide_empty' => false,
            'parent' => 0
        );
        $cats = get_terms($args);

        foreach ($cats as $cat) {
            register_block_pattern_category(
                'hupaPattern/' . $cat->slug,
                [
                    'label' => $cat->name,
                ]
            );
        }


    }

    public function register_theme_v3_block_pattern_vorlagen(): void
    {
        register_block_pattern_category(
            'hummeltPatternV3', // Slug der Kategorie
            ['label' => __('Theme v3 Examples', 'bootscore')] // Name und Übersetzung
        );
    }

}