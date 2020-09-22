<?php


namespace OrganizeYourLinks\Api\Middleware\Route;


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
        $request
            ->setConvertedBody($psrRequest->getBody()->getContents())
            ->convert($this->helperFactory->getSeriesConverter());
        return $psrRequest->withAttribute('request', $request);
    }

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): PsrMessage
    {
        return $psrResponse;
    }
}