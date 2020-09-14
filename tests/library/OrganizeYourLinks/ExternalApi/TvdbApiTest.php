<?php

namespace OrganizeYourLinks\ExternalApi;

use Mockery;
use OrganizeYourLinks\DataSource\DataSourceInterface;
use OrganizeYourLinks\Types\ErrorListInterface;
use PHPUnit\Framework\TestCase;

class TvdbApiTest extends TestCase
{
    private string $keyFile;
    private string $certFile;
    private $sourceMock;
    private $errorListMock;
    private $subjectMock;

    public function setUp(): void
    {
        $this->keyFile = __DIR__.'/../../../../data/apikey.json';
        $this->certFile = __DIR__.'/../../../../data/cacert.pem';
        $this->sourceMock = Mockery::mock(DataSourceInterface::class);
        $this->errorListMock = Mockery::mock(ErrorListInterface::class);
        $this->sourceMock
            ->shouldReceive('loadTvdbApiToken')
            ->andReturn('');
        $this->sourceMock
            ->shouldReceive('getCaFilePath')
            ->andReturn($this->certFile);
        $this->subjectMock = Mockery::mock(TvdbApi::class);
        $this->subjectMock->makePartial();
        $this->subjectMock->setDataSource($this->sourceMock);
        $this->subjectMock->setErrorList($this->errorListMock);
    }

    public function testPrepare()
    {
        $this->sourceMock
            ->shouldReceive('isTvdbApiTokenValid')
            ->andReturn(true);
        $subject = new TvdbApi($this->sourceMock, $this->errorListMock);
        $result = $subject->prepare();
        $this->assertEquals(true, $result);
    }

    public function testGetNewToken()
    {
        $this->sourceMock
            ->shouldReceive('isTvdbApiTokenValid')
            ->andReturn(false);
        $this->sourceMock
            ->shouldReceive('loadTvdbApiKeyAsJSON')
            ->andReturn(file_get_contents($this->keyFile));
        $this->sourceMock
            ->shouldReceive('getCaFilePath')
            ->andReturn($this->certFile);
        $newErrorListMock = Mockery::mock(ErrorListInterface::class);
        $newErrorListMock
            ->shouldReceive('isEmpty')
            ->andReturn(true);
        $this->sourceMock
            ->shouldReceive('saveTvdbApiToken')
            ->andReturn($newErrorListMock);
        $this->errorListMock
            ->shouldReceive('add')
            ->with($newErrorListMock)
            ->andReturn($this->errorListMock);
        $this->errorListMock
            ->shouldReceive('isEmpty')
            ->andReturn(true);
        $subject = new TvdbApi($this->sourceMock, $this->errorListMock);
        $result = $subject->prepare();
        $this->assertEquals(true, $result);
        $this->assertEquals(true, $subject->noErrors());
        $this->assertEquals(true, $subject->addToErrorList($newErrorListMock));
    }

    public function testSearch()
    {
        $this->sourceMock
            ->shouldReceive('isTvdbApiTokenValid')
            ->andReturn(true);
        $this->subjectMock
            ->shouldReceive('file_get_contents')
            ->withSomeOfArgs('https://api.thetvdb.com/search/series?name=one+piece')
            ->times(3)
            ->andReturn('{}');
        $this->subjectMock->prepare();
        $result = $this->subjectMock->search('one piece');
        $this->assertEquals(true, $result);
    }

    public function testGetEpisodes()
    {
        $this->sourceMock
            ->shouldReceive('isTvdbApiTokenValid')
            ->andReturn(true);
        $this->subjectMock
            ->shouldReceive('file_get_contents')
            ->withSomeOfArgs('https://api.thetvdb.com/series/74796/episodes?page=1')
            ->times(3)
            ->andReturn(json_encode([
                "data" => [
                    [
                        "episodeName" => "test",
                        "airedSeason" => 1,
                        "airedEpisodeNumber" => 1,
                    ]
                ],
                "links" => [
                    "next" => null
                ]
            ], JSON_PRETTY_PRINT));
        $this->subjectMock->prepare();
        $this->subjectMock->getEpisodes(74796);
        $this->assertEquals(true, isset($this->subjectMock->getContent()['1']));
    }

    public function testGetImages()
    {
        $this->sourceMock
            ->shouldReceive('isTvdbApiTokenValid')
            ->andReturn(true);
        $this->subjectMock
            ->shouldReceive('file_get_contents')
            ->withSomeOfArgs('https://api.thetvdb.com/series/74796/images/query?keyType=season')
            ->once()
            ->andReturn(json_encode([
                "data" => [
                    [
                        "subKey" => "key",
                        "fileName" => "test"
                    ]
                ]
            ]));
        $this->subjectMock->prepare();
        $this->assertEquals(true, $this->subjectMock->getImages(74796));
    }
}
