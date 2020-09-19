<?php

namespace OrganizeYourLinks\Types\Converter;

use Mockery;
use OrganizeYourLinks\Types\Episode;
use OrganizeYourLinks\Types\EpisodeInterface;
use OrganizeYourLinks\Types\Season;
use OrganizeYourLinks\Types\SeasonInterface;
use OrganizeYourLinks\Types\Series;
use OrganizeYourLinks\Types\SeriesInterface;
use PHPUnit\Framework\TestCase;

class SeriesConverterTest extends TestCase
{
    const TEST_FILE = __DIR__ . '/../../../../fixtures/SeriesConverterTest/test.json';
    const TEST_FILE_2 = __DIR__ . '/../../../../fixtures/SeriesConverterTest/test2.json';

    private SeriesConverter $subject;

    public function setUp(): void
    {
        $this->subject = new SeriesConverter();
    }

    public function testConvertToObject()
    {
        $testData = json_decode(file_get_contents(self::TEST_FILE), true);
        $series = $this->subject->convertToObject($testData);
        $this->assertEquals(
            $series->get(SeriesInterface::KEY_ID),
            $testData['id']
        );
        $this->assertEquals(
            $series->getSeasons()[0]->get(SeasonInterface::KEY_THUMBNAIL),
            $testData['seasons'][0]['thumbnail']
        );
        $this->assertEquals(
            $series->getSeasons()[1]->getEpisodes()[1]->get(EpisodeInterface::KEY_URL),
            $testData['seasons'][1]['episodes'][1]['url']
        );
        $this->assertSameSize(
            $series->getSeasons(),
            $testData['seasons']
        );
        $this->assertSameSize(
            $series->getSeasons()[0]->getEpisodes(),
            $testData['seasons'][0]['episodes']
        );
    }

    public function testConvertToNative()
    {
        $testData = json_decode(file_get_contents(self::TEST_FILE_2), true);
        $keyValue = [
            'key1' => 'test',
            'key2' => 5
        ];
        $episodeMock = Mockery::mock(Episode::class);
        $episodeMock
            ->shouldReceive('getAll')
            ->andReturn($keyValue);

        $seasonMock = Mockery::mock(Season::class);
        $seasonMock
            ->shouldReceive('getAll')
            ->andReturn($keyValue);
        $seasonMock
            ->shouldReceive('getEpisodes')
            ->andReturn([$episodeMock]);

        $seriesMock = Mockery::mock(Series::class);
        $seriesMock
            ->shouldReceive('getAll')
            ->andReturn($keyValue);
        $seriesMock
            ->shouldReceive('getSeasons')
            ->andReturn([$seasonMock]);

        $native = $this->subject->convertToNative($seriesMock);
        $this->assertEquals($testData, $native);
    }
}
