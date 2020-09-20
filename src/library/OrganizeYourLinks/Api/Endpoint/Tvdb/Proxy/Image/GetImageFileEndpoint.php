<?php


namespace OrganizeYourLinks\Api\Endpoint\Tvdb\Proxy\Image;


use OrganizeYourLinks\Api\EndpointHandlerInterface;
use OrganizeYourLinks\Api\HelperFactoryInterface;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;

class GetImageFileEndpoint implements EndpointHandlerInterface
{
    private Request $request;

    public function __construct(Request $request, HelperFactoryInterface $factory)
    {
        $this->request = $request;
    }

    public function validateRequest(): ErrorListInterface
    {
        return new ErrorList();
    }

    public function execute(Response $response): void
    {
        $response->setResponse([$this->request->getRouteParam('tvdbUrl')]);
    }
}