<?php


namespace OrganizeYourLinks\Api\Endpoint\Tvdb\Proxy\Image;


use OrganizeYourLinks\Api\ImageEndpointHandlerInterface;
use OrganizeYourLinks\Api\HelperFactoryInterface;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response\ResponseImage;
use OrganizeYourLinks\ExternalApi\TvdbApi;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;

class GetImageFileEndpoint implements ImageEndpointHandlerInterface
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
        return new ErrorList();
    }

    public function execute(ResponseImage $response): void
    {
        $file = $this->request->getRouteParam('tvdbUrl');
        $result = $this->tvdb->file_get_contents('https://www.thetvdb.com/banners/' . $file);
        if($result === false) {
            $response->setContents('');
        } else {
            $response->setContents($result);
        }
    }
}