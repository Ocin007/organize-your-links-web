<?php

namespace OrganizeYourLinks\Api\Endpoint\Settings\Update;

use Mockery;
use OrganizeYourLinks\Api\MockFactory;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\Types\ErrorList;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../../../../../helpers/MockFactory.php';

class UpdateSettingsEndpointTest extends TestCase
{
    private $errorListMock;
    private $responseMock;
    private $requestMock;
    private MockFactory $mock;
    private UpdateSettingsEndpoint $subject;

    public function setUp(): void
    {
        $this->errorListMock = Mockery::mock(ErrorList::class);
        $this->responseMock = Mockery::mock(ResponseJson::class);
        $this->requestMock = Mockery::mock(Request::class);
        $this->mock = new MockFactory();
        $this->subject = new UpdateSettingsEndpoint($this->requestMock, $this->mock);
    }

    public function testValidateRequestIdExist()
    {
        $this->requestMock
            ->shouldReceive('getRawBody')
            ->andReturn(['initialDataId' => 'wasd']);
        $this->mock->settingsValidator
            ->shouldReceive('validate')
            ->with(['initialDataId' => 'wasd'])
            ->andReturn($this->errorListMock);
        $this->mock->source
            ->shouldReceive('seriesExist')
            ->andReturn(true);
        $this->subject->validateRequest();

        //nothing to test
        $this->assertTrue(true);
    }

    public function testValidateRequestIdNotExist()
    {
        $this->requestMock
            ->shouldReceive('getRawBody')
            ->andReturn(['initialDataId' => 'xyz']);
        $this->mock->settingsValidator
            ->shouldReceive('validate')
            ->with(['initialDataId' => 'xyz'])
            ->andReturn($this->errorListMock);
        $this->mock->source
            ->shouldReceive('seriesExist')
            ->andReturn(false);
        $this->errorListMock
            ->shouldReceive('add')
            ->with('series does not exist');
        $this->subject->validateRequest();

        //nothing to test
        $this->assertTrue(true);
    }

    public function testExecute()
    {
        $this->requestMock
            ->shouldReceive('getRawBody')
            ->andReturn(['setting' => false]);
        $this->mock->settingsManager
            ->shouldReceive('setSettings')
            ->with(['setting' => false]);
        $this->mock->settingsManager
            ->shouldReceive('saveSettings');
        $this->mock->settingsManager
            ->shouldReceive('getErrorList')
            ->andReturn($this->errorListMock);
        $this->responseMock
            ->shouldReceive('appendErrors')
            ->with($this->errorListMock);
        $this->subject->execute($this->responseMock);

        //nothing to test
        $this->assertTrue(true);
    }
}
