<?php


namespace OrganizeYourLinks\Api\Endpoint\Tvdb\Id\Episodes;


use OrganizeYourLinks\Api\Endpoint\Tvdb\Id\AbstractTvdbRouteIdEndpoint;
use OrganizeYourLinks\Api\HelperFactoryInterface;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response;
use OrganizeYourLinks\ExternalApi\TvdbApi;

class GetEpisodesOfTvdbIdEndpoint extends AbstractTvdbRouteIdEndpoint
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
        $this->tvdb->getEpisodes($id);
        $response->setResponse($this->tvdb->getContent());
    }
}