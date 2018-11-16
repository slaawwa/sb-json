<? return [
    '/api/createFolder',
    function($body) {

        $mess = '';
        $data = null;
        
        $success = App::createFolder($body->folder);
        
        App::log('Create folder: `'.$body->folder.'`');

        return ['success' => $success, 'mess' => $mess, 'data' => $data];
    }
];
