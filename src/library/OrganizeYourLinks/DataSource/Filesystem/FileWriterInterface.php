<?php


namespace OrganizeYourLinks\DataSource\Filesystem;


interface FileWriterInterface
{
    public function writeFile(string $filePath, string $content): bool;
    public function deleteFile(string $filePath): bool;
}