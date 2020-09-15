<?php


namespace OrganizeYourLinks\Api\Middleware\App;


use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use OrganizeYourLinks\Api\Response;
use OrganizeYourLinks\Types\ErrorList;
use Psr\Http\Message\ResponseInterface as PsrResponse;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

class ResponseMiddleware extends AbstractMiddleware
{
    protected function before(PsrRequest $psrRequest, RequestHandler $handler): PsrRequest
    {
        $response = new Response(new ErrorList());
        $psrRequest = $psrRequest->withAttribute(Response::class, $response);
        return $psrRequest;
    }

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): void
    {
        /** @var Response $response */
        $response = $psrRequest->getAttribute(Response::class);
        $psrResponse->getBody()->write($response->getJSON());
    }
}