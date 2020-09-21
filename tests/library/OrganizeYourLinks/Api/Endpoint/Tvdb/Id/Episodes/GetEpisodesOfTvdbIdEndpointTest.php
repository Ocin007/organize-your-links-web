<?php

namespace OrganizeYourLinks\Api\Endpoint\Tvdb\Id\Episodes;

use Mockery;
use OrganizeYourLinks\Api\MockFactory;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\Types\ErrorList;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../../../../../../helpers/MockFactory.php';

class GetEpisodesOfTvdbIdEndpointTest extends TestCase
{
    private $errorListMock;
    private $responseMock;
    private $requestMock;
    private MockFactory $mock;
    private GetEpisodesOfTvdbIdEndpoint $subject;

    public function setUp(): void
    {
        $this->errorListMock = Mockery::mock(ErrorList::class);
        $this->responseMock = Mockery::mock(ResponseJson::class);
        $this->requestMock = Mockery::mock(Request::class);
        $this->mock = new MockFactory();
        $this->subject = new GetEpisodesOfTvdbIdEndpoint($this->requestMock, $this->mock);
    }

    public function testValidateRequestNoValidRouteParam()
    {
        $this->requestMock
            ->shouldReceive('getRouteParam')
            ->with('tvdbId')
            ->andReturn('test');
        $errorList = $this->subject->validateRequest();
        $this->assertFalse($errorList->isEmpty());
    }

    public function testValidateRequestPreparingFailed()
    {
        $this->requestMock
            ->shouldReceive('getRouteParam')
            ->with('tvdbId')
            ->andReturn(12345);
        $this->mock->tvdbApi
            ->shouldReceive('prepare')
            ->andReturn(false);
        $this->mock->tvdbApi
            ->shouldReceive('getErrorList')
            ->andReturn($this->errorListMock);
        $this->errorListMock
            ->shouldReceive('add')
            ->with('preparing failed');
        $this->subject->validateRequest();

        //nothing to test
        $this->assertTrue(true);
    }

    public function testValidateRequest()
    {
        $this->requestMock
            ->shouldReceive('getRouteParam')
            ->with('tvdbId')
            ->andReturn(12345);
        $this->mock->tvdbApi
            ->shouldReceive('prepare')
            ->andReturn(true);
        $this->mock->tvdbApi
            ->shouldReceive('getErrorList')
            ->andReturn($this->errorListMock);
        $this->subject->validateRequest();

        //nothing to test
        $this->assertTrue(true);
    }

    public function testExecute()
    {
        $this->requestMock
            ->shouldReceive('getRouteParam')
            ->with('tvdbId')
            ->andReturn(12345);
        $this->mock->tvdbApi
            ->shouldReceive('getEpisodes')
            ->with(12345);
        $this->mock->tvdbApi
            ->shouldReceive('getContent')
            ->andReturn(['data' => 5]);
        $this->responseMock
            ->shouldReceive('setResponse')
            ->with(['data' => 5]);
        $this->subject->execute($this->responseMock);

        //nothing to test
        $this->assertTrue(true);
    }
}
