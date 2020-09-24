<?php

function generateClassName($tagName): string
{
    $nameParts = explode('-', $tagName);
    $className = '';
    foreach ($nameParts as $namePart) {
        $className .= ucfirst($namePart);
    }
    return $className;
}

$tagName = readline('Enter tag name, e.g. "tag-name": ');
$className = generateClassName($tagName);

const COMPONENTS_DIR = __DIR__ . '/../frontend/components';
const COMPONENTS_TEMPLATE = COMPONENTS_DIR . '/template.txt';

mkdir(COMPONENTS_DIR . '/' . $tagName);
$htmlContent = '';
file_put_contents(COMPONENTS_DIR . '/' . $tagName . '/' . $tagName . '.html', $htmlContent);
$scssContent = '';
file_put_contents(COMPONENTS_DIR . '/' . $tagName . '/' . $tagName . '.scss', $scssContent);
$tsContent = file_get_contents(COMPONENTS_TEMPLATE);
$tsContent = str_replace('[tag-name]', $tagName, $tsContent);
$tsContent = str_replace('[ClassName]', $className, $tsContent);
file_put_contents(COMPONENTS_DIR . '/' . $tagName . '/' . $tagName . '.ts', $tsContent);



const INDEX_TS = COMPONENTS_DIR . '/index.ts';

$file = fopen(INDEX_TS, 'r');
$newContent = '';
$importAdded = false;
$checkForCommaEnabled = false;
$addClassNameToArray = false;
if ($file !== false) {
    while (($line = fgets($file)) !== false) {
        if (preg_match('/^(\s+)$/', $line) === 1 && !$importAdded) {
            $newContent .= 'import ' . $className . ' from "./' . $tagName . '/' . $tagName . '";' . PHP_EOL;
            $importAdded = true;
        }
        if($addClassNameToArray) {
            $addClassNameToArray = false;
            $checkForCommaEnabled = false;
            $newContent .= '    '.$className.PHP_EOL;
        }
        if($checkForCommaEnabled && strpos($line, ',') === false) {
            $addClassNameToArray = true;
            $line = preg_replace('/'.PHP_EOL.'/', ','.PHP_EOL, $line);
        }
        if(preg_match('/^const Components(.*)/', $line) === 1) {
            $checkForCommaEnabled = true;
        }
        $newContent .= $line;
    }
    fclose($file);
    file_put_contents(INDEX_TS, $newContent);
}