<?php


namespace OrganizeYourLinks\Api;


use OrganizeYourLinks\Types\ErrorListInterface;

interface EndpointHandlerInterface
{
    public function __construct(Request $request, HelperFactoryInterface $factory);

    public function validateRequest(): ErrorListInterface;

    public function execute(Response $response): void;
}