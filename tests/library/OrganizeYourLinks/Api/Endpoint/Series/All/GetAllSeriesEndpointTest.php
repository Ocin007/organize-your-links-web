<?php

namespace OrganizeYourLinks\Api\Endpoint\Series\All;

use Mockery;
use OrganizeYourLinks\Api\MockFactory;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\Series;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../../../../../helpers/MockFactory.php';

class GetAllSeriesEndpointTest extends TestCase
{
    private $errorListMock;
    private $seriesMock;
    private $responseMock;
    private MockFactory $mock;
    private GetAllSeriesEndpoint $subject;

    public function setUp(): void
    {
        $this->errorListMock = Mockery::mock(ErrorList::class);
        $this->seriesMock = Mockery::mock(Series::class);
        $this->responseMock = Mockery::mock(Response::class);
        $requestMock = Mockery::mock(Request::class);
        $this->mock = new MockFactory();
        $this->subject = new GetAllSeriesEndpoint($requestMock, $this->mock);
    }

    public function testExecuteError()
    {
        $this->mock->seriesManager
            ->shouldReceive('getAll')
            ->with(null, $this->mock->sorter)
            ->andReturn(null);
        $this->mock->seriesManager
            ->shouldReceive('getErrorList')
            ->andReturn($this->errorListMock);
        $this->responseMock
            ->shouldReceive('appendErrors')
            ->with($this->errorListMock);
        $this->subject->execute($this->responseMock);

        //nothing to test
        $this->assertTrue(true);
    }

    public function testExecute()
    {
        $this->mock->seriesManager
            ->shouldReceive('getAll')
            ->with(null, $this->mock->sorter)
            ->andReturn([$this->seriesMock]);
        $this->responseMock
            ->shouldReceive('setResponse')
            ->with([$this->seriesMock]);
        $this->subject->execute($this->responseMock);

        //nothing to test
        $this->assertTrue(true);
    }

    public function testValidateRequest()
    {
        $errorList = $this->subject->validateRequest();
        $this->assertTrue($errorList->isEmpty());
    }
}
