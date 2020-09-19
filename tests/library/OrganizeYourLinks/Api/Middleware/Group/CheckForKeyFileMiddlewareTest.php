<?php

namespace OrganizeYourLinks\Api\Middleware\Group;

use Mockery;
use OrganizeYourLinks\Api\MockFactory;
use OrganizeYourLinks\Api\Response;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;

require_once __DIR__ . '/../../../../../helpers/MockFactory.php';

class CheckForKeyFileMiddlewareTest extends TestCase
{
    private $psrRequestMock;
    private $psrResponseMock;
    private $psrRequestHandlerMock;
    private MockFactory $mock;
    private $responseMock;

    public function setUp(): void
    {
        $this->psrRequestMock = Mockery::mock(PsrRequest::class);
        $this->psrResponseMock = Mockery::mock(PsrResponse::class);
        $this->psrRequestHandlerMock = Mockery::mock(RequestHandler::class);
        $this->responseMock = Mockery::mock(Response::class);
        $this->mock = new MockFactory();
    }

    public function testMiddlewareNoKeyFile()
    {
        $this->mock->fileManager
            ->shouldReceive('keyFileExist')
            ->andReturn(false);
        $this->psrRequestMock
            ->shouldReceive('getAttribute')
            ->with(Response::class)
            ->andReturn($this->responseMock);
        $this->responseMock
            ->shouldReceive('setParameter')
            ->with('key_file_missing', true);
        $subject = new CheckForKeyFileMiddleware($this->mock);
        $subject($this->psrRequestMock, $this->psrRequestHandlerMock);

        //nothing to test
        $this->assertTrue(true);
    }

    public function testMiddleware()
    {
        $this->mock->fileManager
            ->shouldReceive('keyFileExist')
            ->andReturn(true);
        $this->psrRequestHandlerMock
            ->shouldReceive('handle')
            ->with($this->psrRequestMock)
            ->andReturn($this->psrResponseMock);
        $subject = new CheckForKeyFileMiddleware($this->mock);
        $subject($this->psrRequestMock, $this->psrRequestHandlerMock);

        //nothing to test
        $this->assertTrue(true);
    }
}
