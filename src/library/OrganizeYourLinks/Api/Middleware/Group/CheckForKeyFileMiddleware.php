<?php


namespace OrganizeYourLinks\Api\Middleware\Group;


use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\Api\Response\ResponseProvider;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;
use Slim\Psr7\Message as PsrMessage;

class CheckForKeyFileMiddleware extends AbstractMiddleware
{
    protected function before(PsrRequest $psrRequest, RequestHandler $handler): PsrRequest
    {
        $fileManager = $this->helperFactory->getFileManager();
        if (!$fileManager->keyFileExist()) {
            /** @var ResponseProvider $provider */
            $provider = $psrRequest->getAttribute('response');
            /** @var ResponseJson $response */
            $response = $provider->getResponse();
            $response->setParameter('key_file_missing', true);
            $this->allowExecOfNextHandler(false);
        }
        return $psrRequest;
    }

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): PsrMessage
    {
        return $psrResponse;
    }
}