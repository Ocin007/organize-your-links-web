<?php

use Slim\Factory\AppFactory;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require_once __DIR__ . '/../../vendor/autoload.php';

$app = AppFactory::create();

$middleware = require_once __DIR__ . '/app/middleware.php';
$middleware($app);

$baseUri = preg_replace('/src\/api(.*)/', 'src/api', $_SERVER['REQUEST_URI']);
$app->group($baseUri, function ($app) {

    $app->get('/test', function (Request $request, Response $response, $args) {
        $response->getBody()->write("Hello world!");
//        json_decode($request->getParsedBody()['data'], true);
        return $response;
    });

});

$app->run();