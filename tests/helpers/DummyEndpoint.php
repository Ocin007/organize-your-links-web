<?php

namespace OrganizeYourLinks\Api;


use Mockery;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;

class DummyEndpoint implements JsonEndpointHandlerInterface
{
    public static Request $request;
    public static HelperFactoryInterface $factory;
    /**
     * @var Mockery\LegacyMockInterface|Mockery\MockInterface|ErrorList
     */
    public static $errorMock;

    public function __construct(Request $request, HelperFactoryInterface $factory)
    {
        self::$request = $request;
        self::$factory = $factory;
    }

    public function validateRequest(): ErrorListInterface
    {
        return self::$errorMock;
    }

    public function execute(ResponseJson $response): void
    {
    }
}