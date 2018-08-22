<?php

namespace OrganizeYourLinks;

use PHPUnit\Framework\TestCase;

class ReaderTest extends TestCase
{
    private $listDir = __DIR__.'/../../fixtures/list';
    private $settingsFile = __DIR__.'/../../fixtures/settings.json';

    public function testReadDir()
    {
        $subject = new Reader();
        $subject->readDir($this->listDir);
        $result = $subject->getContent();
        $expected = [
            ['id' => 'id1', 'tvdbId' => -1, 'name_de' => 'A File', 'name_en' => 'A File', 'name_jpn' => 'A File'],
            ['id' => 'id2', 'tvdbId' => -1, 'name_de' => 'C File 2', 'name_en' => 'C File 2', 'name_jpn' => 'C File 2'],
            ['id' => 'id3', 'tvdbId' => -1, 'name_de' => 'D File', 'name_en' => 'D File', 'name_jpn' => 'D File'],
            ['id' => 'id4', 'tvdbId' => -1, 'name_de' => 'G File', 'name_en' => 'G File', 'name_jpn' => 'G File'],
        ];
        $this->assertEquals($expected, $result);
    }

    /**
     * @throws \Exception
     */
    public function testReadFile()
    {
        $subject = new Reader();
        $subject->readFile($this->settingsFile);
        $result = $subject->getContent();
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
