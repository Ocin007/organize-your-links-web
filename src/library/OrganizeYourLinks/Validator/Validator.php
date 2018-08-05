<?php

namespace OrganizeYourLinks\OrganizeYourLinks\Validator;


interface Validator
{
    function validate(array $dataList): array;
}