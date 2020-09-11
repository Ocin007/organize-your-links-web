<?php

namespace OrganizeYourLinks\Validator;

use Mockery;
use OrganizeYourLinks\Generator\FileNameGenerator;
use OrganizeYourLinks\Reader;
use PHPUnit\Framework\TestCase;

class NameValidatorTest extends TestCase
{
    private string $listDir;
    private $readerMock;
    private $fileNameGeneratorMock;

    public function setUp(): void
    {
        $this->listDir = __DIR__.'/../../../fixtures/list';
        $this->fileNameGeneratorMock = Mockery::mock(FileNameGenerator::class);
        $this->readerMock = Mockery::mock(Reader::class);
        $this->readerMock
            ->shouldReceive('readDir')
            ->with($this->listDir)
            ->andReturn([
                [
                    "id" => "id1",
                    "tvdbId" => -1,
                    "name_de" => "A File",
                    "name_en" => "A File",
                    "name_jpn" => "A File"
                ],
                [
                    "id" => "id2",
                    "tvdbId" => -1,
                    "name_de" => "C File 2",
                    "name_en" => "C File 2",
                    "name_jpn" => "C File 2"
                ],
                [
                    "id" => "id3",
                    "tvdbId" => -1,
                    "name_de" => "D File",
                    "name_en" => "D File",
                    "name_jpn" => "D File"
                ],
                [
                    "id" => "id4",
                    "tvdbId" => -1,
                    "name_de" => "G File",
                    "name_en" => "G File",
                    "name_jpn" => "G File"
                ]
            ]);
        $this->fileNameGeneratorMock
            ->shouldReceive('generate')
            ->twice()
            ->with('test')
            ->andReturn('test.json');
    }

    public function testValidate1()
    {
        $this->fileNameGeneratorMock
            ->shouldReceive('generate')
            ->twice()
            ->with('D File')
            ->andReturn('d-file.json');
        $data = [
            'name_de' => 'D File',
            'name_en' => 'A File',
            'name_jpn' => 'G File'
        ];
        $expected = [
            0 => [
                'name-dublicate' => [
                    'name_de' => 'D File',
                    'name_en' => 'A File',
                    'name_jpn' => 'G File'
                ],
                'name-file' => 'file d-file.json already exists'
            ]
        ];
        $subject = new NameValidator($this->readerMock, $this->fileNameGeneratorMock, $this->listDir);
        $result = $subject->validate([$data]);
        $this->assertEquals($expected, $result);
    }

    public function testValidate2()
    {
        $this->fileNameGeneratorMock
            ->shouldReceive('generate')
            ->twice()
            ->with('test1')
            ->andReturn('test1.json');
        $data1 = [
            'name_de' => 'test',
            'name_en' => 'test',
            'name_jpn' => 'test'
        ];
        $data2 = [
            'name_de' => 'test1',
            'name_en' => '',
            'name_jpn' => 'test'
        ];
        $expected = [
            1 => [
                'name-dublicate' => [
                    'name_jpn' => 'test'
                ]
            ]
        ];
        $subject = new NameValidator($this->readerMock, $this->fileNameGeneratorMock, $this->listDir);
        $result = $subject->validate([$data1, $data2]);
        $this->assertEquals($expected, $result);
    }

    public function testValidate3()
    {
        $this->fileNameGeneratorMock
            ->shouldReceive('generate')
            ->twice()
            ->with('teäst')
            ->andReturn('test.json');
        $data1 = [
            'name_de' => 'test',
            'name_en' => 'test',
            'name_jpn' => 'test'
        ];
        $data2 = [
            'name_de' => 'teäst',
            'name_en' => '',
            'name_jpn' => 'test2'
        ];
        $expected = [
            1 => [
                'name-file' => 'file test.json already exists'
            ]
        ];
        $subject = new NameValidator($this->readerMock, $this->fileNameGeneratorMock, $this->listDir);
        $result = $subject->validate([$data1, $data2]);
        $this->assertEquals($expected, $result);
    }

    public function testGetDataListMap()
    {
        $this->fileNameGeneratorMock
            ->shouldReceive('generate')
            ->twice()
            ->with('test2')
            ->andReturn('test2.json');
        $data1 = [
            'name_de' => '',
            'name_en' => 'test',
            'name_jpn' => ''
        ];
        $data2 = [
            'name_de' => '',
            'name_en' => '',
            'name_jpn' => 'test2'
        ];
        $expected = [
            'test.json' => $data1,
            'test2.json' => $data2
        ];
        $subject = new NameValidator($this->readerMock, $this->fileNameGeneratorMock, $this->listDir);
        $errors = $subject->validate([$data1, $data2]);
        $result = $subject->getDataListMap();
        $this->assertEquals([], $errors);
        $this->assertEquals($expected, $result);
    }
}
