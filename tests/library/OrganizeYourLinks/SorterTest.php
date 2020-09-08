<?php

namespace OrganizeYourLinks;

use OrganizeYourLinks\OrganizeYourLinks\Sorter;
use PHPUnit\Framework\TestCase;

class SorterTest extends TestCase
{

    private $dataSet1;
    private $dataSet2;

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

    public function testSort1()
    {
        $dataExpected = $this->dataSet1;
        $data = $this->dataSet2;
        $subject = new Sorter(["titleLanguage" => "name_de"]);
        $subject->sort($data);
        $this->assertEquals($dataExpected, $data);
    }

    public function testSort2()
    {
        $dataExpected = $this->dataSet2;
        $data = $this->dataSet1;
        $subject = new Sorter(["titleLanguage" => "name_jpn"]);
        $subject->sort($data);
        $this->assertEquals($dataExpected, $data);
    }
}
