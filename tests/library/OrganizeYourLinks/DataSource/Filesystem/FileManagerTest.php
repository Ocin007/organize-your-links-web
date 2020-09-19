<?php

namespace OrganizeYourLinks\DataSource\Filesystem;

use Mockery;
use OrganizeYourLinks\Filter\FilterInterface;
use OrganizeYourLinks\Generator\FileNameGenerator;
use OrganizeYourLinks\Sorter\SorterInterface;
use OrganizeYourLinks\Types\ErrorListInterface;
use PHPUnit\Framework\TestCase;

class FileManagerTest extends TestCase
{
    const REAL_DATA_DIR = __DIR__ . '/../../../../../data';
    const REAL_KEY_FILE = self::REAL_DATA_DIR . '/apikey.json';
    const REAL_TOKEN_FILE = self::REAL_DATA_DIR . '/apitoken.txt';

    private $readerMock;
    private $writerMock;
    private $nameGeneratorMock;
    private FileManager $subject;

    public function setUp(): void
    {
        $this->readerMock = Mockery::mock(Reader::class);
        $this->writerMock = Mockery::mock(Writer::class);
        $this->nameGeneratorMock = Mockery::mock(FileNameGenerator::class);
        $this->subject = new FileManager($this->readerMock, $this->writerMock, $this->nameGeneratorMock);
    }

    public function testLoadTvdbApiToken()
    {
        $this->readerMock
            ->shouldReceive('readFile')
            ->andReturn('test');
        $this->assertEquals('test', $this->subject->loadTvdbApiToken());
    }

    public function testKeyFileExist()
    {
        $this->assertEquals(file_exists(self::REAL_KEY_FILE), $this->subject->keyFileExist());
    }

    public function testLoadAllSeries()
    {
        $filterMock = Mockery::mock(FilterInterface::class);
        $sorterMock = Mockery::mock(SorterInterface::class);
        $this->readerMock
            ->shouldReceive('readFile')
            ->andReturnValues([
                '{"wasd":"file.json"}',
                '{"id":"wasd"}'
            ]);
        $expected = [['id' => 'wasd']];
        $filterMock
            ->shouldReceive('filter')
            ->with($expected)
            ->andReturn($expected);
        $sorterMock
            ->shouldReceive('sort')
            ->with($expected)
            ->andReturn($expected);
        $this->assertEquals($expected, $this->subject->loadAllSeries($filterMock, $sorterMock));
    }

    public function testLoadAllSeriesNoIdFileMap()
    {
        $this->mockLoadIdFileMap();
        $errorList = $this->subject->loadAllSeries();
        $this->assertTrue($errorList instanceof ErrorListInterface);
        $this->assertFalse($errorList->isEmpty());
    }

    public function testLoadAllSeriesErrorReadFile()
    {
        $this->readerMock
            ->shouldReceive('readFile')
            ->andReturnValues([
                '{"wasd":"file.json"}',
                null
            ]);
        $errorList = $this->subject->loadAllSeries();
        $this->assertTrue($errorList instanceof ErrorListInterface);
        $this->assertFalse($errorList->isEmpty());
    }

    public function testCheckSeriesNames()
    {
        $series = [
            'name_de' => 'test1',
            'name_en' => 'test2',
            'name_jpn' => 'test3'
        ];
        $generatedFile = 'test1.json';
        $this->mockCheckSeriesNames($series['name_de'], $generatedFile);
        $errorList = $this->subject->checkSeriesNames($series);
        $this->assertTrue($errorList->isEmpty());
    }

    public function testCheckSeriesNamesDuplicateName()
    {
        $series = [
            'name_de' => 'test1',
            'name_en' => 'test2',
            'name_jpn' => 'en'
        ];
        $generatedFile = 'test1.json';
        $this->mockCheckSeriesNames($series['name_de'], $generatedFile);
        $errorList = $this->subject->checkSeriesNames($series);
        $this->assertFalse($errorList->isEmpty());
        $this->assertEquals([
            'duplicate series name: name_jpn'
        ], $errorList->getErrorList());
    }

    public function testCheckSeriesNamesAlreadyExistingFile()
    {
        $series = [
            'name_de' => 'File',
            'name_en' => 'test2',
            'name_jpn' => 'test3'
        ];
        $generatedFile = 'file.json';
        $this->mockCheckSeriesNames($series['name_de'], $generatedFile);
        $errorList = $this->subject->checkSeriesNames($series);
        $this->assertFalse($errorList->isEmpty());
        $this->assertEquals([
            'series names invalid'
        ], $errorList->getErrorList());
    }

    public function testCheckSeriesNamesBothErrors()
    {
        $series = [
            'name_de' => 'File',
            'name_en' => 'en',
            'name_jpn' => ''
        ];
        $generatedFile = 'file.json';
        $this->mockCheckSeriesNames($series['name_de'], $generatedFile);
        $errorList = $this->subject->checkSeriesNames($series);
        $this->assertFalse($errorList->isEmpty());
        $this->assertEquals([
            'duplicate series name: name_en',
            'series names invalid'
        ], $errorList->getErrorList());
    }

