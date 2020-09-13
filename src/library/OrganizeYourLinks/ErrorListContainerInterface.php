<?php


namespace OrganizeYourLinks;


use OrganizeYourLinks\Types\ErrorListInterface;

interface ErrorListContainerInterface
{
    public function noErrors(): bool;
    public function getErrorList(): ErrorListInterface;
    public function addToErrorList($list): bool;
}