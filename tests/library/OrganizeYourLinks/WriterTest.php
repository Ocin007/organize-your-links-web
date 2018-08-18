<?php

namespace OrganizeYourLinks;

use PHPUnit\Framework\TestCase;

class WriterTest extends TestCase
{
    private $listDir = __DIR__.'/../../fixtures/list';
    private $settings = __DIR__.'/../../fixtures/settings.json';
    private $mapFile = __DIR__.'/../../fixtures/list-map.json';
    private $map;

    function __construct(string $name = null, array $data = [], string $dataName = '')
    {
        parent::__construct($name, $data, $dataName);
        $this->map = json_decode(file_get_contents($this->mapFile), true);
    }

    public function testUpdateFiles1()
    {
        $data = [
            [
                'id' => 'id1',
                'tvdbId' => -1,
                'name_de' => 'test',
                'name_en' => 'test',
                'name_jpn' => 'test'
            ],
            [
                'id' => 'id2',
                'tvdbId' => -1,
                'name_de' => 'test',
                'name_en' => 'test',
                'name_jpn' => 'test'
            ]
        ];
        $expected = ['id1', 'id2'];
        $subject = new Writer($this->listDir, $this->map);
        $subject->updateFiles($data);
        $result = $subject->getIdListOfUpdatedFiles();
        $errors = $subject->getErrorList();
        $this->assertEquals($expected, $result);
        $this->assertEquals([], $errors);
        $file1 = json_decode(file_get_contents($this->listDir.'/a-file.json'), true);
        $file2 = json_decode(file_get_contents($this->listDir.'/c-file2.json'), true);
        $this->assertEquals($data[0], $file1);
        $this->assertEquals($data[1], $file2);
    }

    public function testUpdateFiles2()
    {
        $data = [
            [
                'id' => 'id1',
                'tvdbId' => -1,
                'name_de' => 'A File',
                'name_en' => 'A File',
                'name_jpn' => 'A File'
            ],
            [
                'id' => 'id2',
                'tvdbId' => -1,
                'name_de' => 'C File 2',
                'name_en' => 'C File 2',
                'name_jpn' => 'C File 2'
            ]
        ];
        $expected = ['id1', 'id2'];
        $subject = new Writer($this->listDir, $this->map);
        $subject->updateFiles($data);
        $result = $subject->getIdListOfUpdatedFiles();
        $this->assertEquals($expected, $result);
    }

    public function testUpdateFilesError()
    {
        $data = [
            [
                'id' => 'id1',
                'tvdbId' => -1,
                'name_de' => 'A File',
                'name_en' => 'A File',
                'name_jpn' => 'A File'
            ],
            [
                'id' => 'id0',
                'tvdbId' => -1,
                'name_de' => 'A File',
                'name_en' => 'A File',
                'name_jpn' => 'A File'
            ]
        ];
        $expectedResult = ['id1'];
        $expectedErrors = ['id' => ['id0']];
        $subject = new Writer($this->listDir, $this->map);
        $subject->updateFiles($data);
        $result = $subject->getIdListOfUpdatedFiles();
        $errors = $subject->getErrorList();
        $this->assertEquals($expectedResult, $result);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testUpdateFile()
    {
        $data = [
            "startPage" => 4,
            "initialDataId" => 'id2',
            "animationSpeedSingle" => 0.05,
            "animationSpeedMulti" => 0.1,
            "minSizeOfPlaylist" => 10,
            "colorBrightness" => 255,
            "titleLanguage" => "name_de"
        ];
        $expectedErrors = [];
        $subject = new Writer($this->settings, $this->map);
        $subject->updateFile($data);
        $errors = $subject->getErrorList();
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testcreateNewFiles()
    {
        $dataListMap = [
            'test1.json' => [
                'id' => '',
                'tvdbId' => -1,
                'name_de' => 'A File',
                'name_en' => 'A File',
                'name_jpn' => 'A File'
            ]
        ];
        $subject = new Writer($this->listDir, $this->map);
        $subject->createNewFiles($dataListMap, $this->mapFile);
        $expected = [
            '.',
            '..',
            'a-file.json',
            'c-file2.json',
            'd-file.json',
            'g-file.json',
            'test1.json'
        ];
        $result = scandir($this->listDir);
        $this->assertEquals($expected, $result);
        unlink($this->listDir.'/test1.json');
        file_put_contents($this->mapFile, json_encode([
            "id1" => "a-file.json",
            "id2" => "c-file2.json",
            "id3" => "d-file.json",
            "id4" => "g-file.json"
        ], JSON_PRETTY_PRINT));
    }
}
