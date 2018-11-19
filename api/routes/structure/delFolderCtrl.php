<? return [
    '/api/delFolder',
    function($body) {

        $mess = '';
        $data = null;
        
        $success = app::delFolder($body->folder);

        app::log('Del folder: `'.$body->folder.'`');

        return ['success' => $success, 'mess' => $mess, 'data' => $data];
    }
];
