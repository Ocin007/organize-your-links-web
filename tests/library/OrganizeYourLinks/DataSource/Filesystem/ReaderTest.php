<?php

namespace OrganizeYourLinks\DataSource\Filesystem;

use PHPUnit\Framework\TestCase;

class ReaderTest extends TestCase
{
    const FIXTURES_DIR = __DIR__ . '/../../../../fixtures/Filesystem';
    const FILE_NOT_EXIST = self::FIXTURES_DIR . '/fileNotExist.json';
    const FILE_EXIST = self::FIXTURES_DIR . '/test.json';

    private Reader $subject;

    public function setUp(): void
    {
        $this->subject = new Reader();
    }

    public function testReadExistingFile()
    {
        $this->assertEquals('{}', $this->subject->readFile(self::FILE_EXIST));
    }

    public function testReadNoExistingFile()
    {
        $this->assertEquals(null, $this->subject->readFile(self::FILE_NOT_EXIST));
    }

    public function testReadDir()
    {
        $this->assertEquals(null, $this->subject->readFile(self::FIXTURES_DIR));
    }
}
