<?php

namespace OrganizeYourLinks\Api;

use Mockery;
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

    public function setUp(): void
    {
        $this->psrRequestMock = Mockery::mock(PsrRequest::class);
        $this->psrResponseMock = Mockery::mock(PsrResponse::class);
        $this->requestMock = Mockery::mock(Request::class);
        $this->responseMock = Mockery::mock(Response::class);
        $this->bodyMock = Mockery::mock(StreamInterface::class);
    }

    public function testGetHandler()
    {
        $handler = EndpointHandlerWrapper::getHandler(DummyEndpoint::class);
        $this->psrRequestMock
            ->shouldReceive('getAttribute')
            ->andReturnValues([$this->responseMock, $this->requestMock]);
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
        $handler($this->psrRequestMock, $this->psrResponseMock, ['test' => true]);

        //nothing to test
        $this->assertTrue(true);
    }
}
