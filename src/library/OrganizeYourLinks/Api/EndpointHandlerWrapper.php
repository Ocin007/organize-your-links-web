<?php

namespace OrganizeYourLinks\Api;

use Closure;
use Psr\Http\Message\ResponseInterface as PsrResponse;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;


class EndpointHandlerWrapper
{
    public static function getHandler(string $className): Closure
    {
        return function (PsrRequest $psrRequest, PsrResponse $psrResponse, $args) use ($className) {
            $response = $psrRequest->getAttribute(Response::class);
            $request = new Request($psrRequest->getParsedBody()['data']);
            $handler = new $className($request, new HelperFactory());
            $errorList = $handler->validateRequest();
            if (count($errorList) === 0) {
                $handler->execute($response);
            } else {
                $response->writeErrors($errorList);
            }
            return $psrResponse;
        };
    }
}