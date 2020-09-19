<?php

namespace OrganizeYourLinks\Api\Middleware\App;

use Mockery;
use OrganizeYourLinks\Api\MockFactory;
use OrganizeYourLinks\Api\Response;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

require_once __DIR__ . '/../../../../../helpers/MockFactory.php';

class CheckRequestMiddlewareTest extends TestCase
{
    private $psrRequestMock;
    private $psrRequestHandlerMock;
    private MockFactory $mock;
    private $responseMock;
    private $bodyMock;

    public function setUp(): void
    {
        $this->psrRequestMock = Mockery::mock(PsrRequest::class);
        $this->psrRequestHandlerMock = Mockery::mock(RequestHandler::class);
        $this->responseMock = Mockery::mock(Response::class);
        $this->bodyMock = Mockery::mock(StreamInterface::class);
        $this->mock = new MockFactory();
    }

    public function testMiddlewareNoBody()
    {
        $this->psrRequestMock
            ->shouldReceive('getBody')
            ->andReturn($this->bodyMock);
        $this->bodyMock
            ->shouldReceive('getContents')
            ->andReturn('');
        $this->psrRequestMock
            ->shouldReceive('getMethod')
            ->andReturn('POST');
        $this->psrRequestMock
            ->shouldReceive('getAttribute')
            ->with(Response::class)
            ->andReturn($this->responseMock);
        $this->responseMock
            ->shouldReceive('appendErrors');
        $subject = new CheckRequestMiddleware($this->mock);
        $subject($this->psrRequestMock, $this->psrRequestHandlerMock);

        //nothing to test
        $this->assertTrue(true);
    }
}
