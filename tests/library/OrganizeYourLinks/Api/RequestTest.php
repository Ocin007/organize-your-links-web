<?php

namespace OrganizeYourLinks\Api;

use Mockery;
use OrganizeYourLinks\Types\Converter\SeriesConverter;
use OrganizeYourLinks\Types\Series;
use PHPUnit\Framework\TestCase;

class RequestTest extends TestCase
{
    private Request $subject;
    private $converterMock;
    private $seriesMock;

    public function setUp(): void
    {
        $this->subject = new Request();
        $this->converterMock = Mockery::mock(SeriesConverter::class);
        $this->seriesMock = Mockery::mock(Series::class);
    }

    public function testRaw()
    {
        $this->subject->setRawBody('{"test":true}');
        $this->assertEquals(['test' => true], $this->subject->getRawBody());
        $this->assertEquals(true, $this->subject->getRawParam('test'));
    }

    public function testRoute()
    {
        $this->subject->setRouteParams(['test' => true]);
        $this->assertEquals(true, $this->subject->getRouteParam('test'));
    }

    public function testConvert()
    {
        $this->converterMock
            ->shouldReceive('convertToObject')
            ->with(["id" => "wasd"])
            ->andReturn($this->seriesMock);
        $this->subject->setConvertedBody(json_encode([
            "seriesList" => [
                ["id" => "wasd"]
            ]
        ]))->convert($this->converterMock);
        $seriesList = $this->subject->getConvertedParam('seriesList');
        $this->assertEquals($this->seriesMock, $seriesList[0]);
    }
}
