<?php


namespace OrganizeYourLinks\Api\Middleware\Route;


use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\Api\Response\ResponseProvider;
use OrganizeYourLinks\Types\ErrorList;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;
use Slim\Psr7\Message as PsrMessage;

class CheckIsValidSeriesMiddleware extends AbstractMiddleware
{
    protected function before(PsrRequest $psrRequest, RequestHandler $handler): PsrRequest
    {
        $validator = $this->helperFactory->getDataIsSeriesValidator();
        $json = $psrRequest->getBody()->getContents();
        $parsedData = json_decode($json, true);
        if (isset($parsedData[Request::KEY_SERIES_LIST])) {
            $errorList = $validator->validate($parsedData[Request::KEY_SERIES_LIST]);
        } else {
            $errorList = new ErrorList(ErrorList::NO_SERIES_IN_REQUEST);
        }
        if (!$errorList->isEmpty()) {
            $this->allowExecOfNextHandler(false);
            /** @var ResponseProvider $provider */
            $provider = $psrRequest->getAttribute('response');
            /** @var ResponseJson $response */
            $response = $provider->getResponse();
            $response->appendErrors($errorList);
        }
        return $psrRequest;
    }

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): PsrMessage
    {
        return $psrResponse;
    }
}