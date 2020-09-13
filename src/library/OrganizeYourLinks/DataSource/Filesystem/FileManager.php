<?php


namespace OrganizeYourLinks\DataSource\Filesystem;


class FileManager
{
    private const DATA_DIR = __DIR__ . '/../../../../../data';
    private const KEY_FILE = __DIR__ . '/../../../../../data/apikey.json';

    public function isDataDirectoryWritable(): bool
    {
        return is_writable(self::DATA_DIR);
    }

    public function keyFileExist(): bool
    {
        return file_exists(self::KEY_FILE);
    }
}