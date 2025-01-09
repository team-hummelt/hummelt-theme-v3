<?php

namespace Hummelt\ThemeV3;

use Exception;
use Hummelt_Theme_V3;
use ScssPhp\ScssPhp\Compiler;
use ScssPhp\ScssPhp\Exception\SassException;
use ScssPhp\ScssPhp\OutputStyle;

defined('ABSPATH') or die();

class hummelt_theme_v3_generate_auto_css
{
    use hummelt_theme_v3_selects;
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

    public function fn_generate_theme_css(): void
    {
        global $wp_filesystem;
        $dest = get_stylesheet_directory() . '/theme-style/scss/_auto-generate-theme.scss';
        if (!$wp_filesystem->is_file($dest)) {
            return;
        }
        $getThemeFont = function ($id, $fonts, $isArr = false) {
            $fontArr = [];
            if($isArr) {
                $fontArr = $fonts;
            } else {
                foreach ($fonts as $tmp) {
                    if ($tmp['id'] == $id) {
                        $fontArr = $tmp;
                        break;
                    }
                }
                if (!$fontArr) {
                    return [];
                }
            }


            $fontArr['family'] = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
            $fontArr['style'] = 'normal';
            $uppercase = $fontArr['uppercase'] ?? null;
            if($uppercase){
                $fontArr['uppercase'] = $fontArr['uppercase'] ? 'uppercase' : 'none';
            }

            $fontStyle = [];
            if ($fontArr['font-family'] && $fontArr['font-style']) {
                $dbFonts = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_font_by_args', $fontArr['font-family']);
                if (!$dbFonts) {
                    return $fontArr;
                }
                foreach ($dbFonts['fontData'] as $data) {
                    if ($data['id'] == $fontArr['font-style']) {
                        $fontStyle = $data;
                        break;
                    }
                }

                if (!$fontStyle) {
                    return $fontArr;
                }
            }

            if(isset($fontStyle['family'])){
                $family = sprintf('"%s", %s', $fontStyle['family'], $fontStyle['font_serif']);
                $fontArr['font-weight'] = $fontStyle['font_weight'];
                $fontArr['style'] = $fontStyle['font_style'];
            } else {
                $family = $fontArr['family'];
            }

            if (!$fontArr['standard']) {
                $fontArr['family'] = $family;
            }
            return $fontArr;
        };


        $settings = get_option(HUMMELT_THEME_V3_SLUG . '/settings');
        $themeDesign = $settings['theme_design'];
        $themeColor = $themeDesign['theme_color'];
        $themeFont = $themeDesign['theme_font'];
        $fontHeadline = $themeDesign['font_headline'];
        $themeWpGeneral = $settings['theme_wp_general'];
        $fontTopFooter = $themeDesign['top_footer'];


        $body = $getThemeFont('body', $themeFont);
        $infoFooter = $getThemeFont('info_footer', $fontTopFooter);
        $menu = $getThemeFont('menu', $themeFont);

        $menuBreak = $this->menu_breakpoints_select($themeWpGeneral['menu_breakpoint']);
        $menuUppercase = $themeColor['menu_uppercase'] ? 'uppercase' : 'none';

        //print_r($themeColor);


        $headArr = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        $headlines = '';
        foreach ($fontHeadline as $tmp) {
            if(in_array($tmp['id'], $headArr)) {
                $headlines .= $tmp['id'] . '{ ';
                if($tmp['standard']){
                   $headlines .= 'font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";';
                } else {
                    $fontData = $getThemeFont($tmp['id'], $tmp, true);
                    $headlines .= ' font-family: '.$fontData['family'].';';
                    $headlines .= ' font-size: calc('.$fontData['size_sm'].'px + ('.(int) $fontData['size'].' - '. (int)$fontData['size_sm'].') * ((100vw - 320px) / (1920 - 320)));';
                    $headlines .= ' font-style: '.$fontData['style'].';';
                    $headlines .= ' font-weight: '.$fontData['font-weight'].';';
                    $headlines .= ' line-height: '.$fontData['line-height'].';';
                    $headlines .= ' color: '.$fontData['color'].';';
                }
                $headlines .= ' } ';
            }
        }
        $headlines .= '@media (min-width: 1920px) { ';
        foreach ($fontHeadline as $tmp) {
            if(in_array($tmp['id'], $headArr)) {
                $headlines .= $tmp['id'] . '{ ';
                $headlines .= ' font-size: '.$tmp['size'].'px;';
                $headlines .= ' } ';
            }
        }
        $headlines .= ' } ';

       // print_r($themeColor);
        $fw_top = $themeWpGeneral['fw_top'] ? $themeWpGeneral['fw_top'].'px' : 0;
        $fw_right = $themeWpGeneral['fw_right'] ? $themeWpGeneral['fw_right'].'px' : 0;
        $fw_bottom = $themeWpGeneral['fw_bottom'] ? $themeWpGeneral['fw_bottom'].'px' : 0;
        $fw_left = $themeWpGeneral['fw_left'] ? $themeWpGeneral['fw_left'].'px' : 0;

        $scss = 'body {
                    font-family: '.$body['family'].';
                    font-size: calc('.$body['size_sm'].'px + ('.(int) $body['size'].' - '. (int)$body['size_sm'].') * ((100vw - 320px) / (1920 - 320))) !important;
                    background-color: '.$themeColor['site_bg'].' !important;
                    font-style: '.$body['style'].';
                    font-weight: '.$body['font-weight'].'!important;
                    line-height: '.$body['line-height'].'!important;
                    color: '.$body['color'].'!important;
                    '.$headlines.'
            }
            .custom-fullwidth, .alignfull, .container-fullwidth {
                 width: 100vw;
                 position: relative;
                 left: 50%;
                 margin-left: -50vw;
                 padding: '.$fw_top. ' '.$fw_right. ' '.$fw_bottom.' '.$fw_left.';
               }
        ';
        $scss .= '
            .bootscore-footer-info {
              font-family:  '.$infoFooter['family'].';
              background-color: '.$themeColor['footer_bg'].' !important;
              font-size: calc('.$infoFooter['size_sm'].'px + ('.(int) $infoFooter['size'].' - '. (int)$infoFooter['size_sm'].') * ((100vw - 320px) / (1920 - 320))) !important;
              font-style:  '.$infoFooter['style'].';
              font-weight: '.$infoFooter['font-weight'].';
              line-height: '.$infoFooter['line-height'].';
              color: '.$themeColor['static_footer_color'].';
              z-index: 2;
              @media (min-width: 1920px) {
                font-size: '.$infoFooter['size'].'px;
              }
            }
            .btn-top-button {
             background-color: '.$themeColor['scroll_btn_bg'].';
             color: '.$themeColor['scroll_btn_color'].';
            }
            
