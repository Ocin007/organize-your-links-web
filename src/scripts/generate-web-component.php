<?php

const COMPONENTS_DIR = __DIR__ . '/../frontend/components';
const INDEX_TS = __DIR__ . '/../frontend/components/index.ts';
const COMPONENTS_TEMPLATE = __DIR__ . '/../frontend/templates/component.txt';
const CONTROLLER_TEMPLATE = __DIR__ . '/../frontend/templates/controller.txt';
const ABSTRACT_COMPONENT_TEMPLATE = __DIR__ . '/../frontend/templates/abstractComponent.txt';
const ABSTRACT_CONTROLLER_COMPONENT_TEMPLATE = __DIR__ . '/../frontend/templates/abstractControllerComponent.txt';

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
$withController = readline('Generate with Controller? [y/n]: ');

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
file_put_contents($componentDir . '/' . $tagName . '.scss', '');
$generateFileFromTemplate(COMPONENTS_TEMPLATE, $componentDir . '/' . $tagName . '.ts');

if ($withController === 'y') {
    $generateFileFromTemplate(
        CONTROLLER_TEMPLATE,
        $componentDir . '/' . $className . 'Controller.ts'
    );
    $generateFileFromTemplate(
        ABSTRACT_CONTROLLER_COMPONENT_TEMPLATE,
        $componentDir . '/Abstract' . $className . '.ts'
    );
} else {
    $generateFileFromTemplate(
        ABSTRACT_COMPONENT_TEMPLATE,
        $componentDir . '/Abstract' . $className . '.ts'
    );
}


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