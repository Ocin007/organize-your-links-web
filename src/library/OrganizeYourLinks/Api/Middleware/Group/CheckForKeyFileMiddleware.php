<?php


namespace OrganizeYourLinks\Api\Middleware\Group;


use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use OrganizeYourLinks\Api\Response;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;

class CheckForKeyFileMiddleware extends AbstractMiddleware
{
    const KEY_FILE = __DIR__ . '/../../../../../../data/apikey.json';

    protected function before(PsrRequest $psrRequest, RequestHandler $handler): PsrRequest
    {
        if(!file_exists(static::KEY_FILE)) {
            $response = $psrRequest->getAttribute(Response::class);
            $response->appendResponse([
                'key_file_missing' => true
            ]);
            $this->allowExecOfNextHandler(false);
        }
        return $psrRequest;
    }

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): void
    {

    }
}