            .btn-scroll {
             --bs-btn-color: '.$themeColor['scroll_btn_color'].'!important;
             --bs-btn-bg: '.$themeColor['scroll_btn_bg'].'!important;
             --bs-btn-border-color: '.$themeColor['scroll_btn_bg'].'ef!important;
             --bs-btn-hover-color: '.$themeColor['scroll_btn_color'].'!important;
             --bs-btn-hover-bg: '.$themeColor['scroll_btn_bg'].'ef!important;
             --bs-btn-hover-border-color: '.$themeColor['scroll_btn_bg'].'ef!important;
             --bs-btn-active-color: '.$themeColor['scroll_btn_color'].'!important;
             --bs-btn-active-bg: '.$themeColor['scroll_btn_bg'].'!important;
             --bs-btn-active-border-color: '.$themeColor['scroll_btn_bg'].'!important;
             width: 40px;
             height: 40px;
             border-radius: 50%!important;
         }
         .hupa-box-shadow {
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2) !important;
        }
        .top-bar-widget {
            min-height: 56px;
            background-color: '.$themeColor['top_area_bg_color'].';
            color: '.$themeColor['top_area_font_color'].';
        }
        #top-area-navbar {
          a {
              color: '.$themeColor['top_area_font_color'].';
          }
           @media (max-width: '.$menuBreak['width'].'px) {
            a {
             color: currentColor;
             }
           }
        }
        #top-area-nav {
            button {
             &.btn-outline-secondary {
             color: '.$themeColor['top_area_font_color'].';
               &:hover {
                 background-color: transparent;
               }
             }
           }
        }
        .h5.offcanvas-title {
           font-family:  '.$menu['family'].';
        }
         .placeholder-shadow {
              position: absolute;
              width: 100%;
              z-index: 1;
              -webkit-box-shadow: 0 10px 13px -7px #00000080, 0 42px 45px -30px rgb(0 0 0 / 30%);
              box-shadow: 0 10px 13px -7px #00000080, 0 42px 45px -30px rgb(0 0 0 / 30%);
            }
            
            .placeholder-shadow-reverse {
              position: absolute;
              transform: rotate(180deg);
              width: 100%; 
              z-index: 1;
              -webkit-box-shadow: 0 10px 13px -7px #00000080, 0 42px 45px -30px rgb(0 0 0 / 30%);
              box-shadow: 0 10px 13px -7px #00000080, 0 42px 45px -30px rgb(0 0 0 / 30%);
            }
            
            .bg-navbar {
              padding-top: 1rem;
              padding-bottom: 1rem;
              border-bottom: 1px solid #d0d0d0;
              -webkit-transition: all 450ms;
              -moz-transition: all 450ms;
              -o-transition: all 450ms;
              transition: all 450ms;
            }
            
            @media (max-width: '.$menuBreak['width'].'px) {
              .bg-navbar .navbar.navbar-root {
                padding-top: 0;
                padding-bottom: 0;
              }
            }
            .bg-navbar {
             background-color: '.$themeColor['nav_bg'].';
            }
            .navbar {
                --bs-navbar-padding-y: 0!important;
            }
            .navbar.navbar-root {
               ul.navbar-nav li.menu-item:not(ul.navbar-nav li.menu-item ul li) {
                  padding-top: 0;
                  padding-bottom: .0;
                @media (max-width: '.$menuBreak['width'].'px) {
                  padding-top: 0;
                  padding-bottom: 0;
                 }
               }
              &.navbar-small {
                  ul.navbar-nav li.menu-item:not(ul.navbar-nav li.menu-item ul li) {
                  padding-top: 0;
                  padding-bottom: 0;
                 }
               }

              .open .dropdown-toggle,  .dropdown-toggle:focus:not(.mega-menu-wrapper .dropdown-toggle:focus) {
                background-color: '.$themeColor['menu_btn_hover_bg'].';
              }
            
              .dropdown-toggle.show, .menu-item.menu-item-has-children ~ .nav-link.dropdown-toggle.show:not(.mega-menu-wrapper .dropdown-toggle.show) {
                background-color: '.$themeColor['menu_btn_hover_bg'].'!important;
                color: '.$themeColor['menu_btn_hover_color'].'!important;
              }
              .navbar-nav .nav-link:not(.mega-menu-wrapper .nav-link) {
                margin: 0 0.1rem;
                padding: 0.5rem;
                text-transform: '.$menuUppercase.';
                font-family:  '.$menu['family'].';
                font-size: calc('.$menu['size_sm'].'px + ('.(int) $menu['size'].' - '. (int)$menu['size_sm'].') * ((100vw - 320px) / (1920 - 320))) !important;
                font-style:  '.$menu['style'].';
                font-weight: '.$menu['font-weight'].';
                line-height: '.$menu['line-height'].';
                -webkit-transition: all 350ms;
                -moz-transition: all 350ms;
                -o-transition: all 350ms;
                transition: all 350ms;
                
                @media (min-width: 1920px) {
                   font-size: '.$menu['size'].'px;
                 }
              }
              .navbar-nav .nav-link:not(.mega-menu-wrapper .nav-link):not(.nav-link.dropdown-toggle.active):not(li.current-menu-item a.active):not(.navbar-nav .nav-link:hover) {
                color: '.$themeColor['menu_btn_color'].';
                background-color: '.$themeColor['menu_btn_bg_color'].';
              }
              .navbar-nav .nav-link.show:not(.mega-menu-wrapper .nav-link.show):not(.nav-link.dropdown-toggle.active), .navbar-nav .show > .nav-link:not(.mega-menu-wrapper .nav-link.show):not(.nav-link.dropdown-toggle.active) {
                 color: '.$themeColor['menu_btn_hover_color'].'!important;
                font-weight: '.$menu['font-weight'].';
              }
            
              .dropdown-menu {
                -webkit-transition: all 350ms;
                -moz-transition: all 350ms; 
                -o-transition: all 350ms;
                transition: all 350ms;
                margin: .1rem 0 0;
              }
            
              .dropdown-menu:not(.mega-menu-wrapper):not(.mega-menu-wrapper .dropdown-menu) {
                 background-color: '.$themeColor['dropdown_bg'].';
                 font-weight: '.$menu['font-weight'].';
              }
            
              .dropdown-menu .dropdown-item {
                font-family:  '.$menu['family'].';
                font-size: calc('.$menu['size_sm'].'px + ('.(int) $menu['size'].' - '. (int)$menu['size_sm'].') * ((100vw - 320px) / (1920 - 320))) !important;
                font-style:  '.$menu['style'].';
                text-transform: '.$menuUppercase.';
                font-weight: '.$menu['font-weight'].';
                line-height: '.$menu['line-height'].';
                padding: .5rem 1rem;
                color: '.$themeColor['menu_dropdown_color'].';
                background-color: '.$themeColor['menu_dropdown_bg'].';
                 @media (min-width: 1920px) {
                   font-size: '.$menu['size'].'px;
                 }
              }
            
              .dropdown-menu li.menu-item {
                border-top: 1px solid '.$themeColor['menu_dropdown_color'].'70;
              }
            
              .dropdown-menu li.menu-item:first-child {
                border-top: none;
              }
            
              .dropdown-menu li.menu-item a.dropdown-item.active {
                border-bottom: none;
              }
              .dropdown-menu .dropdown-item:hover:not(.mega-menu-wrapper .dropdown-item:hover:hover), .dropdown-menu .menu-item:hover:not(.mega-menu-wrapper .menu-item:hover) {
                background-color: '.$themeColor['menu_dropdown_hover_bg'].';
                color: '.$themeColor['menu_dropdown_hover_color'].';
              }
            
              .navbar-nav .nav-link:hover:not(.mega-menu-wrapper .nav-link:hover) {
                background-color: '.$themeColor['menu_btn_hover_bg'].';
              }
            
              .nav-link.dropdown-toggle.active, li.current_page_item a, li.current-menu-parent.active a, li.current-menu-item.active a, li.current-menu-item a.active {
                background-color: '.$themeColor['menu_btn_active_bg'].';
                color: '.$themeColor['menu_btn_active_color'].';
                //border-bottom: 1px solid '.$themeColor['menu_dropdown_color'].'65;
              }
            
              .navbar-toggler {
                color: #474747;
                &:hover {
                  color: #474747;
                }
              }
              button.navbar-toggler span.fa {
                font-size: 1.6rem;
                color: #474747;
              }
              .dropdown-menu a.dropdown-item.active, .dropdown-menu .menu-item.current-menu-item {
                color: '.$themeColor['menu_dropdown_active_color'].';
                background-color: '.$themeColor['menu_dropdown_active_bg'].';
              }
              &:hover .navbar-nav:hover .nav-link:hover:not(.mega-menu-wrapper .nav-link:hover) {
                background-color: '.$themeColor['menu_btn_hover_bg'].';
                color: '.$themeColor['menu_btn_hover_color'].';
              }
               &:hover .navbar-nav:hover .nav-link.active:hover:not(.mega-menu-wrapper .nav-link:hover) {
                background-color: '.$themeColor['menu_btn_active_bg'].';
                color: '.$themeColor['menu_btn_active_color'].';
              }
              
              @media (max-width: '.$menuBreak['width'].'px) {
                .dropdown-menu-slide {
                  animation-duration: 2.3s;
                  -webkit-animation-duration: 0.3s;
                  animation-fill-mode: both;
                  -webkit-animation-fill-mode: both;
                }
              }
              
              .slideIn {
                -webkit-animation-name: slideIn;
                animation-name: slideIn;
              }
              @keyframes slideIn {
                0% {
                  transform: translateY(1rem);
                  opacity: 0;
                }
                100% {
                  transform: translateY(0rem);
                  opacity: 1;
                }
                0% {
                  transform: translateY(1rem);
                  opacity: 0;
                }
              }
              @-webkit-keyframes slideIn {
                0% {
                  -webkit-opacity: 0;
                }
                100% {
                  -webkit-transform: translateY(0);
                  -webkit-opacity: 1;
                }
                0% {
                  -webkit-transform: translateY(1rem);
                  -webkit-opacity: 0;
                }
              }
              .dropdown-menu-slide {
                 -webkit-animation-name: slideIn;
                 animation-name: slideIn;
                 animation-duration: 450ms;
               }
            }
        ';

        $compiler = new Compiler();
        $compiler->setOutputStyle(OutputStyle::EXPANDED);
        try {
            $css = $compiler->compileString($scss)->getCss();
            $wp_filesystem->put_contents($dest, $css);
        } catch (Exception|SassException $e) {
            echo 'Fehler beim Kompilieren: ' . $e->getMessage();
        }

    }

    private function fn_compress_string(string $string): string
    {
        if (!$string) {
            return $string;
        }
        return preg_replace(['/<!--(.*)-->/Uis', "/[[:blank:]]+/"], ['', ' '], str_replace(["\n", "\r", "\t"], '', $string));
    }
}

