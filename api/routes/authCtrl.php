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
        'handler' => function($body=null) {
    
            $success = $body && isset($body->token) && $body->token === $cnf->passHash;
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
