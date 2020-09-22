<?php


namespace OrganizeYourLinks\Api\Response;


use OrganizeYourLinks\Types\Converter\ConverterInterface;
use OrganizeYourLinks\Types\ErrorListInterface;

class ResponseImage implements ResponseInterface
{
    private ErrorListInterface $errorList;
    private string $content;

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
        if ($list instanceof ErrorListInterface) {
            $this->errorList->add($list);
            return true;
        }
        return false;
    }

    public function getContentType(): string
    {
        return 'image/jpeg';
    }

    public function setContents(string $content)
    {
        $this->content = $content;
    }

    public function getContents(?ConverterInterface $converter = null): string
    {
        return $this->content;
    }
}