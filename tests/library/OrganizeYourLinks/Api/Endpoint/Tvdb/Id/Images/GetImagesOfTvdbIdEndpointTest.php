<?php

namespace OrganizeYourLinks\Api\Endpoint\Tvdb\Id\Images;

use Mockery;
use OrganizeYourLinks\Api\MockFactory;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response\ResponseJson;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../../../../../../helpers/MockFactory.php';

class GetImagesOfTvdbIdEndpointTest extends TestCase
{
    private $responseMock;
    private $requestMock;
    private MockFactory $mock;
    private GetImagesOfTvdbIdEndpoint $subject;

    public function setUp(): void
    {
        $this->responseMock = Mockery::mock(ResponseJson::class);
        $this->requestMock = Mockery::mock(Request::class);
        $this->mock = new MockFactory();
        $this->subject = new GetImagesOfTvdbIdEndpoint($this->requestMock, $this->mock);
    }

    public function testExecute()
    {
        $this->requestMock
            ->shouldReceive('getRouteParam')
            ->with('tvdbId')
            ->andReturn(12345);
        $this->mock->tvdbApi
            ->shouldReceive('getImages')
            ->with(12345)
            ->andReturn(true);
        $this->responseMock
            ->shouldReceive('appendErrors');
        $this->mock->tvdbApi
            ->shouldReceive('getContent')
            ->andReturn(['url']);
        $this->responseMock
            ->shouldReceive('setResponse')
            ->with(['url']);
        $this->subject->execute($this->responseMock);

        //nothing to test
        $this->assertTrue(true);
    }

    public function testExecuteNoImages()
    {
        $this->requestMock
            ->shouldReceive('getRouteParam')
            ->with('tvdbId')
            ->andReturn(12345);
        $this->mock->tvdbApi
            ->shouldReceive('getImages')
            ->with(12345)
            ->andReturn(false);
        $this->responseMock
            ->shouldReceive('appendErrors');
        $this->mock->tvdbApi
            ->shouldReceive('getContent')
            ->andReturn([]);
        $this->responseMock
            ->shouldReceive('setResponse')
            ->with([]);
        $this->subject->execute($this->responseMock);

        //nothing to test
        $this->assertTrue(true);
    }
}
