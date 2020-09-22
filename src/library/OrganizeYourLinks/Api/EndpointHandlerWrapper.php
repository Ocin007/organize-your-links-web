<?php

namespace OrganizeYourLinks\Api;


use Closure;
use OrganizeYourLinks\Api\Response\ResponseProvider;
use Psr\Http\Message\ResponseInterface as PsrResponse;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;

class EndpointHandlerWrapper
{
    public static function getHandler(string $className): Closure
    {
        return function (PsrRequest $psrRequest, PsrResponse $psrResponse, $args) use ($className) {
            /** @var ResponseProvider $provider */
            $provider = $psrRequest->getAttribute('response');
            $response = $provider->getResponse();

            /** @var Request $request */
            $request = $psrRequest->getAttribute('request', new Request());

            if ($psrRequest->getMethod() !== 'GET') {
                $request->setRawBody($psrRequest->getBody()->getContents());
            }
            $request->setRouteParams($args);
            $request->setBaseUri((string)$psrRequest->getUri());
            $handler = new $className($request, new HelperFactory());
            $errorList = $handler->validateRequest();
            if ($errorList->isEmpty()) {
                $handler->execute($response);
            } else {
                $response->addToErrorList($errorList);
            }
            return $psrResponse;
        };
    }
}