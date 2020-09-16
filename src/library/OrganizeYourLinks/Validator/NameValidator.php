<?php

namespace OrganizeYourLinks\Validator;


use OrganizeYourLinks\Generator\GeneratorInterface ;
use OrganizeYourLinks\Reader;

class NameValidator implements ValidatorInterface {

    private Reader $reader;
    private GeneratorInterface $fileNameGenerator;
    private string $listDir;
    private array $dataListMap = [];
    private array $allNames = [];

    public function __construct(Reader $reader, GeneratorInterface $fileNameGenerator, string $listDir) {
        $this->reader = $reader;
        $this->fileNameGenerator = $fileNameGenerator;
        $this->listDir = $listDir;
    }

    function getDataListMap() : array {
        return $this->dataListMap;
    }

    function validate(array $dataList) : array {
        $this->collectAllNames();
        $errors = [];
        foreach ($dataList as $index => $data) {
            $subErrors = $this->checkElement($data);
            if(count($subErrors) !== 0) {
                $errors[$index] = $subErrors;
            }
        }
        return $errors;
    }

    private function checkElement(array $data) : array {
        $errors = [];
        $errors = array_merge($errors, $this->checkForDublicateName($data));
        $errors = array_merge($errors, $this->checkForAlreadyExistingFiles($data));
        if(count($errors) === 0) {
            $errors = array_merge($errors, $this->appendToDataListMap($data));
        }
        return $errors;
    }

    private function checkForDublicateName(array $data) : array {
        $errors = [];
        $localNames = [];
        $bool1 = $data['name_de'] === '' || !in_array($data['name_de'], $this->allNames);
        $bool2 = $data['name_en'] === '' || !in_array($data['name_en'], $this->allNames);
        $bool3 = $data['name_jpn'] === '' || !in_array($data['name_jpn'], $this->allNames);
        if(!$bool1) {
            if(!isset($errors['name-dublicate'])) {
                $errors = ['name-dublicate' => ['name_de' => $data['name_de']]];
            } else {
                $errors['name-dublicate']['name_de'] = $data['name_de'];
            }
        } else if ($data['name_de'] !== '' && !in_array($data['name_de'], $localNames)) {
            $localNames[] = $data['name_de'];
        }
        if(!$bool2) {
            if(!isset($errors['name-dublicate'])) {
                $errors = ['name-dublicate' => ['name_en' => $data['name_en']]];
            } else {
                $errors['name-dublicate']['name_en'] = $data['name_en'];
            }
        } else if ($data['name_en'] !== '' && !in_array($data['name_en'], $localNames)) {
            $localNames[] = $data['name_en'];
        }
        if(!$bool3) {
            if(!isset($errors['name-dublicate'])) {
                $errors = ['name-dublicate' => ['name_jpn' => $data['name_jpn']]];
            } else {
                $errors['name-dublicate']['name_jpn'] = $data['name_jpn'];
            }
        } else if ($data['name_jpn'] !== '' && !in_array($data['name_jpn'], $localNames)) {
            $localNames[] = $data['name_jpn'];
        }
        if(count($errors) === 0) {
            $this->allNames = array_merge($this->allNames, $localNames);
        }
        return $errors;
    }

    private function checkForAlreadyExistingFiles(array $data) : array {
        $errors = [];
        $generatedFile = $this->generateFileName($data);
        if($generatedFile === '' || file_exists($this->listDir.'/'.$generatedFile)) {
            $errors = ['name-file' => 'file '.$generatedFile.' already exists'];
        }
        return $errors;
    }

    private function generateFileName(array $data) : string {
        $generatedFile = '';
        if($data['name_de'] !== '') {
            $generatedFile = $this->fileNameGenerator->generate($data['name_de']);
        } else if($data['name_en'] !== '') {
            $generatedFile = $this->fileNameGenerator->generate($data['name_en']);
        } else if($data['name_jpn'] !== '') {
            $generatedFile = $this->fileNameGenerator->generate($data['name_jpn']);
        }
        return $generatedFile;
    }

    private function collectAllNames() : void {
        $this->allNames = [];
        $content = $this->reader->readDir($this->listDir);
        foreach($content as $index => $data) {
            $this->appendNamesOf($data);
        }
    }

    private function appendNamesOf(array $data) : void {
        if($data['name_de'] !== '' && !in_array($data['name_de'], $this->allNames)) {
            $this->allNames[] = $data['name_de'];
        }
        if($data['name_en'] !== '' && !in_array($data['name_en'], $this->allNames)) {
            $this->allNames[] = $data['name_en'];
        }
        if($data['name_jpn'] !== '' && !in_array($data['name_jpn'], $this->allNames)) {
            $this->allNames[] = $data['name_jpn'];
        }
    }

    private function appendToDataListMap(array $data) : array {
        $fileName = $this->generateFileName($data);
        if(isset($this->dataListMap[$fileName])) {
            return ['name-file' => 'file '.$fileName.' already exists'];
        }
        $this->dataListMap[$fileName] = $data;
        return [];
    }
}