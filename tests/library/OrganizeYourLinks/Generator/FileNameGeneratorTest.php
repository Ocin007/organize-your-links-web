<?php

use OrganizeYourLinks\Generator\FileNameGenerator;
use PHPUnit\Framework\TestCase;

class FileNameGeneratorTest extends TestCase
{

    public function testGenerateFileName1()
    {
        $subject = new FileNameGenerator();
        $string = 'Attack on Titan';
        $result = $subject->generateFileName($string);
        $expected = 'attack-on-titan.json';
        $this->assertEquals($expected, $result);
    }

    public function testGenerateFileName2()
    {
        $subject = new FileNameGenerator();
        $string = 'Attack    on   Titan';
        $result = $subject->generateFileName($string);
        $expected = 'attack-on-titan.json';
        $this->assertEquals($expected, $result);
    }

    public function testGenerateFileName3()
    {
        $subject = new FileNameGenerator();
        $string = 'A.tt<ac!k       o^°n   Tit&%a\n 3';
        $result = $subject->generateFileName($string);
        $expected = 'attack-on-titan-3.json';
        $this->assertEquals($expected, $result);
    }

    public function testGenerateFileName4()
    {
        $subject = new FileNameGenerator();
        $string = 'Attück ön Titänß';
        $result = $subject->generateFileName($string);
        $expected = 'attck-n-titn.json';
        $this->assertEquals($expected, $result);
    }
}
