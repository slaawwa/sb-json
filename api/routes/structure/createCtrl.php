<? return [
    '/api/createFolder',
    function($body) {

        $mess = '';
        $data = null;
        
        $success = app::createFolder($body->folder);
        
        app::log('Create folder: `'.$body->folder.'`');

        return ['success' => $success, 'mess' => $mess, 'data' => $data];
    }
];
