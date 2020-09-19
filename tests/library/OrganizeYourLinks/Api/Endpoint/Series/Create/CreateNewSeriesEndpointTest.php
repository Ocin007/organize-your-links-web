<?php

namespace OrganizeYourLinks\Api\Endpoint\Series\Create;

use Mockery;
use OrganizeYourLinks\Api\MockFactory;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\Series;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../../../../../helpers/MockFactory.php';

class CreateNewSeriesEndpointTest extends TestCase
{
    private $errorListMock;
    private $seriesMock;
    private $responseMock;
    private $requestMock;
    private MockFactory $mock;
    private CreateNewSeriesEndpoint $subject;

    public function setUp(): void
    {
        $this->errorListMock = Mockery::mock(ErrorList::class);
        $this->seriesMock = Mockery::mock(Series::class);
        $this->responseMock = Mockery::mock(Response::class);
        $this->requestMock = Mockery::mock(Request::class);
        $this->mock = new MockFactory();
        $this->subject = new CreateNewSeriesEndpoint($this->requestMock, $this->mock);
    }

    public function testValidateRequest()
    {
        $this->requestMock
            ->shouldReceive('getRawParam')
            ->with('seriesList')
            ->andReturn([['id' => 'wasd']]);
        $this->mock->source
            ->shouldReceive('checkSeriesNames')
            ->with(['id' => 'wasd'])
            ->andReturn($this->errorListMock);
        $this->assertEquals($this->errorListMock, $this->subject->validateRequest());
    }

    public function testExecute()
    {
        $this->requestMock
            ->shouldReceive('getConvertedParam')
            ->with('seriesList')
            ->andReturn([$this->seriesMock]);
        $this->mock->seriesManager
            ->shouldReceive('createSeriesMulti')
            ->with([$this->seriesMock]);
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
}
