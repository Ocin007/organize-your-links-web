<?php


namespace OrganizeYourLinks\Api\Middleware\Route;


use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Message as PsrMessage;
use Slim\Psr7\Response as PsrResponse;

class SetImageHeaderMiddleware extends AbstractMiddleware
{
    protected function before(PsrRequest $psrRequest, RequestHandler $handler): PsrRequest
    {
        return $psrRequest;
    }

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): PsrMessage
    {
        return $psrResponse->withHeader('Content-type', 'image/jpeg');
    }
}