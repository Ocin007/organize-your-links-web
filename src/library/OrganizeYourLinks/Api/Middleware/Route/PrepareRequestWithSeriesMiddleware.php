<?php


namespace OrganizeYourLinks\Api\Middleware\Route;


use OrganizeYourLinks\Api\HelperFactory;
use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use OrganizeYourLinks\Api\Request;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;
use Slim\Psr7\Message as PsrMessage;

class PrepareRequestWithSeriesMiddleware extends AbstractMiddleware
{
    protected function before(PsrRequest $psrRequest, RequestHandler $handler): PsrRequest
    {
        $request = new Request();
        $factory = new HelperFactory();
        $request
            ->setConvertedBody($psrRequest->getBody()->getContents())
            ->convert($factory->getSeriesConverter());
        $psrRequest = $psrRequest->withAttribute(Request::class, $request);
        return $psrRequest;
    }

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): PsrMessage
    {
        return $psrResponse;
    }
}