<?

$authRoutes = require('authCtrl.php');
$structureRoutes = require('structureCtrl.php');

$errorFile = __DIR__.'/../cmd-admin/error.json';

$routes = array_merge(
    [
        [
            'path' => '/api/?cmd=admin-',
            'withGET' => true,
            'method' => '*',
            'handler' => function() use ($errorFile, $fn) {
                $file = App::scanDir(substr( $_GET['cmd'], 6 ));
                $ext = pathinfo($file)['extension'];
                if ($ext === 'php') {
                    $f = require($file);
                    $file = CMD_ADMIN_DIR . $f['default'];
                }
                $file_exist = file_exists($file);
                $data = file_get_contents($file_exist? $file: $errorFile);
                // $data = json_decode($data, true);
                return $data;
            }
        ]
    ],
    $authRoutes,
    $structureRoutes
);

return $routes;
