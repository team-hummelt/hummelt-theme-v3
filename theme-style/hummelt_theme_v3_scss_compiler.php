<?php
namespace Hummelt\ThemeV3;
use Exception;
use ScssPhp\ScssPhp\Compiler;
use Hummelt_Theme_V3;
use ScssPhp\ScssPhp\OutputStyle;

class hummelt_theme_v3_scss_compiler
{
    private $compiler;
    private bool $should_compile = false;
    private string $scss_file;
    private string $css_file;
    private string $theme_directory;
    private bool $skip_environment_check = false;
    private array $file_mtime_check = [];
    private int $files_mtime;
    private bool $is_environment_dev;
    private string $file_id;

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
        $this->compiler               = new Compiler();
        $this->theme_directory        = ($this->shouldProcessChild()) ? get_stylesheet_directory() : get_template_directory();
        $this->is_environment_dev     = in_array(wp_get_environment_type(), array('development', 'local'), true);

    }

    public function scssFile(string $scss_file, $auto_set_css_file = true): static
    {
        $this->scss_file = $scss_file;

        if ($auto_set_css_file) {
            $this->css_file = str_replace('scss', 'css', $scss_file);
        }

        return $this;
    }

    public function cssFile(string $css_file): static
    {

        $this->css_file = $css_file;

        return $this;
    }

    public function getScssFile(): string
    {
        return $this->theme_directory . $this->scss_file;
    }

    public function getCssFile(): string
    {
        return $this->theme_directory . $this->css_file;
    }

    public function addImportPath(string $import_path): static
    {
        $this->compiler->addImportPath($import_path);

        return $this;
    }

    public function addModifiedCheck($file, $prefix_theme_directory = true): static
    {
        $this->file_mtime_check[] = ($prefix_theme_directory) ? $this->theme_directory . $file : $file;

        return $this;
    }

    public function addModifiedSelf(): static
    {
        $this->addModifiedCheck($this->scss_file);

        return $this;
    }

    public function addModifiedCheckDir($dir, $prefix_theme_directory = true): static
    {
        $dir   = ($prefix_theme_directory) ? $this->theme_directory . $dir : $dir;
        $files = glob($dir . '/*');
        foreach ($files as $file) {
            // check if file is a scss file
            if (pathinfo($file, PATHINFO_EXTENSION) !== 'scss') {
                continue;
            }
            $this->addModifiedCheck($file, false);
        }

        return $this;
    }

    public function addModifiedCheckTheme(): static
    {
        $this->addModifiedCheckDir('/theme-style/scss');

        return $this;
    }

    public function skipEnvironmentCheck($skip = true): static
    {
        $this->skip_environment_check = $skip;

        return $this;
    }

    private function generateId($input, $length = 8): string
    {
        return substr(md5($input), 0, $length);
    }


    private function addImportPaths(): void
    {
        $this->compiler->setImportPaths(dirname($this->theme_directory . $this->scss_file));

        if ($this->shouldProcessChild()) {
            $this->compiler->addImportPath(get_template_directory() . '/theme-style/scss/');
        }
    }

    private function setOutputStyle(): void
    {
        if ($this->is_environment_dev) {
            $source_map_url = site_url('', 'relative') . '/' . ltrim(str_replace(ABSPATH, '', $this->getCssFile()), '/');
            $source_map_url .= '.map';

            $this->compiler->setSourceMap(Compiler::SOURCE_MAP_FILE);
            $this->compiler->setSourceMapOptions([
                'sourceMapURL'      => $source_map_url,
                'sourceMapBasepath' => rtrim(str_replace('\\', '/', ABSPATH), '/'),
                'sourceRoot'        => site_url('', 'relative') . '/',
            ]);
            $this->compiler->setOutputStyle(OutputStyle::EXPANDED);
        } else {
            $this->compiler->setOutputStyle(OutputStyle::COMPRESSED);
        }
    }

    private function getModifiedTime(): void
    {
        $this->files_mtime = 0;
        foreach ($this->file_mtime_check as $file) {
            $this->files_mtime = max($this->files_mtime, filemtime($file));
        }
    }

    private function processModifiedCheck(): void
    {
        $this->getModifiedTime();

        $stored_modified = get_theme_mod('hummelt_theme_v3_scss_modified_timestamp_' . $this->file_id, 0);

        if ($this->files_mtime > $stored_modified) {
            $this->should_compile = true;
        }
    }

    private function extraChecks(): void
    {
        if ($this->is_environment_dev && !$this->skip_environment_check) {
            $this->should_compile = true;
        }

        if (!file_exists($this->getCssFile())) {
            $this->should_compile = true;
        }

        if (defined('HUMMELT_THEME_V3_SCSS_DISABLE_COMPILER') && HUMMELT_THEME_V3_SCSS_DISABLE_COMPILER ) {
            $this->should_compile = false;
        }
    }

    private function shouldProcessChild(): bool
    {
        return is_child_theme() && hummelt_theme_v3_child_has_scss();
    }

    public function compile(): void
    {
        $this->addImportPaths();
        $this->setOutputStyle();
        $this->file_id = $this->generateId($this->scss_file);
        $this->addModifiedSelf();
        if (!empty($this->file_mtime_check)) {
            $this->processModifiedCheck();
        }
        $this->extraChecks();

        if (!$this->should_compile) {
            return;
        }

        $this->compiler = apply_filters('hummelt-theme-v3/scss/compiler', $this->compiler);

        try {

            $compiled = $this->compiler->compileString(file_get_contents($this->getScssFile()));

            if (!file_exists(dirname($this->getCssFile()))) {
                mkdir(dirname($this->getCssFile()), 0755, true);
            }

            file_put_contents($this->getCssFile(), $compiled->getCss());
            if ($this->is_environment_dev) {
                file_put_contents($this->getCssFile() . '.map', $compiled->getSourceMap());
            }

            if (!empty($this->file_mtime_check)) {
                set_theme_mod('hummelt_theme_v3_scss_modified_timestamp_' . $this->file_id, $this->files_mtime);
            }
        } catch (Exception $e) {
            if ($this->is_environment_dev) {
                wp_die('<b>Hummelt Theme v3 SCSS Compiler - Caught exception:</b><br><br> ' . $e->getMessage());
            } else {
                wp_die('Something went wrong with the SCSS compiler.');
            }
        }
    }
}

/**
 * Check if the child theme has scss files included.
 *
 * @return boolean True when child theme has scss files.
 */
function hummelt_theme_v3_child_has_scss(): bool
{
    return file_exists(get_stylesheet_directory() . '/theme-style/scss/theme-custom.scss');
}

function hummelt_theme_v3_compile_scss(): void
{

    // Compile the main.scss file
    global $themeV3ScssCompiler;
    $themeV3ScssCompiler->scssFile('/theme-style/scss/theme-custom.scss')
        ->cssFile('/theme-style/css/theme-custom.css')
        ->addModifiedCheckTheme()
        ->addModifiedCheck(get_template_directory() . '/theme-style/scss/theme-custom.scss', false)
        ->compile();

}