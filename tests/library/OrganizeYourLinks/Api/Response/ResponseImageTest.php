<?php

namespace OrganizeYourLinks\Api\Response;

use Mockery;
use OrganizeYourLinks\Types\ErrorList;
use PHPUnit\Framework\TestCase;

class ResponseImageTest extends TestCase
{
    private $errorListMock;
    private $newErrorListMock;
    private ResponseImage $subject;

    public function setUp(): void
    {
        $this->errorListMock = Mockery::mock(ErrorList::class);
        $this->newErrorListMock = Mockery::mock(ErrorList::class);
        $this->subject = new ResponseImage($this->errorListMock);
    }

    public function testGetSetContents()
    {
        $this->subject->setContents('test');
        $this->assertEquals('test', $this->subject->getContents());
    }

    public function testGetContentType()
    {
        $this->assertEquals('image/jpeg', $this->subject->getContentType());
    }

    public function testGetErrorList()
    {
        $this->assertEquals($this->errorListMock, $this->subject->getErrorList());
    }

    public function testAddToErrorList()
    {
        $this->assertFalse($this->subject->addToErrorList(''));
        $this->errorListMock
            ->shouldReceive('add')
            ->once()
            ->with($this->newErrorListMock);
        $this->assertTrue($this->subject->addToErrorList($this->newErrorListMock));
    }

    public function testNoErrors()
    {
        $this->errorListMock
            ->shouldReceive('isEmpty')
            ->andReturn(false);
        $this->assertFalse($this->subject->noErrors());
    }
}
