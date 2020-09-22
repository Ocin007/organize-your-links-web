<?php


namespace OrganizeYourLinks\Api\Middleware\App;


use Exception;
use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\Api\Response\ResponseProvider;
use OrganizeYourLinks\Types\ErrorList;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;
use Slim\Psr7\Message as PsrMessage;

class CheckRequestMiddleware extends AbstractMiddleware
{
    protected function before(PsrRequest $psrRequest, RequestHandler $handler): PsrRequest
    {
        $errorList = new ErrorList();
        $body = $psrRequest->getBody()->getContents();
        if ($psrRequest->getMethod() !== 'GET') {
            if ($body === "") {
                $errorList->add(ErrorList::INVALID_REQUEST_NO_BODY);
            }
            try {
                $parsedBody = json_decode($body, true);
                if (gettype($parsedBody) !== 'array') {
                    $errorList->add(ErrorList::INVALID_REQUEST_BODY_NOT_CORRECT_JSON);
                }
            } catch (Exception $e) {
                $errorList->add(ErrorList::INVALID_REQUEST_CANNOT_DECODE_JSON);
            }
        }
        $this->allowExecOfNextHandler($errorList->isEmpty());
        /** @var ResponseProvider $provider */
        $provider = $psrRequest->getAttribute('response');
        /** @var ResponseJson $response */
        $response = $provider->getResponse();
        $response->appendErrors($errorList);
        return $psrRequest;
    }

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): PsrMessage
    {
        return $psrResponse;
    }
}