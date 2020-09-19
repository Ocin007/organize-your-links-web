<?php

namespace OrganizeYourLinks\Api\Middleware\App;

use Mockery;
use OrganizeYourLinks\Api\MockFactory;
use OrganizeYourLinks\Api\Response;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;

require_once __DIR__ . '/../../../../../helpers/MockFactory.php';

class CheckInstallationMiddlewareTest extends TestCase
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

    public function testMiddlewareDirWritable()
    {
        $this->mock->fileManager
            ->shouldReceive('isDataDirectoryWritable')
            ->andReturn(true);
        $this->psrRequestMock
            ->shouldReceive('getAttribute')
            ->with(Response::class)
            ->andReturn($this->responseMock);
        $this->responseMock
            ->shouldReceive('appendParameters')
            ->with([
                'composer_missing' => false,
                'data_dir_not_writable' => false,
                'key_file_missing' => false
            ]);
        $this->responseMock->shouldReceive('appendErrors');
        $this->psrRequestHandlerMock
            ->shouldReceive('handle')
            ->with($this->psrRequestMock)
            ->andReturn($this->psrResponseMock);

        $subject = new CheckInstallationMiddleware($this->mock);
        $subject($this->psrRequestMock, $this->psrRequestHandlerMock);

        //nothing to test
        $this->assertTrue(true);
    }

    public function testMiddlewareDirNotWritable()
    {
        $this->mock->fileManager
            ->shouldReceive('isDataDirectoryWritable')
            ->andReturn(false);
        $this->psrRequestMock
            ->shouldReceive('getAttribute')
            ->with(Response::class)
            ->andReturn($this->responseMock);
        $this->responseMock
            ->shouldReceive('appendParameters')
            ->with([
                'composer_missing' => false,
                'data_dir_not_writable' => true,
                'key_file_missing' => false
            ]);
        $this->responseMock->shouldReceive('appendErrors');

        $subject = new CheckInstallationMiddleware($this->mock);
        $subject($this->psrRequestMock, $this->psrRequestHandlerMock);

        //nothing to test
        $this->assertTrue(true);
    }
}
