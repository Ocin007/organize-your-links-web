<?php

namespace OrganizeYourLinks\Api\Middleware\Route;

use Mockery;
use OrganizeYourLinks\Api\MockFactory;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\Api\Response\ResponseProvider;
use OrganizeYourLinks\Types\ErrorList;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;

require_once __DIR__ . '/../../../../../helpers/MockFactory.php';

class ResponseImageMiddlewareTest extends TestCase
{
    private $psrRequestMock;
    private $psrResponseMock;
    private $psrRequestHandlerMock;
    private MockFactory $mock;
    private $responseMock;
    private $providerMock;
    private $errorListMock;

    public function setUp(): void
    {
        $this->psrRequestMock = Mockery::mock(PsrRequest::class);
        $this->psrResponseMock = Mockery::mock(PsrResponse::class);
        $this->psrRequestHandlerMock = Mockery::mock(RequestHandler::class);
        $this->providerMock = Mockery::mock(ResponseProvider::class);
        $this->responseMock = Mockery::mock(ResponseJson::class);
        $this->errorListMock = Mockery::mock(ErrorList::class);
        $this->mock = new MockFactory();
    }

    public function testMiddleware()
    {
        $this->psrRequestMock
            ->shouldReceive('getAttribute')
            ->with('response')
            ->andReturn($this->providerMock);
        $this->providerMock
            ->shouldReceive('getResponse')
            ->andReturn($this->responseMock);
        $this->responseMock
            ->shouldReceive('getErrorList')
            ->andReturn($this->errorListMock);
        $this->providerMock
            ->shouldReceive('setResponse');
        $this->psrRequestHandlerMock
            ->shouldReceive('handle')
            ->with($this->psrRequestMock)
            ->andReturn($this->psrResponseMock);
        $subject = new ResponseImageMiddleware($this->mock);
        $subject($this->psrRequestMock, $this->psrRequestHandlerMock);

        //nothing to test
        $this->assertTrue(true);
    }
}
