<?php


namespace OrganizeYourLinks\Api\Endpoint\Tvdb\Id\Episodes;


use OrganizeYourLinks\Api\Endpoint\Tvdb\Id\AbstractTvdbRouteIdEndpoint;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response\ResponseJson;

class GetEpisodesOfTvdbIdEndpoint extends AbstractTvdbRouteIdEndpoint
{
    public function execute(ResponseJson $response): void
    {
        $id = $this->request->getRouteParam(Request::KEY_ROUTE_TVDB_ID);
        $this->tvdb->getEpisodes($id);
        $response->setResponse($this->tvdb->getContent());
    }
}