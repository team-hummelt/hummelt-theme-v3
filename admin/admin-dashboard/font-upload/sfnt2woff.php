<?php

namespace Hummelt\ThemeV3;
use Exception;
use SimpleXMLElement;
class sfnt2woff
{
    const  SFNT2WOFF_VERSION_MAJOR = 3;
    const  SFNT2WOFF_VERSION_MINOR = 1;

    const  SIZEOF_SFNT_OFFSET      = 12;
    const  SIZEOF_SFNT_ENTRY       = 16;
    const  SIZEOF_WOFF_HEADER      = 44;
    const  SIZEOF_WOFF_ENTRY       = 20;

    const WOFF_SIGNATURE          = 0x774F4646;
    const WOFF_RESERVED           = 0;

    public $compression_level     = 6;
    public $strict                = true;
    public $version_major         = self::SFNT2WOFF_VERSION_MAJOR;
    public $version_minor         = self::SFNT2WOFF_VERSION_MINOR;

    private $sfnt_offset          = array();
    private $sfnt_tables          = array();
    private $woff_tables          = array();
    private $woff_meta            = array();
    private $woff_priv            = array();

    private $woff_flavor          = 0;
    private $woff_length          = 0;
    private $woff_numtables       = 0;
    private $woff_totalsfntsize   = 0;
    private $woff_metaoffset      = 0;
    private $woff_metalength      = 0;
    private $woff_metaoriglength  = 0;
    private $woff_privoffset      = 0;
    private $woff_privlength      = 0;

    /**
     * @throws Exception
     */
    public function import($sfnt): void {
        $sfnt_length = strlen($sfnt);
        $sfnt_tables = array();
        $woff_tables = array();

        if (self::SIZEOF_SFNT_OFFSET > $sfnt_length)
            throw new Exception("File does not contain SFNT data.");

        $sfnt_offset = unpack(
            "H8flavor/nnumTables",
            $sfnt
        );
        $table_count = $sfnt_offset["numTables"];

        for ($i = 0; $i < $table_count; $i++) {
            $offset = self::SIZEOF_SFNT_OFFSET + (
                    $i * self::SIZEOF_SFNT_ENTRY
                );
            $target = $offset + self::SIZEOF_SFNT_ENTRY;

            if ($target > $sfnt_length)
                throw new Exception("File ended unexpectedly.");

            $sfnt_tables[$i] = unpack(
                "a4tag/H8checkSum/H8offset/H8length",
                $sfnt,
                $offset
            );
            $sfnt_tables[$i]["offset"] = hexdec($sfnt_tables[$i]["offset"]);
            $sfnt_tables[$i]["length"] = hexdec($sfnt_tables[$i]["length"]);
            $target = $sfnt_tables[$i]["offset"] + $sfnt_tables[$i]["length"];

            if ($target > $sfnt_length)
                throw new Exception("File ended unexpectedly.");

            $sfnt_tables[$i]["tableData"] = substr(
                $sfnt,
                $sfnt_tables[$i]["offset"],
                $sfnt_tables[$i]["length"]
            );
        }

        $this->sfnt_offset = $sfnt_offset;
        $this->sfnt_tables = $sfnt_tables;
        $this->woff_tables = $woff_tables;
    }

