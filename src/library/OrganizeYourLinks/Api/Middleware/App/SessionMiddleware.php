<?php


namespace OrganizeYourLinks\Api\Middleware\App;


use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;
use Slim\Psr7\Message as PsrMessage;

class SessionMiddleware extends AbstractMiddleware
{
    protected function before(PsrRequest $psrRequest, RequestHandler $handler): PsrRequest
    {
        return $psrRequest;
    }

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): PsrMessage
    {
        return $psrResponse;
    }
}