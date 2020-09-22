<?php


namespace OrganizeYourLinks\Api\Middleware\App;


use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\Api\Response\ResponseProvider;
use OrganizeYourLinks\Types\ErrorList;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;
use Slim\Psr7\Message as PsrMessage;

class CheckInstallationMiddleware extends AbstractMiddleware
{
    protected function before(PsrRequest $psrRequest, RequestHandler $handler): PsrRequest
    {
        $errorList = new ErrorList();
        $fileManager = $this->helperFactory->getFileManager();
        $installation = [
            'composer_missing' => false,
            'data_dir_not_writable' => false,
            'key_file_missing' => false
        ];
        if (!$fileManager->isDataDirectoryWritable()) {
            $errorList->add(ErrorList::DATA_DIR_NOT_WRITABLE);
            $installation['data_dir_not_writable'] = true;
            $this->allowExecOfNextHandler(false);
        }
        /** @var ResponseProvider $provider */
        $provider = $psrRequest->getAttribute('response');
        /** @var ResponseJson $response */
        $response = $provider->getResponse();
        $response->appendParameters($installation);
        $response->appendErrors($errorList);
        return $psrRequest;
    }

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): PsrMessage
    {
        return $psrResponse;
    }
}