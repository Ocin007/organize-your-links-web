<?php


namespace OrganizeYourLinks\Api;


use OrganizeYourLinks\ErrorListContainerInterface;
use OrganizeYourLinks\Types\Converter\ConverterInterface;
use OrganizeYourLinks\Types\ErrorListInterface;
use OrganizeYourLinks\Types\SeriesInterface;

class Response implements ErrorListContainerInterface
{
    private array $parameters = [];
    private array $response = [];
    private ErrorListInterface $errorList;

    public function __construct(ErrorListInterface $errorList)
    {
        $this->errorList = $errorList;
    }

    public function noErrors(): bool
    {
        return $this->errorList->isEmpty();
    }

    public function getErrorList(): ErrorListInterface
    {
        return $this->errorList;
    }

    public function addToErrorList($list): bool
    {
        if($list instanceof ErrorListInterface) {
            $this->errorList->add($list);
            return true;
        }
        return false;
    }

    public function getParameters(): array
    {
        return $this->parameters;
    }

    public function setParameter(string $key, $value): void
    {
        $this->parameters[$key] = $value;
    }

    public function appendParameters(array $params)
    {
        $this->parameters = array_merge($this->parameters, $params);
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

    public function getJSON(ConverterInterface $converter)
    {
        $response = $this->parameters;
        $response['response'] = $this->response;
        $this->scanAndReplaceSeriesObj($response, $converter);
        if(!$this->errorList->isEmpty()) {
            $response['error'] = $this->errorList->getErrorList();
        }
        return json_encode($response, JSON_PRETTY_PRINT);
    }

    private function scanAndReplaceSeriesObj(array &$response, ConverterInterface $converter)
    {
        foreach ($response as $key => $value) {
            if($value instanceof SeriesInterface) {
                $response[$key] = $converter->convertToNative($value);
            } elseif(gettype($value) === 'array') {
                $this->scanAndReplaceSeriesObj($value, $converter);
                $response[$key] = $value;
            }
        }
    }
}