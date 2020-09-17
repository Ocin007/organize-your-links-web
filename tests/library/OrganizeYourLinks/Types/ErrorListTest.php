<?php

namespace OrganizeYourLinks\Types;

use PHPUnit\Framework\TestCase;

class ErrorListTest extends TestCase
{
    private ErrorList $subject;

    public function setUp(): void
    {
        $this->subject = new ErrorList();
    }

    public function testGetErrorList()
    {
        $this->assertEquals([], $this->subject->getErrorList());
        $this->subject->add('test1')->add(['test2', 'test1']);
        $this->assertEquals(['test1', 'test2', 'test1'], $this->subject->getErrorList());
    }

    public function testAdd()
    {
        $error1 = 'test';
        $error2 = ['1', '2'];
        $error3 = new ErrorList('test');
        $this->assertEquals([], $this->subject->add(5)->getErrorList());
        $this->assertEquals([], $this->subject->add('')->getErrorList());
        $this->assertEquals(['test'], $this->subject->add($error1)->getErrorList());
        $this->assertEquals(['test', '1', '2'], $this->subject->add($error2)->getErrorList());
        $this->assertEquals(['test', '1', '2', 'test'], $this->subject->add($error3)->getErrorList());
    }

    public function testIsEmpty()
    {
        $this->assertEquals(true, $this->subject->isEmpty());
        $this->subject->add('test');
        $this->assertEquals(false, $this->subject->isEmpty());
    }
}
