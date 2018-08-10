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
                'name' => 'test'
            ],
            [
                'id' => 'id2',
                'name' => 'test'
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
        $this->assertEquals(['id' => 'id1', 'name' => 'test'], $file1);
        $this->assertEquals(['id' => 'id2', 'name' => 'test'], $file2);
    }

    public function testUpdateFiles2()
    {
        $data = [
            [
                'id' => 'id1',
                'name' => 'A File'
            ],
            [
                'id' => 'id2',
                'name' => 'C File 2'
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
                'name' => 'A File'
            ],
            [
                'id' => 'id0',
                'name' => 'A File'
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
            "colorBrightness" => 255
        ];
        $expectedErrors = [];
        $subject = new Writer($this->settings, $this->map);
        $subject->updateFile($data);
        $errors = $subject->getErrorList();
        $this->assertEquals($expectedErrors, $errors);
    }
}
