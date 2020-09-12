<?php


namespace OrganizeYourLinks\Api\Middleware\App;


use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use OrganizeYourLinks\Api\Response;
use OrganizeYourLinks\Exceptions\ErrorList;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;

class CheckInstallationMiddleware extends AbstractMiddleware
{
    const DATA_DIR = __DIR__ . '/../../../../../../data';

    protected function before(PsrRequest $psrRequest, RequestHandler $handler): PsrRequest
    {
        $errorList = new ErrorList();
        $installation = [
            'composer_missing' => false,
            'data_dir_not_writable' => false,
            'key_file_missing' => false
        ];
        if(!is_writable(static::DATA_DIR)) {
            $errorList->add(ErrorList::DATA_DIR_NOT_WRITABLE);
            $installation['data_dir_not_writable'] = true;
            $this->allowExecOfNextHandler(false);
        }
        $response = $psrRequest->getAttribute(Response::class);
        $response->appendResponse($installation);
        $response->appendErrors($errorList);
        return $psrRequest;
    }

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): void
    {

    }
}