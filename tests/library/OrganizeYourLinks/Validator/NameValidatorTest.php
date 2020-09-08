<?php

namespace OrganizeYourLinks\Validator;

use OrganizeYourLinks\Generator\FileNameGenerator;
use OrganizeYourLinks\Reader;
use PHPUnit\Framework\TestCase;

class NameValidatorTest extends TestCase
{
    private string $listDir;

    public function setUp(): void
    {
        $this->listDir = __DIR__.'/../../../fixtures/list';
    }

    public function testValidate1()
    {
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
        $subject = new NameValidator(new Reader(), new FileNameGenerator(), $this->listDir);
        $result = $subject->validate([$data]);
        $this->assertEquals($expected, $result);
    }

    public function testValidate2()
    {
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
        $subject = new NameValidator(new Reader(), new FileNameGenerator(), $this->listDir);
        $result = $subject->validate([$data1, $data2]);
        $this->assertEquals($expected, $result);
    }

    public function testValidate3()
    {
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
        $subject = new NameValidator(new Reader(), new FileNameGenerator(), $this->listDir);
        $result = $subject->validate([$data1, $data2]);
        $this->assertEquals($expected, $result);
    }

    public function testGetDataListMap()
    {
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
        $subject = new NameValidator(new Reader(), new FileNameGenerator(), $this->listDir);
        $errors = $subject->validate([$data1, $data2]);
        $result = $subject->getDataListMap();
        $this->assertEquals([], $errors);
        $this->assertEquals($expected, $result);
    }
}
