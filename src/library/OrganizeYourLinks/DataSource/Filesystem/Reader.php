<?php


namespace OrganizeYourLinks\DataSource\Filesystem;


use Exception;

class Reader implements FileReaderInterface
{

    public function readFile(string $filePath): ?string
    {
        try {
            if(!is_readable($filePath)) {
                return null;
            }
            $content = file_get_contents($filePath);
            if($content === false) {
                return null;
            }
        } catch (Exception $e) {
            return null;
        }
        return $content;
    }
}