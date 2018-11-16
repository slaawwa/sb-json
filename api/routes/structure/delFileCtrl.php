<? return [
    '/api/delFile',
    function($body) {

        $mess = '';
        $data = null;

        $success = App::delFile($body->file);

        App::log('Del file: `'.$body->file.'`');

        return ['success' => $success, 'mess' => $mess, 'data' => $data];
    },
];
