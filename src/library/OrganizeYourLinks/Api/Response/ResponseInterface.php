<?php


namespace OrganizeYourLinks\Api\Response;


use OrganizeYourLinks\ErrorListContainerInterface;
use OrganizeYourLinks\Types\Converter\ConverterInterface;

interface ResponseInterface extends ErrorListContainerInterface
{
    public function getContents(?ConverterInterface $converter = null): string;

    public function getContentType(): string;
}