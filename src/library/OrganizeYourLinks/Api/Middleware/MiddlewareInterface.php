<?php


namespace OrganizeYourLinks\Api\Middleware;


use OrganizeYourLinks\Api\HelperFactoryInterface;
use Psr\Http\Message\ResponseInterface as PsrResponse;
use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

interface MiddlewareInterface
{
    public function __construct(?HelperFactoryInterface $helperFactory = null);

    public function __invoke(PsrRequest $psrRequest, RequestHandler $handler): PsrResponse;
}