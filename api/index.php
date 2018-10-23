<?php

  $cnf = require('../config/cnf.php');
  require('app.php');
  
  $routes = require('routes/index.php');
  
  
  // PREPERE
  
    $method = $_SERVER['REQUEST_METHOD'];
    
    $url = $_SERVER[isset($_SERVER['REDIRECT_URL'])
      ? 'REDIRECT_URL'
      : 'REQUEST_URI'];
    
    if (strpos($url, '?')) {
      $url = explode('?', $url)[0];
    }
    
    $postData = App::getPost();
  
    $user = App::auth($cnf);
  
  // PREPERE
  
  $route = null;
  
  foreach ($routes as $_route) {
    $thisMethod = $_route['method'] === '*' || $_route['method'] === $method;
    if (!isset($_route['withGET'])) {
      $thisUrl = $_route['path'] === $url;
    } else {
      $thisUrl = strpos($_SERVER['REQUEST_URI'], $_route['path']) === 0;
    }
    if ($thisMethod and $thisUrl) {
      $thisAuth = (isset($_route['auth']) && $_route['auth'])
        ? $user
        : true;
      if ($thisAuth) {
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
  