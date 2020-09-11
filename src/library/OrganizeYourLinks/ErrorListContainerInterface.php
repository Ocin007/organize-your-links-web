<?php


namespace OrganizeYourLinks;


use OrganizeYourLinks\Exceptions\ErrorListInterface;

interface ErrorListContainerInterface
{
    public function noErrors(): bool;
    public function getErrorList(): ErrorListInterface;
}