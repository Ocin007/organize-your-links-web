<?php

use Slim\Factory\AppFactory;

require_once __DIR__ . '/../../vendor/autoload.php';

$app = AppFactory::create();

$middleware = require_once __DIR__ . '/app/middleware.php';
$middleware($app);

$baseUri = preg_replace('/src\/api(.*)/', 'src/api', $_SERVER['REQUEST_URI']);
$routes = require_once __DIR__ . '/app/routes.php';
$routes($app, $baseUri);

$app->run();