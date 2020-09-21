<?php


namespace OrganizeYourLinks\Api\Response;

/**
 * Implemented as singleton.
 * @package OrganizeYourLinks\Api\Response
 */
class ResponseProvider
{
    private static ?ResponseProvider $instance = null;

    private ?ResponseInterface $response = null;

    private function __construct()
    {
    }

    public static function instance(): ResponseProvider
    {
        if(self::$instance === null) {
            self::$instance = new ResponseProvider();
        }
        return self::$instance;
    }

    public function getResponse(): ?ResponseInterface
    {
        return $this->response;
    }

    public function setResponse(?ResponseInterface $response = null): void
    {
        $this->response = $response;
    }
}