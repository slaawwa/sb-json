<? return [
    '/api/file',
    function($body, $cnf, $user) {

        if ($body->file === 'README.md') {
            $body->file = '../../README.md';
        } else if ($body->file === 'USERS.json' && app::userCan($user, 'ADMIN')) {
            $body->file = '../../config/users.json';
        }

        $data = [
            'file' => app::getFile($body->file),
        ];

        $success = $data['file'] === false? false: true;
        $mess = $success? '': 'Error!';

        return ['success' => $success, 'mess' => $mess, 'data' => $data];
    },
];
