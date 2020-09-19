<?php

namespace OrganizeYourLinks\Api\Middleware\Route;

use Mockery;
use OrganizeYourLinks\Api\MockFactory;
use OrganizeYourLinks\Types\Series;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;

require_once __DIR__ . '/../../../../../helpers/MockFactory.php';

class PrepareRequestWithSeriesMiddlewareTest extends TestCase
{
    private $psrRequestMock;
    private $psrOldRequestMock;
    private $psrResponseMock;
    private $psrRequestHandlerMock;
    private MockFactory $mock;
    private $bodyMock;
    private $seriesMock;

    public function setUp(): void
    {
        $this->psrRequestMock = Mockery::mock(PsrRequest::class);
        $this->psrOldRequestMock = Mockery::mock(PsrRequest::class);
        $this->psrResponseMock = Mockery::mock(PsrResponse::class);
        $this->psrRequestHandlerMock = Mockery::mock(RequestHandler::class);
        $this->bodyMock = Mockery::mock(StreamInterface::class);
        $this->seriesMock = Mockery::mock(Series::class);
        $this->mock = new MockFactory();
    }

    public function testMiddleware()
    {
        $this->psrOldRequestMock
            ->shouldReceive('getBody')
            ->andReturn($this->bodyMock);
        $this->bodyMock
            ->shouldReceive('getContents')
            ->andReturn(json_encode(['seriesList' => [['id' => 'wasd']]]));
        $this->mock->converter
            ->shouldReceive('convertToObject')
            ->once()
            ->with(['id' => 'wasd'])
            ->andReturn($this->seriesMock);
        $this->psrOldRequestMock
            ->shouldReceive('withAttribute')
            ->andReturn($this->psrRequestMock);
        $this->psrRequestHandlerMock
            ->shouldReceive('handle')
            ->with($this->psrRequestMock)
            ->andReturn($this->psrResponseMock);
        $subject = new PrepareRequestWithSeriesMiddleware($this->mock);
        $subject($this->psrOldRequestMock, $this->psrRequestHandlerMock);

        //nothing to test
        $this->assertTrue(true);
    }
}
