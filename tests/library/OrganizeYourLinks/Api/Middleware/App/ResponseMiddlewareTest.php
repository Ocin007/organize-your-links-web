<?php

namespace OrganizeYourLinks\Api\Middleware\App;

use Mockery;
use OrganizeYourLinks\Api\MockFactory;
use OrganizeYourLinks\Api\Response;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;

require_once __DIR__ . '/../../../../../helpers/MockFactory.php';

class ResponseMiddlewareTest extends TestCase
{
    private $psrRequestMock;
    private $psrOldRequestMock;
    private $psrResponseMock;
    private $psrOldResponseMock;
    private $psrRequestHandlerMock;
    private MockFactory $mock;
    private $responseMock;
    private $bodyMock;

    public function setUp(): void
    {
        $this->psrRequestMock = Mockery::mock(PsrRequest::class);
        $this->psrOldRequestMock = Mockery::mock(PsrRequest::class);
        $this->psrResponseMock = Mockery::mock(PsrResponse::class);
        $this->psrOldResponseMock = Mockery::mock(PsrResponse::class);
        $this->psrRequestHandlerMock = Mockery::mock(RequestHandler::class);
        $this->responseMock = Mockery::mock(Response::class);
        $this->bodyMock = Mockery::mock(StreamInterface::class);
        $this->mock = new MockFactory();
    }

    public function testMiddleware()
    {
        $this->psrOldRequestMock
            ->shouldReceive('withAttribute')
            ->andReturn($this->psrRequestMock);
        $this->psrRequestHandlerMock
            ->shouldReceive('handle')
            ->with($this->psrRequestMock)
            ->andReturn($this->psrOldResponseMock);
        $this->psrRequestMock
            ->shouldReceive('getAttribute')
            ->with(Response::class)
            ->andReturn($this->responseMock);
        $this->psrOldResponseMock
            ->shouldReceive('withHeader')
            ->with('Content-type', 'application/json')
            ->andReturn($this->psrResponseMock);
        $this->psrResponseMock
            ->shouldReceive('getBody')
            ->andReturn($this->bodyMock);
        $this->bodyMock
            ->shouldReceive('write')
            ->with('{"test":true}');
        $this->responseMock
            ->shouldReceive('getJSON')
            ->with($this->mock->converter)
            ->andReturn('{"test":true}');
        $subject = new ResponseMiddleware($this->mock);
        $subject($this->psrOldRequestMock, $this->psrRequestHandlerMock);

        //nothing to test
        $this->assertTrue(true);
    }
}
