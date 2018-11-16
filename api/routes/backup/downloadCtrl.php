<? return [
    'GET',
    '/api/backups/cmd-admin--',
    function() {
        $data = (object) [
            'file' => end(explode('/', $_SERVER['REQUEST_URI'])),
        ];
        $data->fName = BACKUP_ADMIN_DIR . $data->file;
        if (file_exists($data->fName)) {
            $data->file_exists = true;
            header('Content-disposition: attachment; filename='.$data->file);
            header('Content-type: application/zip');
            readfile($data->fName);
            die();
        } else {
            $data->file_exists = false;
        }
        return [
            'success' => false,
            'data' => $data->file,
            'mess' => 'File does not exist',
        ];
    }, [
        'withGET' => true,
        'auth' => false,
    ],
];
