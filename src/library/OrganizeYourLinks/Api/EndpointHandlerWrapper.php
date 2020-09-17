<?php

namespace OrganizeYourLinks\Api;

use Closure;
use Psr\Http\Message\ResponseInterface as PsrResponse;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;


class EndpointHandlerWrapper
{
    public static function getHandler(string $className): Closure
    {
        return function (PsrRequest $psrRequest, PsrResponse $psrResponse, $args) use ($className)
        {
            /** @var Response $response */
            $response = $psrRequest->getAttribute(Response::class);

            /** @var Request $request */
            $request = $psrRequest->getAttribute(Request::class, new Request());

            if($psrRequest->getMethod() !== 'GET') {
                $request->setRawBody($psrRequest->getBody()->getContents());
            }
            $request->setRouteParams($args);
            $handler = new $className($request, new HelperFactory());
            $errorList = $handler->validateRequest();
            if ($errorList->isEmpty()) {
                $handler->execute($response);
            } else {
                $response->appendErrors($errorList);
            }
            return $psrResponse;
        };
    }
}