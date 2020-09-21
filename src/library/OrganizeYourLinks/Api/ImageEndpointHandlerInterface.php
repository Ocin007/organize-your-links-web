<?php


namespace OrganizeYourLinks\Api;


use OrganizeYourLinks\Api\Response\ResponseImage;
use OrganizeYourLinks\Types\ErrorListInterface;

interface ImageEndpointHandlerInterface
{
    public function __construct(Request $request, HelperFactoryInterface $factory);

    public function validateRequest(): ErrorListInterface;

    public function execute(ResponseImage $response): void;
}