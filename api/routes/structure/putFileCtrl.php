<? return [
    '/api/putFile',
    function($body, $cnf, $user) {

        $success = false;
        $mess = '';
        $data = null;

        if (app::userCan($user, 'ADMIN')) {
            if ($body->file === 'README.md') {
                $body->file = '../../README.md';
            } else if ($body->file === 'USERS.json') {
                $body->file = '../../config/users.json';
            }
        }

        $success = app::putFile($body->file, $body->content);

        app::log('Save file: `'.$body->file.'`');

        return ['success' => $success, 'mess' => $mess, 'data' => $data];
    },
];
