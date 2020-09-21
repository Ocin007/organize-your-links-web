<?php

namespace OrganizeYourLinks\Api\Endpoint\Series\Update;

use Mockery;
use OrganizeYourLinks\Api\MockFactory;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\Series;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../../../../../helpers/MockFactory.php';

class UpdateListOfSeriesEndpointTest extends TestCase
{
    private $errorListMock;
    private $seriesMock;
    private $responseMock;
    private $requestMock;
    private MockFactory $mock;
    private UpdateListOfSeriesEndpoint $subject;

    public function setUp(): void
    {
        $this->errorListMock = Mockery::mock(ErrorList::class);
        $this->seriesMock = Mockery::mock(Series::class);
        $this->responseMock = Mockery::mock(ResponseJson::class);
        $this->requestMock = Mockery::mock(Request::class);
        $this->mock = new MockFactory();
        $this->subject = new UpdateListOfSeriesEndpoint($this->requestMock, $this->mock);
    }

    public function testExecute()
    {
        $this->requestMock
            ->shouldReceive('getConvertedParam')
            ->with('seriesList')
            ->andReturn([$this->seriesMock]);
        $this->mock->seriesManager
            ->shouldReceive('updateSeriesMulti')
            ->with([$this->seriesMock])
            ->andReturn(['wasd']);
        $this->mock->seriesManager
            ->shouldReceive('getErrorList')
            ->andReturn($this->errorListMock);
        $this->responseMock
            ->shouldReceive('appendErrors')
            ->with($this->errorListMock);
        $this->responseMock
            ->shouldReceive('setResponse')
            ->with(['wasd']);
        $this->subject->execute($this->responseMock);

        //nothing to test
        $this->assertTrue(true);
    }

    public function testValidateRequestSeriesExist()
    {
        $this->requestMock
            ->shouldReceive('getConvertedParam')
            ->with('seriesList')
            ->andReturn([$this->seriesMock]);
        $this->seriesMock
            ->shouldReceive('get')
            ->with('id')
            ->andReturn('wasd');
        $this->mock->source
            ->shouldReceive('seriesExist')
            ->with('wasd')
            ->andReturn(true);

        $errorList = $this->subject->validateRequest();
        $this->assertTrue($errorList->isEmpty());
    }

    public function testValidateRequestSeriesNotExist()
    {
        $this->requestMock
            ->shouldReceive('getConvertedParam')
            ->with('seriesList')
            ->andReturn([$this->seriesMock]);
        $this->seriesMock
            ->shouldReceive('get')
            ->with('id')
            ->andReturn('wasd');
        $this->mock->source
            ->shouldReceive('seriesExist')
            ->with('wasd')
            ->andReturn(false);

        $errorList = $this->subject->validateRequest();
        $this->assertFalse($errorList->isEmpty());
    }
}
