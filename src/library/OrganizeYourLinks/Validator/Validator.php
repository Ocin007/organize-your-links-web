<?php

namespace OrganizeYourLinks\Validator;


interface Validator
{
    function validate(array $dataList) : array;
}