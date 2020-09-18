<?php


namespace OrganizeYourLinks\Sorter;


interface SorterInterface
{
    public function sort(array $content): array;

    public function getCondition(): string;
}