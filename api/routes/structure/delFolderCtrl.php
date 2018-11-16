<? return [
    '/api/delFolder',
    function($body) {

        $mess = '';
        $data = null;
        
        $success = App::delFolder($body->folder);

        App::log('Del folder: `'.$body->folder.'`');

        return ['success' => $success, 'mess' => $mess, 'data' => $data];
    }
];
