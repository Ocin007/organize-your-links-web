<?php


namespace OrganizeYourLinks\Filter;


interface FilterInterface
{
    public function filter(array $content): array;

    public function getCondition(): string;
}