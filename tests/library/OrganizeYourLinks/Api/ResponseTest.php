<?php

namespace OrganizeYourLinks\Api;

use Mockery;
use OrganizeYourLinks\Types\Converter\SeriesConverter;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\Series;
use PHPUnit\Framework\TestCase;

class ResponseTest extends TestCase
{
    private $errorListMock;
    private Response $subject;
    private $converterMock;
    private $newErrorListMock;
    private $seriesMock;

    public function setUp(): void
    {
        $this->seriesMock = Mockery::mock(Series::class);
        $this->errorListMock = Mockery::mock(ErrorList::class);
        $this->newErrorListMock = Mockery::mock(ErrorList::class);
        $this->subject = new Response($this->errorListMock);
        $this->converterMock = Mockery::mock(SeriesConverter::class);
    }

    public function testParameter()
    {
        $this->subject->setParameter('test1', 1);
        $this->subject->appendParameters(['test2' => 2]);
        $expected = ['test1' => 1, 'test2' => 2];
        $this->assertEquals($expected, $this->subject->getParameters());
    }

    public function testResponse()
    {
        $this->subject->setResponse(['test1' => 1]);
        $this->subject->appendResponse(['test2' => 2]);
        $expected = ['test1' => 1, 'test2' => 2];
        $this->assertEquals($expected, $this->subject->getResponse());
    }

    public function testAppendErrors()
    {
        $this->errorListMock
            ->shouldReceive('add')
            ->with($this->newErrorListMock);
        $this->subject->appendErrors($this->newErrorListMock);

        //nothing to test
        $this->assertTrue(true);
    }

    public function testGetJSON()
    {
        $this->converterMock
            ->shouldReceive('convertToNative')
            ->times(3)
            ->with($this->seriesMock)
            ->andReturnValues([ ['id' => 'wasd'], ['id' => 'abc'], ['id' => 'xyz'] ]);
        $this->errorListMock
            ->shouldReceive('isEmpty')
            ->andReturn(false);
        $this->errorListMock
            ->shouldReceive('getErrorList')
            ->andReturn(['test']);
        $this->subject->setParameter('param', 'test');
        $this->subject->setResponse([
            'test' => true,
            'series' => $this->seriesMock,
            'seriesList' => [
                $this->seriesMock,
                $this->seriesMock
            ]
        ]);
        $expected = json_encode([
            'param' => 'test',
            'response' => [
                'test' => true,
                'series' => ['id' => 'wasd'],
                'seriesList' => [
                    ['id' => 'abc'],
                    ['id' => 'xyz']
                ]
            ],
            'error' => ['test']
        ]);
        $json = $this->subject->getJSON($this->converterMock);
        $this->assertJsonStringEqualsJsonString($expected, $json);
    }

    public function testGetErrorList()
    {
        $this->assertEquals($this->errorListMock, $this->subject->getErrorList());
    }

    public function testAddToErrorList()
    {
        $this->assertFalse($this->subject->addToErrorList(''));
        $this->errorListMock
            ->shouldReceive('add')
            ->once()
            ->with($this->newErrorListMock);
        $this->assertTrue($this->subject->addToErrorList($this->newErrorListMock));
    }

    public function testNoErrors()
    {
        $this->errorListMock
            ->shouldReceive('isEmpty')
            ->andReturn(false);
        $this->assertFalse($this->subject->noErrors());
    }
}
