<?php


namespace OrganizeYourLinks\Api\Middleware\App;


use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use OrganizeYourLinks\Api\Response;
use OrganizeYourLinks\DataSource\Filesystem\FileManager;
use OrganizeYourLinks\DataSource\Filesystem\Reader;
use OrganizeYourLinks\DataSource\Filesystem\Writer;
use OrganizeYourLinks\Generator\FileNameGenerator;
use OrganizeYourLinks\Types\ErrorList;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;

class CheckInstallationMiddleware extends AbstractMiddleware
{
    protected function before(PsrRequest $psrRequest, RequestHandler $handler): PsrRequest
    {
        $errorList = new ErrorList();
        $fileManager = new FileManager(new Reader(), new Writer(), new FileNameGenerator());
        $installation = [
            'composer_missing' => false,
            'data_dir_not_writable' => false,
            'key_file_missing' => false
        ];
        if(!$fileManager->isDataDirectoryWritable()) {
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