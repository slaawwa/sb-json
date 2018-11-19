<? return [
    '/api/delFile',
    function($body) {

        $mess = '';
        $data = null;

        $success = app::delFile($body->file);

        app::log('Del file: `'.$body->file.'`');

        return ['success' => $success, 'mess' => $mess, 'data' => $data];
    },
];
