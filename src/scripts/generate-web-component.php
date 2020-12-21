<?php

const COMPONENTS_DIR = __DIR__ . '/../frontend/components';
const APP_MODULE = __DIR__ . '/../frontend/components/oyl-app/oyl-app.module.ts';
const COMPONENTS_TEMPLATE = __DIR__ . '/../frontend/templates/component.txt';
const STYLE_TEMPLATE = __DIR__ . '/../frontend/templates/style.txt';

function generateClassName(string $tagName): string
{
    $nameParts = explode('-', $tagName);
    $className = '';
    foreach ($nameParts as $namePart) {
        $className .= ucfirst($namePart);
    }
    return $className;
}

$tagName = readline('Enter tag name, e.g. "tag-name": ');
$path = readline('Enter path (path will be [path]/' . $tagName . '): ');

if ($path === false) {
    $path = '';
}
$pathUp = str_repeat('../', substr_count($path, '/'));
$path .= '/' . $tagName;
$componentDir = COMPONENTS_DIR . $path;
mkdir($componentDir, 0777, true);

$className = generateClassName($tagName);

$keys = ['{{tag-name}}', '{{ClassName}}', '{{path-up}}'];
$replaceWith = [$tagName, $className, $pathUp];

$generateFileFromTemplate = function (string $templateFile, string $destFile) use ($keys, $replaceWith): void {
    $template = file_get_contents($templateFile);
    $template = str_replace($keys, $replaceWith, $template);
    file_put_contents($destFile, $template);
};

file_put_contents($componentDir . '/' . $tagName . '.html', '');
$generateFileFromTemplate(STYLE_TEMPLATE, $componentDir . '/' . $tagName . '.scss');
$generateFileFromTemplate(COMPONENTS_TEMPLATE, $componentDir . '/' . $tagName . '.ts');

/*
$file = fopen(APP_MODULE, 'r');
$newContent = '';
$importAdded = false;
if ($file !== false) {
    while (($line = fgets($file)) !== false) {
        if (preg_match('/^(\s+)$/', $line) === 1 && !$importAdded) {
            $newContent .= 'import ' . $className . ' from ".' . $path . '/' . $tagName . '";' . PHP_EOL;
            $importAdded = true;
        }
        if (preg_match('/^];(\s*)$/', $line) === 1) {
            $newContent .= '    ' . $className . ',' . PHP_EOL;
        }
        $newContent .= $line;
    }
    fclose($file);
    file_put_contents(APP_MODULE, $newContent);
}
*/