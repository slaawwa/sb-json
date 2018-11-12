<?php

$cnf = require('cnf_.php');

$isDev = $_SERVER['HTTP_HOST'] === $cnf->testHost;
$isProd = !$isDev;

$_cnf = (object) [
    'salt' => $cnf->salt,
    'logUrl' => $isProd? $cnf->logProdUrl: $cnf->logDevUrl,
    'passHash' => null,
    'folder' => [
        'dist' => realpath(__DIR__ . '/../api/cmd-admin'),
    ],
    'isDev' => $isDev,
    'isProd' => $isProd,
];

if (class_exists(app)) {

    $_cnf->passHash = app::passHash($cnf->pass);
    
    app::set('config', $_cnf);
}

return $_cnf;
