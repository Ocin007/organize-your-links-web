<?php

namespace OrganizeYourLinks\Api\Endpoint\Series\Remove;

use Mockery;
use OrganizeYourLinks\Api\MockFactory;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\Types\ErrorList;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../../../../../helpers/MockFactory.php';

class RemoveSeriesEndpointTest extends TestCase
{
    private $errorListMock;
    private $responseMock;
    private $requestMock;
    private MockFactory $mock;
    private RemoveSeriesEndpoint $subject;

    public function setUp(): void
    {
        $this->errorListMock = Mockery::mock(ErrorList::class);
        $this->responseMock = Mockery::mock(ResponseJson::class);
        $this->requestMock = Mockery::mock(Request::class);
        $this->mock = new MockFactory();
        $this->subject = new RemoveSeriesEndpoint($this->requestMock, $this->mock);
    }

    public function testExecute()
    {
        $this->requestMock
            ->shouldReceive('getRouteParam')
            ->with('id')
            ->andReturn('wasd');
        $this->mock->seriesManager
            ->shouldReceive('deleteSeriesMulti')
            ->with(['wasd']);
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

    public function testValidateRequestIdExist()
    {
        $this->requestMock
            ->shouldReceive('getRouteParam')
            ->with('id')
            ->andReturn('wasd');
        $this->mock->source
            ->shouldReceive('seriesExist')
            ->with('wasd')
            ->andReturn(true);

        $errorList = $this->subject->validateRequest();
        $this->assertTrue($errorList->isEmpty());
    }

    public function testValidateRequestIdNotExist()
    {
        $this->requestMock
            ->shouldReceive('getRouteParam')
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
