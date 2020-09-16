<?php


namespace OrganizeYourLinks\Api\Endpoint\Tvdb\Id\Images;


use OrganizeYourLinks\Api\Endpoint\Tvdb\Id\AbstractTvdbRouteIdEndpoint;
use OrganizeYourLinks\Api\HelperFactoryInterface;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response;
use OrganizeYourLinks\ExternalApi\TvdbApi;
use OrganizeYourLinks\Types\ErrorList;

class GetImagesOfTvdbIdEndpoint extends AbstractTvdbRouteIdEndpoint
{
    private Request $request;
    private TvdbApi $tvdb;

    public function __construct(Request $request, HelperFactoryInterface $factory)
    {
        $this->request = $request;
        $this->tvdb = $factory->getTvdbApiManager();
    }

    public function execute(Response $response): void
    {
        $id = $this->request->getRouteParam(Request::KEY_ROUTE_TVDB_ID);
        $success = $this->tvdb->getImages($id);
        $errorList = new ErrorList();
        if(!$success) {
            $errorList->add(ErrorList::TVDV_API_NO_THUMBNAILS_FOUND);
        }
        $response->appendErrors($errorList);
        $response->setResponse($this->tvdb->getContent());
    }
}