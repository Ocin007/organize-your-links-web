<?php


namespace OrganizeYourLinks\Types;


interface ErrorListInterface
{
    public function getErrorList(): array;
    public function isEmpty(): bool;
    public function add($errorMsg): self;
}