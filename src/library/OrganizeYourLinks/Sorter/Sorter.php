<?php

namespace OrganizeYourLinks\Sorter;


use Exception;
use OrganizeYourLinks\Manager\SettingsManager;

class Sorter implements SorterInterface
{
    private array $settings;
    private array $keys = ['name_de', 'name_en', 'name_jpn'];

    function __construct(array $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @param array $content
     * @throws Exception
     */
    public function sort(array &$content): void
    {
        usort($content, function ($a, $b) {
            $nameA = strtolower($this->getName($a));
            $nameB = strtolower($this->getName($b));
            return strcmp($nameA, $nameB);
        });
    }

    /**
     * @param $a
     * @return string
     * @throws Exception
     */
    private function getName(array $a): string
    {
        if ($a[$this->settings[SettingsManager::KEY_TITLE_LANGUAGE]] !== '') {
            return $a[$this->settings[SettingsManager::KEY_TITLE_LANGUAGE]];
        }
        foreach ($this->keys as $index => $key) {
            if ($a[$key] !== '') {
                return $a[$key];
            }
        }
        throw new Exception('sorter, no name found');
    }

    //not used atm
    public function getCondition(): string
    {
        return '';
    }
}