<?php

use OrganizeYourLinks\Generator\FileNameGenerator;
use PHPUnit\Framework\TestCase;

class FileNameGeneratorTest extends TestCase
{
    private FileNameGenerator $subject;

    public function setUp(): void
    {
        $this->subject = new FileNameGenerator();
    }

    public function testGenerateFileName1()
    {
        $string = 'Attack on Titan';
        $result = $this->subject->generateFileName($string);
        $expected = 'attack-on-titan.json';
        $this->assertEquals($expected, $result);
    }

    public function testGenerateFileName2()
    {
        $string = 'Attack    on   Titan';
        $result = $this->subject->generateFileName($string);
        $expected = 'attack-on-titan.json';
        $this->assertEquals($expected, $result);
    }

    public function testGenerateFileName3()
    {
        $string = 'A.tt<ac!k       o^°n   Tit&%a\n 3';
        $result = $this->subject->generateFileName($string);
        $expected = 'attack-on-titan-3.json';
        $this->assertEquals($expected, $result);
    }

    public function testGenerateFileName4()
    {
        $string = 'Attück ön Titänß';
        $result = $this->subject->generateFileName($string);
        $expected = 'attck-n-titn.json';
        $this->assertEquals($expected, $result);
    }
}
