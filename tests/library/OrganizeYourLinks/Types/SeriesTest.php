<?php

namespace OrganizeYourLinks\Types;

use Mockery;
use PHPUnit\Framework\TestCase;

class SeriesTest extends TestCase
{
    private Series $subject;
    private $seasonMock;

    public function setUp(): void
    {
        $this->subject = new Series();
        $this->seasonMock = Mockery::mock(Season::class);
    }

    public function testGetKeys()
    {
        $expected = ['id', 'tvdbId', 'name_de', 'name_en', 'name_jpn', 'list', 'rank', 'favorite'];
        $this->assertEquals($expected, $this->subject->getKeys());
    }

    public function testAddSeasonGetSeasons()
    {
        $expected = [$this->seasonMock];
        $actual = $this->subject->addSeason($this->seasonMock)->getSeasons();
        $this->assertEquals($expected, $actual);
    }
}
