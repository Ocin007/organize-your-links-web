<?php

namespace OrganizeYourLinks\Types;

use Mockery;
use PHPUnit\Framework\TestCase;

class SeasonTest extends TestCase
{
    private Season $subject;
    private $episodeMock;

    public function setUp(): void
    {
        $this->subject = new Season();
        $this->episodeMock = Mockery::mock(Episode::class);
    }

    public function testGetKeys()
    {
        $expected = ['url', 'thumbnail', 'favorite'];
        $this->assertEquals($expected, $this->subject->getKeys());
    }

    public function testAddEpisodeGetEpisodes()
    {
        $expected = [$this->episodeMock];
        $actual = $this->subject->addEpisode($this->episodeMock)->getEpisodes();
        $this->assertEquals($expected, $actual);
    }
}
