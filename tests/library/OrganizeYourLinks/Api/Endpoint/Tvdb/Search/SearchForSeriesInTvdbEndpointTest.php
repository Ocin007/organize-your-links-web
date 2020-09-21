<?php

namespace OrganizeYourLinks\Api\Endpoint\Tvdb\Search;

use Mockery;
use OrganizeYourLinks\Api\MockFactory;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\Types\ErrorList;
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../../../../../helpers/MockFactory.php';

class SearchForSeriesInTvdbEndpointTest extends TestCase
{
    private $errorListMock;
    private $responseMock;
    private $requestMock;
    private MockFactory $mock;
    private SearchForSeriesInTvdbEndpoint $subject;

    public function setUp(): void
    {
        $this->errorListMock = Mockery::mock(ErrorList::class);
        $this->responseMock = Mockery::mock(ResponseJson::class);
        $this->requestMock = Mockery::mock(Request::class);
        $this->mock = new MockFactory();
        $this->subject = new SearchForSeriesInTvdbEndpoint($this->requestMock, $this->mock);
    }

    public function testValidateRequestPreparingFailed()
    {
        $this->mock->tvdbApi
            ->shouldReceive('prepare')
            ->andReturn(false);
        $this->mock->tvdbApi
            ->shouldReceive('getErrorList')
            ->andReturn($this->errorListMock);
        $this->errorListMock
            ->shouldReceive('add')
            ->with('preparing failed');
        $this->subject->validateRequest();

        //nothing to test
        $this->assertTrue(true);
    }

    public function testExecuteNothingFound()
    {
        $this->requestMock
            ->shouldReceive('getRawParam')
            ->with('searchStr')
            ->andReturn('test');
        $this->mock->tvdbApi
            ->shouldReceive('search')
            ->with('test')
            ->andReturn(false);
        $this->responseMock
            ->shouldReceive('appendErrors');
        $tvdbContent = [
            'de' => ['Error' => 'Resource not found'],
            'en' => ['Error' => 'Resource not found'],
            'ja' => ['Error' => 'Resource not found']
        ];
        $this->mock->tvdbApi
            ->shouldReceive('getContent')
            ->andReturn($tvdbContent);
        $this->responseMock
            ->shouldReceive('setResponse')
            ->with($tvdbContent);
        $this->subject->execute($this->responseMock);

        //nothing to test
        $this->assertTrue(true);
    }
}
