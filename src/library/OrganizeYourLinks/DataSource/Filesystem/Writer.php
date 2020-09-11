<?php


namespace OrganizeYourLinks\DataSource\Filesystem;


use Exception;

class Writer implements FileWriterInterface
{

    public function writeFile(string $filePath, string $content): bool
    {
        try {
            if(file_exists($filePath) && !is_writable($filePath)) {
                return false;
            }
            $success = file_put_contents($filePath, $content);
            return $success !== false;
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteFile(string $filePath): bool
    {
        try {
            return unlink($filePath);
        } catch (Exception $e) {
            return false;
        }
    }
}