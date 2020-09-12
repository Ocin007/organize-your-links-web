<?php


namespace OrganizeYourLinks\DataSource;


use OrganizeYourLinks\Types\ErrorListInterface;

interface DataSourceInterface
{
    public function loadSettings(): ?array;
    public function saveSettings(array $settings): ErrorListInterface;
}