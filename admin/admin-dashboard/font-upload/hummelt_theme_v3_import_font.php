<?php
namespace Hummelt\ThemeV3;
/**
 * The admin-specific functionality of the theme.
 *
 * @link       https://wiecker.eu
 * @since      3.0.0
 *
 * @package    Hummelt_Theme_v3
 * @subpackage Hummelt_Theme_v3/admin
 */
defined('ABSPATH') or die();

use Exception;
use FontLib\Exception\FontNotFoundException;
use Hummelt_Theme_V3;
use FontLib\Font;
use stdClass;

class hummelt_theme_v3_import_font
{
    use hummelt_theme_v3_options;
    use hummelt_theme_v3_settings;
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

    /**

     * @throws Exception
     */
    public function fn_theme_hummelt_v3_font_import(array $pathInfo, $make = true): object
    {
        global $wp_filesystem;
        global $themeV3Helper;
        $return = new stdClass();
        $return->status = false;
        $return->font = [];
        if (!$pathInfo) {
            return $return;
        }
        $path = $pathInfo['dirname'] . DIRECTORY_SEPARATOR;
        $importFont = $this->font_info($pathInfo, $make);
        if($importFont->status) {
            $args = sprintf('WHERE designation="%s"', $importFont->font['family']);
            $fonts = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_font_data', $args);

            $ttf = '';
            $woff2 = '';
            $woff = '';
            $types = [];
            $local_Name = [];
            $scan = scandir($path);

            foreach ($scan as $val) {
                if ($val == "." || $val == "..") {
                    continue;
                }
                $info = pathinfo($path . $val);
                $extension = $info['extension'];
                $localName = $importFont->font['local_name'];
                $destDir = HUMMELT_THEME_V3_FONTS_DIR . $importFont->font['family'] . DIRECTORY_SEPARATOR;
                if(!$wp_filesystem->is_dir($destDir)){
                    $wp_filesystem->mkdir($destDir, 0777);
                }

               // $themeV3Helper->move_file($path .DIRECTORY_SEPARATOR . $val,  $destDir . $localName . '.' . $extension, true);
                $wp_filesystem->copy($path . DIRECTORY_SEPARATOR . $val, $destDir . $localName . '.' . $extension);
                $wp_filesystem->delete($path . DIRECTORY_SEPARATOR . $val);
                if($fonts->status) {
                    $fontsData = $fonts->record;
                    $localNameArr = json_decode($fontsData->localName, true);
                    $local_Name = array_merge_recursive($localNameArr, [$localName]);
                    if ($fontsData->isTtf) {
                        $ttf = 'ttf';
                    }
                    if ($fontsData->isWoff) {
                        $woff = 'woff';
                    }
                    if ($fontsData->isWoff2) {
                        $woff2 = 'woff2';
                    }
                    $types = [$ttf, $woff, $woff2, $extension];
                } else {
                    $local_Name[] = $localName;
                    $types[] = $extension;
                }
            }

            $local_Name = array_merge(array_unique(array_filter($local_Name)));
            $types = array_merge(array_unique(array_filter($types)));
            $record = new stdClass();
            if ($fonts->status) {
                $fontsData = $fonts->record;
                $record->id = $fontsData->id;
                $fonData =json_decode($fontsData->fontData, true);
                $fontInfo = json_decode($fontsData->fontInfo, true);
                $record->fontData = json_encode(array_merge_recursive($fonData, [$importFont->font]));
                $record->fontInfo = json_encode(array_merge_recursive($fontInfo, [$importFont->font_info]));
            } else {
                $record->fontData = json_encode([$importFont->font]);
                $record->fontInfo= json_encode([$importFont->font_info]);
            }

            $record->designation = $importFont->font['family'];
            $record->localName = json_encode($local_Name);
            $record->isTtf = in_array('ttf', $types);
            $record->isWoff = in_array('woff', $types);
            $record->isWoff2 = in_array('woff2', $types);
            $record->fontSerif = $importFont->font_serif;
            if($fonts->status){
                apply_filters(HUMMELT_THEME_V3_SLUG . '/update_font_data', $record);
                $id = $record->id;
            } else {
              $insert = apply_filters(HUMMELT_THEME_V3_SLUG . '/set_font_data', $record);
              $id = $insert->id;
            }
            $args = sprintf('WHERE id=%d', $id);
            $fontsDb = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_font_data', $args);
            do_action(HUMMELT_THEME_V3_SLUG . '/add_font_theme_json', $importFont->font['family'], $importFont->font_serif);
            $font = [];
            if($fontsDb->status) {
                $font = apply_filters(HUMMELT_THEME_V3_SLUG . '/get_font_by_args', $id);
                $return->msg = 'Schrift erfolgreich gespeichert';
                $return->status = true;
            }
            $return->font = $font;
        } else {
            $return->msg = $importFont->msg;
        }
        return $return;
    }

