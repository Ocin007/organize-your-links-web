<?php

namespace OrganizeYourLinks\Types;

use PHPUnit\Framework\TestCase;

class EpisodeTest extends TestCase
{
    private Episode $subject;
    private array $rawData;

    public function setUp(): void
    {
        $this->subject = new Episode();
        $this->rawData = [
            "name" => "test1",
            "url" => "test2",
            "favorite" => true,
            "watched" => false,
        ];
    }

    public function testGetAllAndSet()
    {
        $this->subject->set('name', 'test1');
        $this->subject->set('url', 'test2');
        $this->subject->set('favorite', true);
        $this->subject->set('watched', false);
        $this->assertEquals($this->rawData, $this->subject->getAll());
    }

    public function testSetAllAndGet()
    {
        $this->subject->setAll($this->rawData);
        $this->assertEquals('test1', $this->subject->get('name'));
        $this->assertEquals('test2', $this->subject->get('url'));
        $this->assertEquals(true, $this->subject->get('favorite'));
        $this->assertEquals(false, $this->subject->get('watched'));
    }

    public function testGetWrongKey()
    {
        $this->subject->set('noKey', 'test');
        $this->assertEquals(null, $this->subject->get('noKey'));
    }

    public function testSetAllWrongKey()
    {
        $this->subject->setAll([
            'noKey' => 'test',
            'watched' => true
        ]);
        $this->assertEquals(null, $this->subject->get('noKey'));
        $this->assertEquals(true, $this->subject->get('watched'));
    }

    public function testGetKeys()
    {
        $expected = ['name', 'url', 'favorite', 'watched'];
        $this->assertEquals($expected, $this->subject->getKeys());
    }
}
