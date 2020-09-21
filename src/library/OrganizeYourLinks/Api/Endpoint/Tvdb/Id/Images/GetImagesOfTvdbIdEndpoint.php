<?php


namespace OrganizeYourLinks\Api\Endpoint\Tvdb\Id\Images;


use OrganizeYourLinks\Api\Endpoint\Tvdb\Id\AbstractTvdbRouteIdEndpoint;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\Types\ErrorList;

class GetImagesOfTvdbIdEndpoint extends AbstractTvdbRouteIdEndpoint
{
    public function execute(ResponseJson $response): void
    {
        $id = $this->request->getRouteParam(Request::KEY_ROUTE_TVDB_ID);
        $success = $this->tvdb->getImages($id);
        $errorList = new ErrorList();
        if (!$success) {
            $errorList->add(ErrorList::TVDV_API_NO_THUMBNAILS_FOUND);
        }
        $response->appendErrors($errorList);
        $response->setResponse($this->tvdb->getContent());
    }
}