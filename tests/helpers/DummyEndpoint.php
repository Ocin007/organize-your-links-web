<?php

namespace OrganizeYourLinks\Api;


use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;

class DummyEndpoint implements EndpointHandlerInterface
{
    public function __construct(Request $request, HelperFactoryInterface $factory)
    {
    }

    public function validateRequest(): ErrorListInterface
    {
        return new ErrorList();
    }

    public function execute(Response $response): void
    {
    }
}