<?php


namespace OrganizeYourLinks\Api\Endpoint\Tvdb\Id;


use OrganizeYourLinks\Api\EndpointHandlerInterface;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;

abstract class AbstractTvdbRouteIdEndpoint implements EndpointHandlerInterface
{
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
}