    /**
     * @throws Exception
     */
    public function export(): string {
        $woff_export = "";
        $woff_flavor = $this->sfnt_offset["flavor"];
        $woff_tables = array();
        $sfnt_tables = $this->sort_tables_by_offset($this->sfnt_tables);
        $table_count = count($sfnt_tables);
        $woff_offset = self::SIZEOF_WOFF_HEADER + (
                $table_count * self::SIZEOF_WOFF_ENTRY
            );
        $sfnt_offset = self::SIZEOF_SFNT_OFFSET + (
                $table_count * self::SIZEOF_SFNT_ENTRY
            );

        if (empty($sfnt_tables))
            throw new Exception("No SFNT data to export.");

        for ($i = 0; $i < $table_count; $i++) {
            $sfnt_orig = $sfnt_tables[$i]["tableData"];
            $sfnt_comp = $this->compress($sfnt_orig);

            if (strlen($sfnt_comp) >= strlen($sfnt_orig))
                $sfnt_comp = $sfnt_orig;

            $woff_tables[$i] = array(
                "tag"          => $sfnt_tables[$i]["tag"],
                "offset"       => $woff_offset,
                "compLength"   => strlen($sfnt_comp),
                "origLength"   => strlen($sfnt_orig),
                "calcChecksum" => $this->calc_checksum($sfnt_orig),
                "origChecksum" => $sfnt_tables[$i]["checkSum"],
                "tableData"    => $this->pad_data($sfnt_comp)
            );

            $woff_offset = $woff_offset + strlen($woff_tables[$i]["tableData"]);
            $sfnt_offset = $sfnt_offset + strlen($this->pad_data($sfnt_orig));
        }

        if ($this->strict)
            $this->test_integrity($woff_tables);

        $woff_metaoffset     = 0;
        $woff_metalength     = 0;
        $woff_metaoriglength = 0;
        $woff_privoffset     = 0;
        $woff_privlength     = 0;

        if (!empty($this->woff_meta)) {
            $woff_metaoffset = $this->pad_offset($woff_offset);
            $woff_metalength = strlen($this->woff_meta["compData"]);
            $woff_metaoriglength = strlen($this->woff_meta["origData"]);

            $woff_offset = $woff_metaoffset + $woff_metalength;
        }

        if (!empty($this->woff_priv)) {
            $woff_privoffset = $this->pad_offset($woff_offset);
            $woff_privlength = strlen($this->woff_priv["privData"]);

            $woff_offset = $woff_privoffset + $woff_privlength;
        }

        $this->woff_tables         = $woff_tables;
        $this->woff_flavor         = $woff_flavor;
        $this->woff_length         = $woff_offset;
        $this->woff_numtables      = $table_count;
        $this->woff_totalsfntsize  = $sfnt_offset;
        $this->woff_metaoffset     = $woff_metaoffset;
        $this->woff_metalength     = $woff_metalength;
        $this->woff_metaoriglength = $woff_metaoriglength;
        $this->woff_privoffset     = $woff_privoffset;
        $this->woff_privlength     = $woff_privlength;

        $this->append_woff_header($woff_export);
        $this->append_woff_directory($woff_export);
        $this->append_woff_tables($woff_export);
        $this->append_woff_meta($woff_export);
        $this->append_woff_priv($woff_export);

        return $woff_export;
    }

    public function get_sfnt_entries(): array|false {
        $tables = $this->sfnt_tables;

        foreach ($tables as &$table)
            unset($table["tableData"]);

        return empty($tables) ?
            false :
            $tables ;
    }

    public function get_woff_entries(): array|false {
        $tables = $this->woff_tables;

        foreach ($tables as &$table)
            unset($table["tableData"]);

        return empty($tables) ?
            false :
            $tables ;
    }

    public function get_woff_meta(): string|false {
        return empty($this->woff_meta) ?
            false :
            $this->woff_meta["origData"] ;
    }

    /**
     * @throws Exception
     */
    public function set_woff_meta($object): void {
        if (!$object instanceof SimpleXMLElement)
            throw new Exception("Extended metadata must be a SimpleXMLElement.");

        $xml = $object->asXML();

        if ($xml === false)
            throw new Exception("Extended metadata object failed to return XML.");

        $this->woff_meta["origData"] = $xml;
        $this->woff_meta["compData"] = $this->compress($xml);
    }

    public function get_woff_priv(): string|false {
        return empty($this->woff_priv) ?
            false :
            $this->woff_priv["privData"] ;
    }

