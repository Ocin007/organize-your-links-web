<?php

namespace OrganizeYourLinks\Api\Endpoint\Settings\Get;

use Mockery;
use OrganizeYourLinks\Api\MockFactory;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\Types\ErrorList;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../../../../../helpers/MockFactory.php';

class GetSettingsEndpointTest extends TestCase
{
    private $errorListMock;
    private $responseMock;
    private MockFactory $mock;
    private GetSettingsEndpoint $subject;

    public function setUp(): void
    {
        $this->errorListMock = Mockery::mock(ErrorList::class);
        $this->responseMock = Mockery::mock(ResponseJson::class);
        $requestMock = Mockery::mock(Request::class);
        $this->mock = new MockFactory();
        $this->subject = new GetSettingsEndpoint($requestMock, $this->mock);
    }

    public function testValidateRequest()
    {
        $errorList = $this->subject->validateRequest();
        $this->assertTrue($errorList->isEmpty());
    }

    public function testExecute()
    {
        $this->mock->settingsManager
            ->shouldReceive('loadSettings');
        $this->mock->settingsManager
            ->shouldReceive('getSettings')
            ->andReturn(['setting' => 5]);
        $this->mock->settingsManager
            ->shouldReceive('getErrorList')
            ->andReturn($this->errorListMock);
        $this->responseMock
            ->shouldReceive('appendErrors')
            ->with($this->errorListMock);
        $this->responseMock
            ->shouldReceive('setResponse')
            ->with(['setting' => 5]);
        $this->subject->execute($this->responseMock);

        //noting to test
        $this->assertTrue(true);
    }
}
