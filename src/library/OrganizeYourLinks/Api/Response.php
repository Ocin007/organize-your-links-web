<?php


namespace OrganizeYourLinks\Api;


class Response
{
    private array $response = [];

    public function getResponse(): array
    {
        return $this->response;
    }

    public function setResponse(array $response): void
    {
        $this->response = $response;
    }

    public function appendResponse(array $response): void
    {
        $this->response = array_merge($this->response, $response);
    }

    public function getJSON()
    {
        return json_encode($this->response, JSON_PRETTY_PRINT);
    }
}