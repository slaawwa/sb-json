<? return [
    '/api/backup/upload',
    function() {
        
        if($_FILES['file']['name']) {
            $filename = $_FILES['file']['name'];
            $source = $_FILES['file']['tmp_name'];
            $type = $_FILES['file']['type'];

            $continue = strtolower($name[1]) == 'zip' ? true : false;
            if(!$continue) {
                $message = 'The file you are trying to upload is not a .zip file. Please try again.';
            }
            
            $file = 'cmd-admin--upload-'.date('Y-m-d__H_i').'.zip';
            
            if(move_uploaded_file($source, BACKUP_ADMIN_DIR.$file)) {
                $message = "Your .zip file was uploaded and unpacked.";
            } else {    
                $message = "There was a problem with the upload. Please try again.";
            }
        }
        
        return [
            'success' => true,
            'data' => null,
            'mess' => $message,
        ];
    }, [
        'withGET' => true,
    ],
];
