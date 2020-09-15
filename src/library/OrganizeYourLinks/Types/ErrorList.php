<?php


namespace OrganizeYourLinks\Types;


class ErrorList implements ErrorListInterface
{
    private array $errorList = [];
    private bool $isEmpty = true;

    public function getErrorList(): array
    {
        return $this->errorList;
    }

    public function isEmpty(): bool
    {
        return $this->isEmpty;
    }

    /**
     * @param string|string[]|ErrorList $errorMsg
     * @return $this
     */
    public function add($errorMsg): self
    {
        if($errorMsg instanceof ErrorList) {
            $this->errorList = array_merge($this->errorList, $errorMsg->getErrorList());
            $this->isEmpty &= $errorMsg->isEmpty();
        } elseif(gettype($errorMsg) === 'string' && $errorMsg !== '') {
            $this->errorList[] = $errorMsg;
            $this->isEmpty = false;
        } elseif(gettype($errorMsg) === 'array') {
            $this->errorList = array_merge($this->errorList, $errorMsg);
            $this->isEmpty &= count($errorMsg) === 0;
        }
        return $this;
    }
}