    /**
     * @throws Exception
     */
    public function set_woff_priv($string): void {
        if (!is_string($string))
            throw new Exception("Private data block must be a string.");

        if (strlen($string) === 0)
            throw new Exception("Private data block cannot be zero length.");

        $this->woff_priv["privData"] = $string;
    }

    /**
     * @throws Exception
     */
    private function compress($data): string {
        if (!function_exists("gzcompress"))
            throw new Exception("ZLIB support required.");

        $level = (int) $this->compression_level;

        if ($level < 1 or $level > 9)
            $level = 6;

        $comp = gzcompress($data, $level, ZLIB_ENCODING_DEFLATE);

        if ($data === false)
            throw new Exception("ZLIB compression failed.");

        return $comp;
    }

    private function pad_data($data): string {
        return str_pad(
            $data,
            (ceil(strlen($data) / 4) * 4),
            "\0",
            STR_PAD_RIGHT
        );
    }

    private function pad_offset($offset): int {
        return ceil($offset / 4) * 4;
    }

    private function calc_checksum($data): string {
        $data = $this->pad_data($data);
        $size = ceil(strlen($data) / 4);
        $sum = 0;

        for ($i = 0; $i < $size; $i++) {
            $array = unpack("H8unit", $data, $i * 4);
            $unit = hexdec($array["unit"]);

            # Simulate uint32 overflow.
            $sum = (($sum + $unit) & 0xffffffff);

            # Make uint32 result a float.
            $sum = hexdec(dechex($sum));
        }

        return str_pad(dechex($sum), 8, "0", STR_PAD_LEFT);
    }

    /**
     * @throws Exception
     */
    private function test_integrity($tables): void {
        foreach ($tables as $table) {
            $comp_checksum = $table["calcChecksum"];
            $orig_checksum = $table["origChecksum"];

            if ($table["tag"] == "head")
                continue;

            if ($comp_checksum !== $orig_checksum)
                throw new Exception("Checksum mismatch in table data.");
        }
    }

    private function sort_tables_by_tag($tables): array {
        usort($tables, function($a, $b) {
            return substr_compare($a["tag"], $b["tag"], 0);
        });
        return $tables;
    }

    private function sort_tables_by_offset($tables): array {
        usort($tables, function($a, $b) {
            if ($a["offset"] == $b["offset"])
                return 0;

            return ($a["offset"] < $b["offset"]) ? -1 : 1 ;
        });
        return $tables;
    }

    private function append_woff_header(&$data): void {
        $data.= pack(
            "N1H8N1n1n1N1n1n1N1N1N1N1N1",
            self::WOFF_SIGNATURE,
            $this->woff_flavor,
            $this->woff_length,
            $this->woff_numtables,
            self::WOFF_RESERVED,
            $this->woff_totalsfntsize,
            (int) $this->version_major,
            (int) $this->version_minor,
            $this->woff_metaoffset,
            $this->woff_metalength,
            $this->woff_metaoriglength,
            $this->woff_privoffset,
            $this->woff_privlength
        );
    }

    private function append_woff_directory(&$data): void {
        $woff_tables = $this->sort_tables_by_tag($this->woff_tables);

        foreach ($woff_tables as $woff_table)
            $data.= pack(
                "a4N1N1N1H8",
                $woff_table["tag"],
                $woff_table["offset"],
                $woff_table["compLength"],
                $woff_table["origLength"],
                $woff_table["origChecksum"]
            );
    }

    private function append_woff_tables(&$data): void {
        $woff_tables = $this->sort_tables_by_offset($this->woff_tables);

        foreach ($woff_tables as $woff_table)
            $data.= $woff_table["tableData"];
    }

    private function append_woff_meta(&$data): void {
        if (empty($this->woff_meta))
            return;

        $data = $this->pad_data($data);
        $data.= $this->woff_meta["compData"];
    }

    private function append_woff_priv(&$data): void {
        if (empty($this->woff_priv))
            return;

        $data = $this->pad_data($data);
        $data.= $this->woff_priv["privData"];
    }
}