<?php


namespace OrganizeYourLinks\Api\Middleware;


use Psr\Http\Message\ServerRequestInterface as PsrRequest;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as PsrResponse;
use Slim\Psr7\Message as PsrMessage;

abstract class AbstractMiddleware implements MiddlewareInterface
{
    private bool $gotoNextHandler = true;

    public final function __invoke(PsrRequest $psrRequest, RequestHandler $handler): PsrResponse
    {
        $psrRequest = $this->before($psrRequest, $handler);
        if($this->gotoNextHandler) {
            $psrResponse = $handler->handle($psrRequest);
        } else {
            $psrResponse = new PsrResponse();
        }
        $psrResponse = $this->after($psrRequest, $psrResponse, $handler);
        return $psrResponse;
    }

    /**
     * Default value is true. The execution of the next handler is disabled on false.
     *
     * @param bool $boolean
     */
    protected function allowExecOfNextHandler(bool $boolean = true): void
    {
        $this->gotoNextHandler = $boolean;
    }

    /**
     * Returns true if the following handler was executed, false otherwise.
     *
     * @return bool
     */
    protected function nextHandlerWasExecuted(): bool
    {
        return $this->gotoNextHandler;
    }

    /**
     * This method is executed before the endpoint handler is executed.
     *
     * @param PsrRequest $psrRequest
     * @param RequestHandler $handler
     * @return PsrRequest
     */
    abstract protected function before(PsrRequest $psrRequest, RequestHandler $handler): PsrRequest;

    /**
     * This method is executed after the endpoint handler is executed.
     *
     * @param PsrRequest $psrRequest
     * @param PsrResponse $psrResponse
     * @param RequestHandler $handler
     * @return PsrResponse
     */
    abstract protected function after(PsrRequest $psrRequest, PsrResponse $psrResponse, RequestHandler $handler): PsrMessage;
}