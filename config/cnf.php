<?php

$cnf = require('cnf_.php');

$isDev = $_SERVER['HTTP_HOST'] === $cnf->testHost;
$isProd = !$isDev;

$userFile = __DIR__.'/users.json';
if (file_exists($userFile)) {
    $users = json_decode(file_get_contents($userFile), true);
} else {
    $users = [[
        'name' => 'Admin',
        'email' => 'admin@gmail.com',
        'status' => 9
    ]];
    file_put_contents($userFile, json_encode($users));
}

$_cnf = (object) [
    'salt' => $cnf->salt,
    'logUrl' => $isProd? $cnf->logProdUrl: $cnf->logDevUrl,
    'passHash' => null,
    'folder' => [
        'dist' => realpath(__DIR__ . '/../api/cmd-admin'),
    ],
    'isDev' => $isDev,
    'isProd' => $isProd,
    'users' => $users,
    'defaultApiMethod' => 'POST',
    'defaultApiAuth' => true,
];

if (class_exists('app')) {

    $_cnf->passHash = app::passHash($cnf->pass);
    
    app::set('config', $_cnf);
}

return $_cnf;
