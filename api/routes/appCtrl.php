<?

$errorFile = __DIR__.'/../cmd-admin/error.json';

return [
    'path' => '/api/?cmd=admin-',
    'withGET' => true,
    'method' => '*',
    'handler' => function($body, $cnf) use ($errorFile) {
        $file = App::scanDir(substr( $_GET['cmd'], 6 ));
        $ext = pathinfo($file)['extension'];
        if ($ext === 'php') {
            $f = require($file);
            $file = $cnf->folder['dist'] . '/' . $f['default'];
        }
        $file_exist = file_exists($file);
        $data = file_get_contents($file_exist? $file: $errorFile);
        // $data = json_decode($data, true);
        return $data;
    }
];
