<?php


namespace OrganizeYourLinks\Types;


interface ObjectInterface
{
    /**
     * @param string $key
     * @return mixed|null
     */
    public function get(string $key);

    /**
     * @param string $key
     * @param mixed $value
     */
    public function set(string $key, $value): void;

    public function getAll(): array;

    public function setAll(array $data): self;

    public function getKeys(): array;
}