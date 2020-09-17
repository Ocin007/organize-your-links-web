<?php


namespace OrganizeYourLinks\Sorter;


interface SorterInterface
{
    public function sort(array &$content): void;

    public function getCondition(): string;
}