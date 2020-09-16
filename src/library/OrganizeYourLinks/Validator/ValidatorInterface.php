<?php

namespace OrganizeYourLinks\Validator;


use OrganizeYourLinks\Types\ErrorListInterface;

interface ValidatorInterface
{
    function validate(array $dataList): ErrorListInterface;
}