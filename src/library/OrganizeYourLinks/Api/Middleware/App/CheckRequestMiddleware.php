<?php


namespace OrganizeYourLinks\Api\Middleware\App;


use Exception;
use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use OrganizeYourLinks\Api\Response;
use OrganizeYourLinks\Types\ErrorList;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;

class CheckRequestMiddleware extends AbstractMiddleware
{
    protected function before(PsrRequest $psrRequest, RequestHandler $handler): PsrRequest
    {
        $body = $psrRequest->getParsedBody();
        $errorList = new ErrorList();
        $correctRequest = true;
        if($body === null) {
            $correctRequest = false;
            $errorList->add(ErrorList::INVALID_REQUEST_NO_BODY);
        } elseif(gettype($body) === 'object' || !isset($body['data'])) {
            $correctRequest = false;
            $errorList->add(ErrorList::INVALID_REQUEST_MALFORMED_BODY);
        }
        try {
            $json = json_decode($body['data'], true);
            if(gettype($json) !== 'array') {
                $correctRequest = false;
                $errorList->add(ErrorList::INVALID_REQUEST_BODY_NOT_CORRECT_JSON);
            }
        } catch (Exception $e) {
            $correctRequest = false;
            $errorList->add(ErrorList::INVALID_REQUEST_CANNOT_DECODE_JSON);
        }
        $this->allowExecOfNextHandler($correctRequest);
        /** @var Response $response */
        $response = $psrRequest->getAttribute(Response::class);
        $response->appendErrors($errorList);
        return $psrRequest;
    }

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): void
    {

    }
}