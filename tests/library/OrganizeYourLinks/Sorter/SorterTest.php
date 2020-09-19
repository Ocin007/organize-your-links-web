<?php

namespace OrganizeYourLinks\Sorter;

use Exception;
use PHPUnit\Framework\TestCase;

class SorterTest extends TestCase
{
    private array $dataSet1;
    private array $dataSet2;

    public function setUp(): void
    {
        $this->dataSet1 = [
            ['name_de' => 'a', 'name_en' => 'f', 'name_jpn' => 'y'],
            ['name_de' => 'b', 'name_en' => 'f', 'name_jpn' => 'b']
        ];
        $this->dataSet2 = [
            ['name_de' => 'b', 'name_en' => 'f', 'name_jpn' => 'b'],
            ['name_de' => 'a', 'name_en' => 'f', 'name_jpn' => 'y']
        ];
    }

    /**
     * @throws Exception
     */
    public function testSort1()
    {
        $dataExpected = $this->dataSet1;
        $data = $this->dataSet2;
        $subject = new Sorter(["titleLanguage" => "name_de"]);
        $data = $subject->sort($data);
        $this->assertEquals($dataExpected, $data);
    }

    /**
     * @throws Exception
     */
    public function testSort2()
    {
        $dataExpected = $this->dataSet2;
        $data = $this->dataSet1;
        $subject = new Sorter(["titleLanguage" => "name_jpn"]);
        $data = $subject->sort($data);
        $this->assertEquals($dataExpected, $data);
    }

    /**
     * @throws Exception
     */
    public function testSort3()
    {
        $dataExpected = [
            ['name_de' => '', 'name_en' => '', 'name_jpn' => 'x'],
            ['name_de' => '', 'name_en' => 'y', 'name_jpn' => 'c'],
            ['name_de' => 'z', 'name_en' => 'a', 'name_jpn' => 'b']
        ];
        $data = [
            ['name_de' => 'z', 'name_en' => 'a', 'name_jpn' => 'b'],
            ['name_de' => '', 'name_en' => 'y', 'name_jpn' => 'c'],
            ['name_de' => '', 'name_en' => '', 'name_jpn' => 'x']
        ];
        $subject = new Sorter(["titleLanguage" => "name_de"]);
        $data = $subject->sort($data);
        $this->assertEquals($dataExpected, $data);
    }

    /**
     * @throws Exception
     */
    public function testSortNoNameFound()
    {
        $this->expectExceptionMessage('sorter, no name found');
        $data = [
            ['name_de' => '', 'name_en' => 'y', 'name_jpn' => 'c'],
            ['name_de' => '', 'name_en' => '', 'name_jpn' => '']
        ];
        $subject = new Sorter(["titleLanguage" => "name_jpn"]);
        $subject->sort($data);
    }
}
