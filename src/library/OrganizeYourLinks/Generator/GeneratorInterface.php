<?php


namespace OrganizeYourLinks\Generator;


interface GeneratorInterface
{
    public function generate(string $input): string;
}