<?php


namespace OrganizeYourLinks\Api\Middleware\App;


use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use OrganizeYourLinks\Api\Response;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;

class CheckInstallationMiddleware extends AbstractMiddleware
{
    const DATA_DIR = __DIR__ . '/../../../../../../data';

    protected function before(PsrRequest $psrRequest, RequestHandler $handler): PsrRequest
    {
        $installation = [
            'composer_missing' => false,
            'data_dir_not_writable' => false,
            'key_file_missing' => false
        ];
        if(!is_writable(static::DATA_DIR)) {
            $installation['error'][] = 'data directory not writable';
            $installation['data_dir_not_writable'] = true;
            $this->allowExecOfNextHandler(false);
        }
        $response = $psrRequest->getAttribute(Response::class);
        $response->appendResponse($installation);
        return $psrRequest;
    }

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): void
    {

    }
}