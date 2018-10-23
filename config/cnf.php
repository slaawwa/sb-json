<?php

$pass = require('cnf_.php');
$passHash = function($pass) {
    $hash = 0;
    if (strlen($pass) === 0) {
        return $hash;
    }
    for ($i = 0; $i < strlen($pass); $i++) {
        $chr = ord($pass[$i]);
        $hash  = (($hash << 5) - $hash) + $chr;
        $hash = $hash & 0xffffffff;
    }
    return $hash;
};

$passHash = $passHash($pass);

return (object) [
    'pass' => $pass,
    'passHash' => $passHash, 
    'folder' => [
        'dist' => __DIR__ . '/../api/cmd-admin',
    ],
];
