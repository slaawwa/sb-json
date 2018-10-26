<?

return [
    [
        'path' => '/api/structure',
        'method' => '*',
        'auth' => true,
        'handler' => function() {
            $structure = App::scanDir('error', true);
            return [
                "success" => true,
                "data" => $structure,
            ];
        },
    ], [
        'path' => '/api/file',
        'method' => 'POST',
        'auth' => true,
        'handler' => function($body) {
    
            if ($body->file === 'README.md') {
                $body->file = '../../README.md';
            }
            
            $data = [
                'file' => App::getFile($body->file),
            ];
            
            $success = $data['file'] === false? false: true;
            $mess = $success? '': 'Error!';
    
            return ['success' => $success, 'mess' => $mess, 'data' => $data];
        },
    ], [
        'path' => '/api/putFile',
        'method' => 'POST',
        'auth' => true,
        'handler' => function($body) {
    
            $success = false;
            $mess = '';
            $data = null;
            
            if ($body->file === 'README.md') {
                $body->file = '../../README.md';
            }

            $success = App::putFile($body->file, $body->content);
    
            return ['success' => $success, 'mess' => $mess, 'data' => $data];
        },
    ], [
        'path' => '/api/delFile',
        'method' => 'POST',
        'auth' => true,
        'handler' => function($body) {
    
            $mess = '';
            $data = null;
    
            $success = App::delFile($body->file);
    
            return ['success' => $success, 'mess' => $mess, 'data' => $data];
        },
    ], [
        'path' => '/api/createFolder',
        'method' => 'POST',
        'auth' => true,
        'handler' => function($body) {
    
            $mess = '';
            $data = null;
            
            $success = App::createFolder($body->folder);
    
            return ['success' => $success, 'mess' => $mess, 'data' => $data];
        }
    ], [
        'path' => '/api/delFolder',
        'method' => 'POST',
        'auth' => true,
        'handler' => function($body) {
    
            $mess = '';
            $data = null;
            
            $success = App::delFolder($body->folder);
    
            return ['success' => $success, 'mess' => $mess, 'data' => $data];
        }
    ],
];
