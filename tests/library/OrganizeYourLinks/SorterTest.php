<?php

namespace OrganizeYourLinks;

use OrganizeYourLinks\OrganizeYourLinks\Sorter;
use PHPUnit\Framework\TestCase;

class SorterTest extends TestCase
{

    public function testSort1()
    {
        $dataExpected = [
            ['name_de' => 'a', 'name_en' => 'f', 'name_jpn' => 'y'],
            ['name_de' => 'b', 'name_en' => 'f', 'name_jpn' => 'b']
        ];
        $data = [
            ['name_de' => 'b', 'name_en' => 'f', 'name_jpn' => 'b'],
            ['name_de' => 'a', 'name_en' => 'f', 'name_jpn' => 'y']
        ];
        $subject = new Sorter(["titleLanguage" => "name_de"]);
        $subject->sort($data);
        $this->assertEquals($dataExpected, $data);
    }

    public function testSort2()
    {
        $dataExpected = [
            ['name_de' => 'b', 'name_en' => 'f', 'name_jpn' => 'b'],
            ['name_de' => 'a', 'name_en' => 'f', 'name_jpn' => 'y']
        ];
        $data = [
            ['name_de' => 'a', 'name_en' => 'f', 'name_jpn' => 'y'],
            ['name_de' => 'b', 'name_en' => 'f', 'name_jpn' => 'b']
        ];
        $subject = new Sorter(["titleLanguage" => "name_jpn"]);
        $subject->sort($data);
        $this->assertEquals($dataExpected, $data);
    }
}
