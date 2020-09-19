<?php


namespace OrganizeYourLinks\Types\Converter;


interface ConverterInterface
{
    public function convertToNative($object): array;

    public function convertToObject(array $native);
}