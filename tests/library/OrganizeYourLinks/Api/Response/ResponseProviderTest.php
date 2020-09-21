<?php

namespace OrganizeYourLinks\Api\Response;

use Mockery;
use PHPUnit\Framework\TestCase;

class ResponseProviderTest extends TestCase
{

    public function testInstance()
    {
        $instance1 = ResponseProvider::instance();
        $instance2 = ResponseProvider::instance();
        $this->assertTrue($instance1 === $instance2);
    }

    public function testSetGetResponse()
    {
        $instance = ResponseProvider::instance();
        $instance->setResponse(null);
        $this->assertEquals(null, $instance->getResponse());
        $responseMock = Mockery::mock(ResponseJson::class);
        $instance->setResponse($responseMock);
        $this->assertTrue($responseMock === $instance->getResponse());
    }
}
