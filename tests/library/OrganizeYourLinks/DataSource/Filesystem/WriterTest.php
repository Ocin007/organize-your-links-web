<?php

namespace OrganizeYourLinks\DataSource\Filesystem;

use PHPUnit\Framework\TestCase;

class WriterTest extends TestCase
{
    const FIXTURES_DIR = __DIR__ . '/../../../../fixtures/Filesystem';
    const FILE_NOT_EXIST = self::FIXTURES_DIR . '/fileNotExist.json';
    const FILE_EXIST = self::FIXTURES_DIR . '/test.json';

    private Writer $subject;

    public function setUp(): void
    {
        $this->subject = new Writer();
        if(file_exists(self::FILE_NOT_EXIST)) {
            unlink(self::FILE_NOT_EXIST);
        }
        file_put_contents(self::FILE_EXIST, '{}');
    }

    public function tearDown(): void
    {
        if(file_exists(self::FILE_NOT_EXIST)) {
            unlink(self::FILE_NOT_EXIST);
        }
        file_put_contents(self::FILE_EXIST, '{}');
    }

    public function testWriteNewFile()
    {
        $this->assertFalse(file_exists(self::FILE_NOT_EXIST));
        $this->assertTrue($this->subject->writeFile(self::FILE_NOT_EXIST, '{}'));
        $this->assertTrue(file_exists(self::FILE_NOT_EXIST));
    }

    public function testWriteExistingFile()
    {
        $this->assertTrue(file_exists(self::FILE_EXIST));
        $this->assertTrue($this->subject->writeFile(self::FILE_EXIST, '{"test":true}'));
        $content = file_get_contents(self::FILE_EXIST);
        $this->assertEquals('{"test":true}', $content);
    }

    public function testWriteDir()
    {
        $this->assertFalse($this->subject->writeFile(self::FIXTURES_DIR, '{}'));
    }

    public function testDeleteFile()
    {
        $this->subject->writeFile(self::FILE_NOT_EXIST, '{}');
        $this->assertTrue($this->subject->deleteFile(self::FILE_NOT_EXIST));
    }

    public function testDeleteDir()
    {
        $this->assertFalse($this->subject->deleteFile(self::FIXTURES_DIR));
    }
}
