<?php


namespace OrganizeYourLinks\Api\Middleware\App;


use OrganizeYourLinks\Api\HelperFactory;
use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use OrganizeYourLinks\Api\Response;
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
        $factory = new HelperFactory();
        $fileManager = $factory->getFileManager();
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
        /** @var Response $response */
        $response = $psrRequest->getAttribute(Response::class);
        $response->appendParameters($installation);
        $response->appendErrors($errorList);
        return $psrRequest;
    }

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): PsrMessage
    {
        return $psrResponse;
    }
}