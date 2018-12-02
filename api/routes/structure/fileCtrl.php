<? return [
    '/api/file',
    function($body, $cnf, $user) {

        if (app::userCan($user, 'ADMIN')) {
            if ($body->file === 'README.md') {
                $body->file = '../../README.md';
            } else if ($body->file === 'USERS.json') {
                $body->file = '../../config/users.json';
            }
        }

        $data = [
            'file' => app::getFile($body->file),
        ];

        $success = $data['file'] === false? false: true;
        $mess = $success? '': 'Error!';

        return ['success' => $success, 'mess' => $mess, 'data' => $data];
    },
];