    public function testCreateSeries()
    {
        $series = [
            'name_de' => 'test1',
            'name_en' => 'test2',
            'name_jpn' => 'test3'
        ];
        $this->mockLoadIdFileMap('{"wasd":"file.json"}');
        $this->nameGeneratorMock
            ->shouldReceive('generate')
            ->with('test1')
            ->andReturn('test1.json');
        $this->writerMock
            ->shouldReceive('writeFile')
            ->andReturn(true);
        $errorList = $this->subject->createSeries('xyz', $series);
        $this->assertTrue($errorList->isEmpty());
    }

    public function testDeleteSeries()
    {
        $this->mockLoadIdFileMap('{"wasd":"file.json"}');
        $this->writerMock
            ->shouldReceive('deleteFile')
            ->andReturn(true);
        $this->writerMock
            ->shouldReceive('writeFile')
            ->andReturn(true);
        $errorList = $this->subject->deleteSeries('wasd');
        $this->assertTrue($errorList->isEmpty());
    }

    public function testDeleteSeriesErrorLoadIdFileMap()
    {
        $this->mockLoadIdFileMap();
        $errorList = $this->subject->deleteSeries('wasd');
        $this->assertFalse($errorList->isEmpty());
    }

    public function testDeleteSeriesErrorDeleteFile()
    {
        $this->mockLoadIdFileMap('{"wasd":"file.json"}');
        $this->writerMock
            ->shouldReceive('deleteFile')
            ->andReturn(false);
        $errorList = $this->subject->deleteSeries('wasd');
        $this->assertFalse($errorList->isEmpty());
    }

    public function testSaveTvdbApiToken()
    {
        $this->writerMock
            ->shouldReceive('writeFile')
            ->andReturn(true);
        $errorList = $this->subject->saveTvdbApiToken('wasd');
        $this->assertTrue($errorList->isEmpty());
    }

    public function testSaveSettings()
    {
        $this->writerMock
            ->shouldReceive('writeFile')
            ->andReturn(true);
        $errorList = $this->subject->saveSettings(['setting' => 'test']);
        $this->assertTrue($errorList->isEmpty());
    }

    public function testLoadTvdbApiKeyAsJSON()
    {
        $this->readerMock
            ->shouldReceive('readFile')
            ->andReturn(null);
        $errorList = $this->subject->loadTvdbApiKeyAsJSON();
        $this->assertTrue($errorList instanceof ErrorListInterface);
        $this->assertFalse($errorList->isEmpty());
    }

    public function testSaveSeries()
    {
        $this->mockLoadIdFileMap('{"wasd":"file.json"}');
        $this->writerMock
            ->shouldReceive('writeFile')
            ->andReturn(true);
        $errorList = $this->subject->saveSeries(['id' => 'wasd']);
        $this->assertTrue($errorList->isEmpty());
    }

    public function testSaveSeriesNotExist()
    {
        $this->mockLoadIdFileMap('{"wasd":"file.json"}');
        $errorList = $this->subject->saveSeries(['id' => 'xyz']);
        $this->assertFalse($errorList->isEmpty());
    }

    public function testIsDataDirectoryWritable()
    {
        $this->assertEquals(
            is_writable(self::REAL_DATA_DIR),
            $this->subject->isDataDirectoryWritable()
        );
    }

    public function testGetCaFilePath()
    {
        $path = $this->subject->getCaFilePath();
        $this->assertTrue($path !== '');
    }

    public function testLoadSettings()
    {
        $this->readerMock
            ->shouldReceive('readFile')
            ->andReturnValues(['{"setting":"test"}', null]);
        $this->assertEquals(['setting' => 'test'], $this->subject->loadSettings());
        $this->assertEquals(null, $this->subject->loadSettings());
    }

    public function testSeriesExist()
    {
        $this->mockLoadIdFileMap('{"wasd":"file.json"}');
        $this->assertTrue($this->subject->seriesExist('wasd'));
        $this->assertFalse($this->subject->seriesExist('xyz'));
    }

    public function testIsTvdbApiTokenValid()
    {
        $expected = file_exists(self::REAL_TOKEN_FILE) &&
            time() - filemtime(self::REAL_TOKEN_FILE) <= 82800;
        $this->assertEquals($expected, $this->subject->isTvdbApiTokenValid());
    }

    private function mockLoadIdFileMap(?string $return = null)
    {
        $this->readerMock
            ->shouldReceive('readFile')
            ->andReturn($return);
    }

    private function mockCheckSeriesNames(string $name, string $generatedFile)
    {
        $this->readerMock
            ->shouldReceive('readFile')
            ->andReturnValues([
                '{"wasd":"file.json"}',
                '{"id":"wasd","name_de":"file","name_en":"en","name_jpn":"jpn"}'
            ]);
        $this->nameGeneratorMock
            ->shouldReceive('generate')
            ->with($name)
            ->andReturn($generatedFile);
    }
}
