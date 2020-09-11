<?php


namespace OrganizeYourLinks\Api;


interface EndpointHandlerInterface {

    public function __construct(Request $request, HelperFactory $factory);
    public function validateRequest(): array;
    public function execute(Response $response): void;
}