<?

$routes = [];

foreach(glob(__DIR__ . '/{**/*,*}Ctrl.php', GLOB_BRACE) as $php) {
    $_routes = require($php);
    if (isset($_routes[0]) && gettype($_routes[0]) === 'string') {
        $_routes = [$_routes];
    }
    foreach($_routes as $key => &$route) {
        if (isset($route[0]) && gettype($route[0]) === 'string') {
            // Check extra options
            $last = count($route) - 1;
            $opt = gettype($route[$last]) === 'array'
                ? $route[$last]
                : [];

            $i = 0;
            if ($route[0][0] !== '/') {
                // This is method
                $opt['method'] = $route[$i];
                $i = 1;
            }
            $opt['path'] = $route[$i];
            $opt['handler'] = $route[$i + 1];
            $_routes[$key] = $opt;
        }
    }
    $routes = array_merge($routes, $_routes);
}

return $routes;
