<?php


namespace OrganizeYourLinks\Api\Endpoint\Tvdb\Search;


use OrganizeYourLinks\Api\JsonEndpointHandlerInterface;
use OrganizeYourLinks\Api\HelperFactoryInterface;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\ExternalApi\TvdbApi;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;

class SearchForSeriesInTvdbEndpoint implements JsonEndpointHandlerInterface
{
    private Request $request;
    private TvdbApi $tvdb;

    public function __construct(Request $request, HelperFactoryInterface $factory)
    {
        $this->request = $request;
        $this->tvdb = $factory->getTvdbApiManager();
    }

    public function validateRequest(): ErrorListInterface
    {
        $success = $this->tvdb->prepare();
        $errorList = $this->tvdb->getErrorList();
        if (!$success) {
            $errorList->add(ErrorList::TVDB_API_PREPARING_FAILED);
        }
        return $errorList;
    }

    public function execute(ResponseJson $response): void
    {
        $searchStr = $this->request->getRawParam(Request::KEY_SEARCH_STRING);
        $success = $this->tvdb->search($searchStr);
        $errorList = new ErrorList();
        if (!$success) {
            $errorList->add(ErrorList::TVDV_API_NOTHING_FOUND);
        }
        $response->appendErrors($errorList);
        $response->setResponse($this->tvdb->getContent());
    }
}