<?php


namespace OrganizeYourLinks\Api\Middleware\App;


use OrganizeYourLinks\Api\HelperFactory;
use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use OrganizeYourLinks\Api\Response;
use OrganizeYourLinks\Types\ErrorList;
use Slim\Psr7\Response as PsrResponse;
use Slim\Psr7\Message as PsrMessage;
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

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): PsrMessage
    {
        /** @var Response $response */
        $response = $psrRequest->getAttribute(Response::class);
        $factory = new HelperFactory();
        $psrResponse = $psrResponse->withHeader('Content-type', 'application/json');
        $psrResponse->getBody()->write($response->getJSON($factory->getSeriesConverter()));
        return $psrResponse;
    }
}