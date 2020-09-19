<?php


namespace OrganizeYourLinks\Types;


abstract class AbstractObject implements ObjectInterface
{
    public function get(string $key)
    {
        if (in_array($key, $this->getKeys())) {
            return $this->$key;
        }
        return null;
    }

    public function set(string $key, $value): void
    {
        if (in_array($key, $this->getKeys())) {
            $this->$key = $value;
        }
    }

    public function getAll(): array
    {
        $result = [];
        $keyList = $this->getKeys();
        foreach ($keyList as $key) {
            $result[$key] = $this->$key;
        }
        return $result;
    }

    public function setAll(array $data): self
    {
        $keyList = $this->getKeys();
        foreach ($keyList as $key) {
            if (isset($data[$key])) {
                $this->$key = $data[$key];
            }
        }
        return $this;
    }

    abstract public function getKeys(): array;
}