<?php

namespace OrganizeYourLinks;

use PHPUnit\Framework\TestCase;

class ReaderTest extends TestCase
{
    private $listDir = __DIR__.'/../../fixtures/list';

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
}
