<?php


namespace OrganizeYourLinks\Api\Endpoint\Tvdb\Id\Episodes;


use OrganizeYourLinks\Api\EndpointHandlerInterface;
use OrganizeYourLinks\Api\HelperFactoryInterface;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response;
use OrganizeYourLinks\ExternalApi\TvdbApi;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;

class GetEpisodesOfTvdbIdEndpoint implements EndpointHandlerInterface
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
        $idStr = $this->request->getRouteParam(Request::KEY_ROUTE_TVDB_ID);
        $tvdbId = intval($idStr);
        if($tvdbId <= 1) {
            return new ErrorList(ErrorList::TVDB_API_SERIES_ID_NOT_VALID);
        }
        $success = $this->tvdb->prepare();
        $errorList = $this->tvdb->getErrorList();
        if(!$success) {
            $errorList->add(ErrorList::TVDB_API_PREPARING_FAILED);
        }
        return $errorList;
    }

    public function execute(Response $response): void
    {
        $id = $this->request->getRouteParam(Request::KEY_ROUTE_TVDB_ID);
        $this->tvdb->getEpisodes($id);
        $response->setResponse($this->tvdb->getContent());
    }
}