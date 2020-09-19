<?php

namespace OrganizeYourLinks\Manager;

use Mockery;
use OrganizeYourLinks\DataSource\DataSourceInterface;
use OrganizeYourLinks\Types\Converter\SeriesConverter;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\SeriesInterface;
use PHPUnit\Framework\TestCase;

class SeriesManagerTest extends TestCase
{
    private $sourceMock;
    private $errorListMock;
    private $converterMock;
    private $newErrorListMock;
    private $newErrorList2Mock;
    private SeriesManager $subject;
    private $seriesMock;

    public function setUp(): void
    {
        $this->sourceMock = Mockery::mock(DataSourceInterface::class);
        $this->errorListMock = Mockery::mock(ErrorList::class);
        $this->converterMock = Mockery::mock(SeriesConverter::class);
        $this->newErrorListMock = Mockery::mock(ErrorList::class);
        $this->newErrorList2Mock = Mockery::mock(ErrorList::class);
        $this->subject = new SeriesManager($this->sourceMock, $this->errorListMock, $this->converterMock);
        $this->seriesMock = Mockery::mock(SeriesInterface::class);
    }

    public function testDeleteSeriesMulti()
    {
        $idList = ['id1', 'id2'];
        $this->sourceMock
            ->shouldReceive('deleteSeries')
            ->with($idList[0])
            ->andReturn($this->newErrorListMock);
        $this->sourceMock
            ->shouldReceive('deleteSeries')
            ->with($idList[1])
            ->andReturn($this->newErrorList2Mock);
        $this->errorListMock
            ->shouldReceive('add')
            ->with($this->newErrorListMock);
        $this->errorListMock
            ->shouldReceive('add')
            ->with($this->newErrorList2Mock);
        $this->subject->deleteSeriesMulti($idList);

        //nothing to test
        $this->assertTrue(true);
    }

    public function testGetAll()
    {
        $this->sourceMock
            ->shouldReceive('loadAllSeries')
            ->with(null, null)
            ->andReturn([
                ['key' => 'value']
            ]);
        $this->converterMock
            ->shouldReceive('convertToObject')
            ->with(['key' => 'value'])
            ->andReturn($this->seriesMock);
        $this->assertEquals($this->seriesMock, $this->subject->getAll()[0]);
    }

    public function testGetAllNull()
    {
        $this->sourceMock
            ->shouldReceive('loadAllSeries')
            ->with(null, null)
            ->andReturn($this->newErrorListMock);
        $this->errorListMock
            ->shouldReceive('add')
            ->with($this->newErrorListMock);
        $this->assertEquals(null, $this->subject->getAll());
    }

    public function testUpdateSeriesMulti()
    {
        $this->converterMock
            ->shouldReceive('convertToNative')
            ->with($this->seriesMock)
            ->andReturn(['id' => 'wasd']);
        $this->sourceMock
            ->shouldReceive('saveSeries')
            ->with(['id' => 'wasd'])
            ->andReturn($this->newErrorListMock);
        $this->newErrorListMock
            ->shouldReceive('isEmpty')
            ->andReturn(true);
        $this->seriesMock
            ->shouldReceive('get')
            ->with('id')
            ->andReturn('wasd');
        $idList = $this->subject->updateSeriesMulti([$this->seriesMock]);
        $this->assertEquals(['wasd'], $idList);
    }

    public function testUpdateSeriesMultiErrorOnSave()
    {
        $this->converterMock
            ->shouldReceive('convertToNative')
            ->with($this->seriesMock)
            ->andReturn(['id' => 'wasd']);
        $this->sourceMock
            ->shouldReceive('saveSeries')
            ->with(['id' => 'wasd'])
            ->andReturn($this->newErrorListMock);
        $this->newErrorListMock
            ->shouldReceive('isEmpty')
            ->andReturn(false);
        $this->errorListMock
            ->shouldReceive('add')
            ->with($this->newErrorListMock);
        $idList = $this->subject->updateSeriesMulti([$this->seriesMock]);
        $this->assertEquals([], $idList);
    }

    public function testCreateSeriesMulti()
    {
        $this->sourceMock
            ->shouldReceive('seriesExist')
            ->once()
            ->andReturn(false);
        $this->seriesMock
            ->shouldReceive('set')
            ->withSomeOfArgs('id');
        $this->seriesMock
            ->shouldReceive('getAll')
            ->andReturn(['key' => 'value']);
        $this->sourceMock
            ->shouldReceive('createSeries')
            ->withSomeOfArgs(['key' => 'value', 'seasons' => []])
            ->andReturn($this->newErrorListMock);
        $this->errorListMock
            ->shouldReceive('add')
            ->with($this->newErrorListMock);
        $this->subject->createSeriesMulti([$this->seriesMock]);

        //nothing to test
        $this->assertTrue(true);
    }

    public function testGetErrorList()
    {
        $this->assertEquals($this->errorListMock, $this->subject->getErrorList());
    }

    public function testNoErrors()
    {
        $this->errorListMock
            ->shouldReceive('isEmpty')
            ->andReturn(false);
        $this->assertFalse($this->subject->noErrors());
    }
}
