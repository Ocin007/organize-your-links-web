<?php


namespace OrganizeYourLinks\Api\Middleware\App;


use Exception;
use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use OrganizeYourLinks\Api\Response;
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
        $correctRequest = true;
        $body = $psrRequest->getBody()->getContents();
        if($psrRequest->getMethod() !== 'GET') {
            if($body === "") {
                $correctRequest = false;
                $errorList->add(ErrorList::INVALID_REQUEST_NO_BODY);
            }
            try {
                $parsedBody = json_decode($body, true);
                if(gettype($parsedBody) !== 'array') {
                    $correctRequest = false;
                    $errorList->add(ErrorList::INVALID_REQUEST_BODY_NOT_CORRECT_JSON);
                }
            } catch (Exception $e) {
                $correctRequest = false;
                $errorList->add(ErrorList::INVALID_REQUEST_CANNOT_DECODE_JSON);
            }
        }
        $this->allowExecOfNextHandler($correctRequest);
        /** @var Response $response */
        $response = $psrRequest->getAttribute(Response::class);
        $response->appendErrors($errorList);
        return $psrRequest;
    }

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): PsrMessage
    {
        return $psrResponse;
    }
}