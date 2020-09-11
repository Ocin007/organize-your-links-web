<?php


namespace OrganizeYourLinks\DataSource\Filesystem;


interface FileReaderInterface
{
    public function readFile(string $filePath): ?string;
}