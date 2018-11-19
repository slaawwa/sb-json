<? return [
    '/api/file',
    function($body) {

        if ($body->file === 'README.md') {
            $body->file = '../../README.md';
        }
        
        $data = [
            'file' => app::getFile($body->file),
        ];
        
        $success = $data['file'] === false? false: true;
        $mess = $success? '': 'Error!';

        return ['success' => $success, 'mess' => $mess, 'data' => $data];
    },
];
