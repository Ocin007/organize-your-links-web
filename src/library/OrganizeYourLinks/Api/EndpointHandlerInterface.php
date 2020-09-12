<?php


namespace OrganizeYourLinks\Api;


use OrganizeYourLinks\Types\ErrorListInterface;

interface EndpointHandlerInterface {

    public function __construct(Request $request, HelperFactory $factory);
    public function validateRequest(): ErrorListInterface;
    public function execute(Response $response): void;
}