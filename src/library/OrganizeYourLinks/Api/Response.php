<?php


namespace OrganizeYourLinks\Api;


use OrganizeYourLinks\ErrorListContainerInterface;
use OrganizeYourLinks\Exceptions\ErrorList;
use OrganizeYourLinks\Exceptions\ErrorListInterface;

class Response implements ErrorListContainerInterface
{
    private array $response = [];
    private ErrorListInterface $errorList;

    public function __construct()
    {
        $this->errorList = new ErrorList();
    }

    public function noErrors(): bool
    {
        return $this->errorList->isEmpty();
    }

    public function getErrorList(): ErrorListInterface
    {
        return $this->errorList;
    }

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

    public function appendErrors(ErrorListInterface $errorList): void
    {
        $this->errorList->add($errorList);
    }

    public function getJSON()
    {
        $response = [
            'response' => $this->response
        ];
        if(!$this->errorList->isEmpty()) {
            $response['error'] = $this->errorList->getErrorList();
        }
        return json_encode($response, JSON_PRETTY_PRINT);
    }
}