    protected function font_info($pathInfo, $make): object
    {
        global $wp_filesystem;
        global $themeV3Helper;
        $return = new stdClass();
        $return->status = false;
        $return->msg = 'An error has occurred';

        $path = $pathInfo['dirname'] . DIRECTORY_SEPARATOR;
        $basename = $pathInfo['basename'];
        $fileName = $pathInfo['filename'];
        $ext = $pathInfo['extension'];
        $filePath = $path . $basename;
        if (!$wp_filesystem->is_file($filePath)) {
            return $return;
        }
        if ($ext != 'ttf') {
            return $return;
        }
        $ttfInfo = (new TTFInfo())->setFontFile($filePath);
        $fontInfo = $ttfInfo->getFontInfo();
        $localName = $fontInfo[TTFInfo::NAME_POSTSCRIPT_NAME];
        $full_name = $fontInfo[TTFInfo::NAME_FULL_NAME];
        $firstFamily = $fontInfo[TTFInfo::NAME_NAME] ?? false;
        $prefer_family = $fontInfo[TTFInfo::NAME_PREFERRE_FAMILY] ?? false;
        $sub_family = $fontInfo[TTFInfo::NAME_SUBFAMILY];

        if ($prefer_family) {
            $family = $prefer_family;
        } else {
            $family = $firstFamily;
        }
        if (!$family || !$localName || !$full_name || !$sub_family) {
            //$this->uploaderHelper->deleteFile($basename, $this->uploaderHelper::FONT_DIR, true);
            $wp_filesystem->delete(HUMMELT_THEME_V3_FONTS_DIR . $basename);
            return $return;
        }
        $isFontStyleInstall = $themeV3Helper->fn_check_is_font_installed($family, $localName);
        if ($isFontStyleInstall) {
            $wp_filesystem->delete(HUMMELT_THEME_V3_FONTS_DIR . $basename);
            $return->msg = 'Font already exists';
            return $return;
        }


        $lowerName = strtolower($full_name);
        $lowerName = explode(' ', $lowerName);
        $weight = '';
        $fontWeight = '';
      /*  foreach ($lowerName as $name) {
            $weight = $this->get_font_weight($name);
            if ($weight) {
                $fontWeight = $weight['weight'];
                break;
            }
        }*/


        $fontStyle = "normal";
        $serif = 'serif';
        try {
            $font = Font::load($filePath);
            $font->parse();
            $os2 = $font->getData('OS/2');
            $fsSelection = $os2['fsSelection'] ?? null;
            $panose = $os2['panose'] ?? null;
            if ($panose) {
                $serifType = $panose[0];
                if ($serifType == 2) {
                    $serif = 'sans-serif';
                }
            }
            $fontWeight = $font->getFontWeight();
            if ($fsSelection !== null) {
                $isItalic = ($fsSelection & 0x01) != 0;
                $isBold = ($fsSelection & 0x20) != 0;
                if ($isItalic && $isBold) {
                    $fontStyle = "italic";
                } elseif ($isItalic) {
                    $fontStyle = "italic";
                }
            }
            $font->close();
        } catch (FontNotFoundException $e) {

        }

        if (!$fontWeight) {
            $fontWeight = 'normal';
        }

       /* $lowerSubFamily = strtolower($sub_family);
        if ($lowerSubFamily == 'italic') {
            $fontStyle = 'italic';
        } else {
            $fontStyle = 'normal';
        }*/
        $addId = uniqid();
        $infoArr = [
            '0' => [
                'id' => 1,
                'value' => $fontInfo[TTFInfo::NAME_NAME] ?? 'unknown',
                'label' => 'Font Family',
                'full' => false,
            ],
            '1' => [
                'id' => 9,
                'value' => $fontInfo[TTFInfo::NAME_DESIGNER] ?? 'unknown',
                'label' => 'Designer',
                'full' => false,
            ],
            '2' => [
                'id' => 11,
                'value' => $fontInfo[TTFInfo::NAME_VENDOR_URL] ?? 'unknown',
                'label' => 'Vendor url',
                'full' => false,
            ],
            '3' => [
                'id' => 12,
                'value' => $fontInfo[TTFInfo::NAME_DESIGNER_URL] ?? 'unknown',
                'label' => 'Designer url',
                'full' => false,
            ],
            '4' => [
                'id' => 13,
                'value' => $fontInfo[TTFInfo::NAME_LICENSE] ?? 'unknown',
                'label' => 'License',
                'full' => false,
            ],
            '5' => [
                'id' => 14,
                'value' => $fontInfo[TTFInfo::NAME_LICENSE_URL] ?? 'unknown',
                'label' => 'License url',
                'full' => false,
            ],
            '6' => [
                'id' => 256,
                'value' => $fontInfo[TTFInfo::NAME_FEATURES_ENABLED_ONE] ?? 'unknown',
                'label' => 'Functions activated',
                'full' => false,
            ],
            '7' => [
                'id' => 257,
                'value' => $fontInfo[TTFInfo::NAME_FEATURES_ENABLED_TWO] ?? 'unknown',
                'label' => 'Functions activated',
                'full' => false,
            ],
            '8' => [
                'id' => 258,
                'value' => $fontInfo[TTFInfo::NAME_FONT_LIGATURES] ?? 'unknown',
                'label' => 'Font ligaturen',
                'full' => false,
            ],
            '9' => [
                'id' => 259,
                'value' => $fontInfo[TTFInfo::NAME_REQUIRED_LIGATURES] ?? 'unknown',
                'label' => 'Required Font ligaturen',
                'full' => false,
            ],
            '10' => [
                'id' => 260,
                'value' => $fontInfo[TTFInfo::NAME_FARSI_LIGATURES] ?? 'unknown',
                'label' => 'Farsi ligatures',
                'full' => false,
            ],
            '11' => [
                'id' => 2,
                'value' => $fontInfo[TTFInfo::NAME_SUBFAMILY] ?? 'unknown',
                'label' => 'Sub-Family',
                'full' => false,
            ],
            '12' => [
                'id' => 3,
                'value' => $fontInfo[TTFInfo::NAME_SUBFAMILY_ID] ?? 'unknown',
                'label' => 'Sub-Family-ID',
                'full' => false,
            ],
            '13' => [
                'id' => 4,
                'value' => $fontInfo[TTFInfo::NAME_FULL_NAME] ?? 'unknown',
                'label' => 'Font full name',
                'full' => false,
            ],
            '14' => [
                'id' => 5,
                'value' => $fontInfo[TTFInfo::NAME_VERSION] ?? 'unknown',
                'label' => 'Version',
                'full' => false,
            ],
            '15' => [
                'id' => 6,
                'value' => $fontInfo[TTFInfo::NAME_POSTSCRIPT_NAME] ?? 'unknown',
                'label' => 'Postscript name',
                'full' => false,
            ],
            '16' => [
                'id' => 10,
                'value' => $fontInfo[TTFInfo::NAME_DESCRIPTION] ?? 'unknown',
                'label' => 'Description',
                'full' => true,
            ],
        ];

        $info = [
            'id' => $addId,
            'info' => $infoArr
        ];

        if ($make) {
            //$this->font_woff2($pathInfo);
            $sfnt2woff = new sfnt2woff();
            $sfnt = $wp_filesystem->get_contents($filePath);

            try {
                $sfnt2woff->import($sfnt);
            } catch (Exception $e) {
                return $return;
            }
            $sfnt2woff->strict = false;
            $sfnt2woff->compression_level = 9;
            $sfnt2woff->version_major = 1;
            $sfnt2woff->version_minor = 1;
            try {
                $woff = $sfnt2woff->export();
            } catch (Exception $e) {
                return $return;
            }
            $wp_filesystem->put_contents($path . $fileName . '.woff', $woff);
        }

        $font = [
            'id' => $addId,
            'local_name' => $localName,
            'full_name' => $full_name,
            'first_family' => $firstFamily,
            'prefer_family' => $prefer_family,
            'sub_family' => $sub_family,
            'family' => $family,
            'font_weight' => $fontWeight,
            'font_style' => $fontStyle,
            'font_serif' => $serif
        ];

        $return->font_weight = $fontWeight;
        $return->font_style = $fontStyle;
        $return->font_serif = $serif;
        $return->font_info = $info;
        $return->font = $font;
        $return->msg = '';
        $return->status = true;
        return $return;
    }

    protected function font_woff2($pathInfo): object
    {
        $return = new stdClass();
        $return->status = false;
        $path = $pathInfo['dirname'] . DIRECTORY_SEPARATOR;
        $fileName = $pathInfo['filename'];
        $ext = $pathInfo['extension'];
        $baseName = $pathInfo['basename'];
        $font_file = $path . $baseName;
        if (!is_file($font_file)) {
            return $return;
        }

        $subsets = [
            //  "cyrillic-ext" => "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F",
            // "cyrillic" => "+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
            // "greek-ext" => "U+1F00-1FFF",
            // "greek" => "U+0370-03FF",
            // "latin-ext" => "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF",
            "latin" => "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"
        ];

        foreach ($subsets as $subset => $range) {
            $output_filename = $path . $fileName . '.woff2';
            $cmd = 'pyftsubset "' . $font_file . '" --output-file="' . $output_filename . '" --flavor=woff2 --layout-features="*" --unicodes="' . $range . '"';
            exec($cmd);
            // $this->bus->dispatch(new RunCommandMessage($cmd));
        }

        return $return;
    }


}