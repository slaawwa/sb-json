<? return [
    '/api/putFile',
    function($body) {

        $success = false;
        $mess = '';
        $data = null;
        
        if ($body->file === 'README.md') {
            $body->file = '../../README.md';
        }

        $success = app::putFile($body->file, $body->content);
        
        app::log('Save file: `'.$body->file.'`');

        return ['success' => $success, 'mess' => $mess, 'data' => $data];
    },
];
