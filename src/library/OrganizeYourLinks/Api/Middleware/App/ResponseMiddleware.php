<?php


namespace OrganizeYourLinks\Api\Middleware\App;


use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\Api\Response\ResponseProvider;
use OrganizeYourLinks\Types\ErrorList;
use Slim\Psr7\Response as PsrResponse;
use Slim\Psr7\Message as PsrMessage;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

class ResponseMiddleware extends AbstractMiddleware
{
    protected function before(PsrRequest $psrRequest, RequestHandler $handler): PsrRequest
    {
        $response = new ResponseJson(new ErrorList());
        $provider = ResponseProvider::instance();
        $provider->setResponse($response);
        return $psrRequest->withAttribute('response', $provider);
    }

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): PsrMessage
    {
        /** @var ResponseProvider $provider */
        $provider = $psrRequest->getAttribute('response');
        $response = $provider->getResponse();
        $psrResponse2 = $psrResponse->withHeader('Content-type', $response->getContentType());
        $psrResponse2->getBody()->write(
            $response->getContents(
                $this->helperFactory->getSeriesConverter()
            )
        );
        return $psrResponse2;
    }
}