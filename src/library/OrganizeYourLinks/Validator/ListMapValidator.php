<?php

namespace OrganizeYourLinks\Validator;


use OrganizeYourLinks\OrganizeYourLinks\Validator\Validator;

class ListMapValidator implements Validator {

    private $mode;
    private $map;

    public function __construct(int $mode, array $map) {
        $this->mode = $mode;
        $this->map = $map;
    }

    function validate(array $dataList): array {
        switch ($this->mode) {
            case Mode::PUT: return $this->validatePut($dataList);
            default: return ['mode' => 'invalid'];
        }
    }

    private function validatePut($dataList) {
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
}