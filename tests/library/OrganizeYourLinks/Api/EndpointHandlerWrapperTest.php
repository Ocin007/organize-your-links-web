<?php

namespace OrganizeYourLinks\Api;

use Mockery;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\Api\Response\ResponseProvider;
use OrganizeYourLinks\Types\ErrorList;
use Psr\Http\Message\ResponseInterface as PsrResponse;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\StreamInterface;

require_once __DIR__ . '/../../../helpers/DummyEndpoint.php';

class EndpointHandlerWrapperTest extends TestCase
{
    private $psrRequestMock;
    private $psrResponseMock;
    private $requestMock;
    private $responseMock;
    private $bodyMock;
    private $providerMock;
    private $errorMock;

    public function setUp(): void
    {
        $this->psrRequestMock = Mockery::mock(PsrRequest::class);
        $this->psrResponseMock = Mockery::mock(PsrResponse::class);
        $this->requestMock = Mockery::mock(Request::class);
        $this->providerMock = Mockery::mock(ResponseProvider::class);
        $this->responseMock = Mockery::mock(ResponseJson::class);
        $this->bodyMock = Mockery::mock(StreamInterface::class);
        $this->errorMock = Mockery::mock(ErrorList::class);
    }

    public function testGetHandler()
    {
        $handler = EndpointHandlerWrapper::getHandler(DummyEndpoint::class);
        $this->mockWrapper();
        DummyEndpoint::$errorMock
            ->shouldReceive('isEmpty')
            ->andReturn(true);
        $handler($this->psrRequestMock, $this->psrResponseMock, ['test' => true]);

        //nothing to test
        $this->assertTrue(true);
    }

    public function testGetHandlerErrorListNotEmpty()
    {
        $handler = EndpointHandlerWrapper::getHandler(DummyEndpoint::class);
        $this->mockWrapper();
        DummyEndpoint::$errorMock
            ->shouldReceive('isEmpty')
            ->andReturn(false);
        $this->responseMock
            ->shouldReceive('addToErrorList')
            ->with(DummyEndpoint::$errorMock);
        $handler($this->psrRequestMock, $this->psrResponseMock, ['test' => true]);

        //nothing to test
        $this->assertTrue(true);
    }

    private function mockWrapper()
    {
        DummyEndpoint::$errorMock = $this->errorMock;
        $this->psrRequestMock
            ->shouldReceive('getAttribute')
            ->andReturnValues([$this->providerMock, $this->requestMock]);
        $this->providerMock
            ->shouldReceive('getResponse')
            ->andReturn($this->responseMock);
        $this->psrRequestMock
            ->shouldReceive('getMethod')
            ->andReturn('POST');
        $this->psrRequestMock
            ->shouldReceive('getBody')
            ->andReturn($this->bodyMock);
        $this->bodyMock
            ->shouldReceive('getContents')
            ->andReturn('{}');
        $this->requestMock
            ->shouldReceive('setRawBody')
            ->with('{}');
        $this->requestMock
            ->shouldReceive('setRouteParams')
            ->with(['test' => true]);
    }
}
