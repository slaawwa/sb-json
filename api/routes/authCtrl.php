<?

return [
    [
        'path' => '/api/auth',
        'method' => 'POST',
        'handler' => function($body, $cnf) {
            $passHash = app::checkPass($body->login);
            return [
                'success' => (boolean) $passHash,
                'data' => $passHash? ['token' => $passHash]: null,
            ];
        },
    ], [
        'path' => '/api/token',
        'method' => '*',
        'handler' => function($body=null, $cnf) {
    
            $success = $body && isset($body->token) && (int) $body->token === $cnf->passHash;
            $data = [
                'auth' => $success
            ];
    
            return [
                'success' => $success,
                'message' => $success? '': 'Bad token',
                'data' => $data,
            ];
    
        },
    ]
];
