<?php

$cnf = require('cnf_.php');

$_cnf = (object) [
    'salt' => $cnf->salt,
    'logUrl' => $cnf->logUrl,
    'passHash' => null,
    'folder' => [
        'dist' => __DIR__ . '/../api/cmd-admin',
    ],
];

if (class_exists(app)) {

    $_cnf->passHash = app::passHash($cnf->pass);
    
    app::set('config', $_cnf);
}

return $_cnf;
