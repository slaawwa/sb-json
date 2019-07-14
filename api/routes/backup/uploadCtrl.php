<? return [
    '/api/backup/upload',
    function() {
        $name = !empty($_FILES) && array_key_exists('file', $_FILES)
            ? $_FILES['file']['name']
            : null;
        $message = '';
        if($name) {
            $source = $_FILES['file']['tmp_name'];
            $type = $_FILES['file']['type'];

            $continue = strtolower($type) === 'application/zip';
            if($continue) {
                
                $file = 'cmd-admin--upload-'.date('Y-m-d__H_i').'.zip';
                
                if(!move_uploaded_file($source, BACKUP_ADMIN_DIR.$file)) {
                    $message = 'There was a problem with the upload. Please try again.';
                }/* else {    
                    $message = 'Your .zip file was uploaded and unpacked.';
                }*/
            } else {
                $message = 'The file you are trying to upload is not a .zip file. Please try again.';
            }
        }
        
        return [
            'success' => !$message,
            'data' => null,
            'mess' => $message,
        ];
    }, [
        'withGET' => true,
    ],
];
