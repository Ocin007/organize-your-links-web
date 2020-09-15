<?php


namespace OrganizeYourLinks\Api\Middleware\Group;


use OrganizeYourLinks\Api\Middleware\AbstractMiddleware;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\DataSource\Filesystem\FileManager;
use OrganizeYourLinks\DataSource\Filesystem\Reader;
use OrganizeYourLinks\DataSource\Filesystem\Writer;
use OrganizeYourLinks\Generator\FileNameGenerator;
use OrganizeYourLinks\Manager\SeriesManager;
use OrganizeYourLinks\Types\ErrorList;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;

class PrepareRequestWithSeriesMiddleware extends AbstractMiddleware
{
    protected function before(PsrRequest $psrRequest, RequestHandler $handler): PsrRequest
    {
        $request = new Request();
        $request
            ->setConvertedBody($psrRequest->getParsedBody()['data'])
            ->convert(new SeriesManager(new FileManager(new Reader(), new Writer(), new FileNameGenerator()), new ErrorList()));
        $psrRequest = $psrRequest->withAttribute(Request::class, $request);
        return $psrRequest;
    }

    protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): void
    {

    }
}