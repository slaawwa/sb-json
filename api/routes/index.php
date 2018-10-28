<?

$routes = [];

foreach(glob(__DIR__ . '/*Ctrl.php') as $php) {
	$route = require($php);
    if ($route && !empty($route['path'])) {
        $route = [$route];
    }
    $routes = array_merge($routes, $route);
}

return $routes;
