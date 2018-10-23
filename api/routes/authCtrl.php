<?

return [
    [
        'path' => '/api/auth',
        'method' => 'POST',
        'handler' => function($body, $cnf) {
            return [
                "success" => true,
                "data" => ['token' => $cnf->passHash],
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
                'success' => true,
                'message' => $success? '': 'Bad token',
                'data' => $data,
            ];
    
        },
    ]
];
