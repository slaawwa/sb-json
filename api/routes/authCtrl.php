<?

$options = [
    'auth' => false,
];

return [
    [
        '/api/auth',
        function($body, $cnf) {

            $users = $cnf->users;

            $key = array_search($body->login, array_column($users, 'email'));
            $res = [
                'success' => false,
                'data' => null,
                'mess' => '',
            ];
            if ($key === false || $users[$key]['status'] < 1) {
                $res['mess'] = 'Not found';
            } else {
                $user = &$users[$key];
                if (isset($user['hash'])) {
                    $hash = $user['hash'];
                } else {
                    if (!empty($body->confirm)) {
                        // Create hash
                        $hash = app::createHash($body);
                        // Save hash
                        $user['hash'] = $hash;
                        $content = json_encode($users);
                        app::putFile('../../config/users.json', $content);
                    } else {
                        // Need confirm pass
                        $res['data'] = 900;
                        $res['mess'] = 'Need confirm password';
                    }
                }
                // Try login
                if (isset($hash) && (string) $hash === (string) app::createHash($body)) {
                    $res['success'] = true;
                    $res['data'] = $user;
                }
            }
            // Send response
            return $res;
        },
        $options,
    ], [
        '/api/token',
        function($body=null, $cnf) {

            $token = $body && isset($body->token) && (int) $body->token;
            $success = false;
            $data = null;

            if (!empty($token)) {
                $key = array_search($body->token, array_column($cnf->users, 'hash'));
                $success = $key !== false;
                $data = $cnf->users[$key];
            }

            return [
                'success' => $success,
                'message' => $success? '': 'Bad token',
                'data' => $data,
            ];
        },
        $options,
    ]
];
