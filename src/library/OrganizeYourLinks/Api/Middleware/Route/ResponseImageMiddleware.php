<?php


namespace OrganizeYourLinks\Api\Middleware\Route;


use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use OrganizeYourLinks\Api\Response\ResponseImage;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\Api\Response\ResponseProvider;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Message as PsrMessage;
use Slim\Psr7\Response as PsrResponse;

class ResponseImageMiddleware extends AbstractMiddleware
{
    protected function before(PsrRequest $psrRequest, RequestHandler $handler): PsrRequest
    {
        /** @var ResponseProvider $provider */
        $provider = $psrRequest->getAttribute('response');
        /** @var ResponseJson $responseJson */
        $responseJson = $provider->getResponse();
        $responseImage = new ResponseImage($responseJson->getErrorList());
        $provider->setResponse($responseImage);
        return $psrRequest;
    }

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): PsrMessage
    {
        return $psrResponse;
    }
}