<?php


namespace OrganizeYourLinks\Api;


use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\Types\ErrorListInterface;

interface JsonEndpointHandlerInterface
{
    public function __construct(Request $request, HelperFactoryInterface $factory);

    public function validateRequest(): ErrorListInterface;

    public function execute(ResponseJson $response): void;
}