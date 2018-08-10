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
            ['id' => 'id1', 'name' => 'A File'],
            ['id' => 'id2', 'name' => 'C File 2'],
            ['id' => 'id3', 'name' => 'D File'],
            ['id' => 'id4', 'name' => 'G File'],
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
            "colorBrightness" => 255
        ];
        $this->assertEquals($expected, $result);
    }
}
