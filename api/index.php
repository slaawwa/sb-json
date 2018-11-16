<?php

  require('app.php');

  $cnf = require('../config/cnf.php');

  $routes = require('routes/index.php');

  // PREPERE

    $method = strtoupper($_SERVER['REQUEST_METHOD']);
    
    $url = $_SERVER[isset($_SERVER['REDIRECT_URL'])
      ? 'REDIRECT_URL'
      : 'REQUEST_URI'
    ];

    if (strpos($url, '?')) {
      $url = explode('?', $url)[0];
    }

    $postData = App::getPost();

    $user = App::auth($cnf);

  // PREPERE

  $route = null;

  foreach ($routes as $_route) {
    if (!isset($_route['method'])) {
      $_route['method'] = isset($cnf->defaultApiMethod)
        ? $cnf->defaultApiMethod
        : 'POST';
    }
    $checkMethod = $_route['method'] === '*' || strtoupper($_route['method']) === $method;
    if (!isset($_route['withGET'])) {
      $checkUrl = $_route['path'] === $url;
    } else {
      $checkUrl = strpos($_SERVER['REQUEST_URI'], $_route['path']) === 0;
    }
    if ($checkMethod and $checkUrl) {
      if (!isset($_route['auth'])) {
        $_route['auth'] = isset($cnf->defaultApiAuth)
          ? $cnf->defaultApiAuth
          : false;
      }
      $checkAuth = (isset($_route['auth']) && $_route['auth'])
        ? $user
        : true;
      if ($checkAuth) {
        $route = $_route;
        break;
      }
    }
  }
  if ($route) {
    $data = $route['handler']($postData, $cnf);
  } else {
    $data = [
      'success' => false,
      'data' => null,
      'mess' => 'Not found #404',
    ];
  }

  echo App::response($data);
