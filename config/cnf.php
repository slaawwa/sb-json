<?php

$cnf = require('cnf_.php');

$_cnf = (object) [
    'salt' => $cnf->salt,
    'passHash' => null,
    'folder' => [
        'dist' => __DIR__ . '/../api/cmd-admin',
    ],
];

app::set('config', $_cnf);

$_cnf->passHash = app::passHash($cnf->pass);

app::set('config', $_cnf);

return $_cnf;
