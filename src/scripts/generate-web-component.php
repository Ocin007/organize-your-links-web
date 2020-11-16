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
$path = readline('Enter path (path will be [path]/' . $tagName . ')');
if ($path === false) {
    $path = '';
}
$pathUp = str_repeat('../', substr_count($path, '/'));
$path .= '/' . $tagName;
$className = generateClassName($tagName);

const COMPONENTS_DIR = __DIR__ . '/../frontend/components';
const COMPONENTS_TEMPLATE = __DIR__ . '/../frontend/templates/component.txt';

mkdir(COMPONENTS_DIR . $path, 0777, true);
$htmlContent = '';
file_put_contents(COMPONENTS_DIR . $path . '/' . $tagName . '.html', $htmlContent);
$scssContent = '';
file_put_contents(COMPONENTS_DIR . $path . '/' . $tagName . '.scss', $scssContent);
$componentTemplate = file_get_contents(COMPONENTS_TEMPLATE);
$componentTemplate = str_replace('{{tag-name}}', $tagName, $componentTemplate);
$componentTemplate = str_replace('{{ClassName}}', $className, $componentTemplate);
$componentTemplate = str_replace('{{path-up}}', $pathUp, $componentTemplate);
file_put_contents(COMPONENTS_DIR . $path . '/' . $tagName . '.ts', $componentTemplate);


const INDEX_TS = COMPONENTS_DIR . '/index.ts';

$file = fopen(INDEX_TS, 'r');
$newContent = '';
$importAdded = false;
if ($file !== false) {
    while (($line = fgets($file)) !== false) {
        if (preg_match('/^(\s+)$/', $line) === 1 && !$importAdded) {
            $newContent .= 'import ' . $className . ' from ".' . $path . '/' . $tagName . '";' . PHP_EOL;
            $importAdded = true;
        }
        if (preg_match('/^];(\s*)$/', $line) === 1) {
            $newContent .= '    '.$className.','.PHP_EOL;
        }
        $newContent .= $line;
    }
    fclose($file);
    file_put_contents(INDEX_TS, $newContent);
}