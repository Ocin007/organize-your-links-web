<?php


namespace OrganizeYourLinks\Filter;


interface FilterInterface
{
    public function filter(array &$content): void;
    public function getCondition(): string;
}