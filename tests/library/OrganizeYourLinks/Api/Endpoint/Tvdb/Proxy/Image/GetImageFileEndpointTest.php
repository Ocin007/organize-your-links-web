<?php

namespace OrganizeYourLinks\Api\Endpoint\Tvdb\Proxy\Image;

use Mockery;
use OrganizeYourLinks\Api\MockFactory;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response\ResponseImage;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../../../../../../helpers/MockFactory.php';

class GetImageFileEndpointTest extends TestCase
{
    private $responseMock;
    private $requestMock;
    private MockFactory $mock;
    private GetImageFileEndpoint $subject;

    public function setUp(): void
    {
        $this->responseMock = Mockery::mock(ResponseImage::class);
        $this->requestMock = Mockery::mock(Request::class);
        $this->mock = new MockFactory();
        $this->subject = new GetImageFileEndpoint($this->requestMock, $this->mock);
    }

    public function testExecuteNoImageFound()
    {
        $this->requestMock
            ->shouldReceive('getRouteParam')
            ->with('tvdbUrl')
            ->andReturn('test/123.jpg');
        $this->mock->tvdbApi
            ->shouldReceive('file_get_contents')
            ->with('https://www.thetvdb.com/banners/test/123.jpg')
            ->andReturn(false);
        $this->responseMock
            ->shouldReceive('setContents')
            ->with('');
        $this->subject->execute($this->responseMock);

        //nothing to test
        $this->assertTrue(true);
    }

    public function testExecute()
    {
        $this->requestMock
            ->shouldReceive('getRouteParam')
            ->with('tvdbUrl')
            ->andReturn('test/123.jpg');
        $this->mock->tvdbApi
            ->shouldReceive('file_get_contents')
            ->with('https://www.thetvdb.com/banners/test/123.jpg')
            ->andReturn('test');
        $this->responseMock
            ->shouldReceive('setContents')
            ->with('test');
        $this->subject->execute($this->responseMock);

        //nothing to test
        $this->assertTrue(true);
    }

    public function testValidateRequest()
    {
        $errorList = $this->subject->validateRequest();
        $this->assertTrue($errorList->isEmpty());
    }
}
