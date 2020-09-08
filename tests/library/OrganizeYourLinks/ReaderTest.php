<?php

namespace OrganizeYourLinks;

use Exception;
use PHPUnit\Framework\TestCase;

class ReaderTest extends TestCase
{
    private string $listDir;
    private string $settingsFile;
    private Reader $subject;

    public function setUp() : void
    {
        $this->listDir = __DIR__.'/../../fixtures/list';
        $this->settingsFile = __DIR__.'/../../fixtures/settings.json';
        $this->subject = new Reader();
    }

    public function testReadDir()
    {

        $result = $this->subject->readDir($this->listDir);
        $expected = [
            ['id' => 'id1', 'tvdbId' => -1, 'name_de' => 'A File', 'name_en' => 'A File', 'name_jpn' => 'A File'],
            ['id' => 'id2', 'tvdbId' => -1, 'name_de' => 'C File 2', 'name_en' => 'C File 2', 'name_jpn' => 'C File 2'],
            ['id' => 'id3', 'tvdbId' => -1, 'name_de' => 'D File', 'name_en' => 'D File', 'name_jpn' => 'D File'],
            ['id' => 'id4', 'tvdbId' => -1, 'name_de' => 'G File', 'name_en' => 'G File', 'name_jpn' => 'G File'],
        ];
        $this->assertEquals($expected, $result);
    }

    /**
     * @throws Exception
     */
    public function testReadFile()
    {

        $result = $this->subject->readFile($this->settingsFile);
        $expected = [
            "startPage" => 4,
            "initialDataId" => "id2",
            "animationSpeedSingle" => 0.05,
            "animationSpeedMulti" => 0.1,
            "minSizeOfPlaylist" => 10,
            "colorBrightness" => 255,
            "titleLanguage" => "name_de",
            "episodeCount" => true
        ];
        $this->assertEquals($expected, $result);
    }
}
