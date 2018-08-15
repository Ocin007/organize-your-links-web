<?php

namespace OrganizeYourLinks\OrganizeYourLinks;


class Sorter {

    private $settings;
    private $keys = ['name_de', 'name_en', 'name_jpn'];

    function __construct($settings) {
        $this->settings = $settings;
    }

    public function sort(&$content) {
        usort($content, function ($a, $b) {
            $nameA = strtolower($this->getName($a));
            $nameB = strtolower($this->getName($b));
            return strcmp($nameA, $nameB);
        });
    }

    /**
     * @param $a
     * @return mixed
     * @throws \Exception
     */
    private function getName($a) {
        if($a[$this->settings['titleLanguage']] !== '') {
            return $a[$this->settings['titleLanguage']];
        }
        foreach ($this->keys as $index => $key) {
            if($a[$key] !== '') {
                return $a[$key];
            }
        }
        throw new \Exception('sorter, no name found');
    }
}