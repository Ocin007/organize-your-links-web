<?php

namespace OrganizeYourLinks\Api\Middleware\Route;

use Mockery;
use OrganizeYourLinks\Api\MockFactory;
use OrganizeYourLinks\Api\Response;
use OrganizeYourLinks\Types\ErrorList;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;

require_once __DIR__ . '/../../../../../helpers/MockFactory.php';

class CheckIsValidSeriesMiddlewareTest extends TestCase
{
    private $psrRequestMock;
    private $psrResponseMock;
    private $psrRequestHandlerMock;
    private MockFactory $mock;
    private $responseMock;
    private $bodyMock;
    private $errorListMock;

    public function setUp(): void
    {
        $this->psrRequestMock = Mockery::mock(PsrRequest::class);
        $this->psrResponseMock = Mockery::mock(PsrResponse::class);
        $this->psrRequestHandlerMock = Mockery::mock(RequestHandler::class);
        $this->responseMock = Mockery::mock(Response::class);
        $this->bodyMock = Mockery::mock(StreamInterface::class);
        $this->errorListMock = Mockery::mock(ErrorList::class);
        $this->mock = new MockFactory();
    }

    public function testMiddlewareNoSeries()
    {
        $this->psrRequestMock
            ->shouldReceive('getBody')
            ->andReturn($this->bodyMock);
        $this->bodyMock
            ->shouldReceive('getContents')
            ->andReturn('{}');
        $this->psrRequestMock
            ->shouldReceive('getAttribute')
            ->with(Response::class)
            ->andReturn($this->responseMock);
        $this->responseMock
            ->shouldReceive('appendErrors');
        $subject = new CheckIsValidSeriesMiddleware($this->mock);
        $subject($this->psrRequestMock, $this->psrRequestHandlerMock);

        //nothing to test
        $this->assertTrue(true);
    }

    public function testMiddleware()
    {
        $this->psrRequestMock
            ->shouldReceive('getBody')
            ->andReturn($this->bodyMock);
        $this->bodyMock
            ->shouldReceive('getContents')
            ->andReturn(json_encode(['seriesList' => [['id' => 'wasd']]]));
        $this->mock->dataIsSeriesValidator
            ->shouldReceive('validate')
            ->with([['id' => 'wasd']])
            ->andReturn($this->errorListMock);
        $this->errorListMock
            ->shouldReceive('isEmpty')
            ->andReturn(true);
        $this->psrRequestHandlerMock
            ->shouldReceive('handle')
            ->with($this->psrRequestMock)
            ->andReturn($this->psrResponseMock);
        $subject = new CheckIsValidSeriesMiddleware($this->mock);
        $subject($this->psrRequestMock, $this->psrRequestHandlerMock);

        //nothing to test
        $this->assertTrue(true);
    }
}
