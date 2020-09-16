<?php

namespace OrganizeYourLinks\Validator;


class ListMapValidator implements ValidatorInterface {

    private int $mode;
    private array $map;

    public function __construct(int $mode, array $map) {
        $this->mode = $mode;
        $this->map = $map;
    }

    function validate(array $dataList) : array {
        switch ($this->mode) {
            case Mode::PUT: return $this->validatePut($dataList);
            case Mode::UPDATE: return $this->validateUpdate($dataList);
            case Mode::DELETE: return $this->validateDelete($dataList);
            default: return ['mode' => 'invalid'];
        }
    }

    private function validatePut(array $dataList) : array {
        $errors = [];
        foreach($dataList as $data) {
            if(!isset($this->map[$data['id']])) {
                if($errors === []) {
                    $errors['id'] = [$data['id']];
                } else {
                    $errors['id'][] = $data['id'];
                }
            }
        }
        return $errors;
    }

    private function validateDelete(array $dataList) : array {
        $errors = [];
        foreach($dataList as $data) {
            if(!isset($this->map[$data])) {
                if($errors === []) {
                    $errors['id'] = [$data];
                } else {
                    $errors['id'][] = $data;
                }
            }
        }
        return $errors;
    }

    private function validateUpdate(array $dataList) : array {
        $errors = [];
        if($dataList['initialDataId'] === '') {
            return [];
        }
        if(!isset($this->map[$dataList['initialDataId']])) {
            $errors['id'] = 'unknown initialDataId';
        }
        return $errors;
    }
}