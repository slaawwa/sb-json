<?

$options = [
    'auth' => false,
];

return [
    [
        '/api/auth',
        function($body, $cnf) {
            $passHash = app::checkPass($body->login);
            return [
                'success' => (boolean) $passHash,
                'data' => $passHash? ['token' => $passHash]: null,
            ];
        },
        $options,
    ], [
        '/api/token',
        function($body=null, $cnf) {
    
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
        $options,
    ]
];
