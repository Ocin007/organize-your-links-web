<?php


namespace OrganizeYourLinks\DataSource;


use OrganizeYourLinks\Exceptions\ErrorListInterface;

interface DataSourceInterface
{
    public function loadSettings(): ?array;
    public function saveSettings(array $settings): ErrorListInterface;
}