<?php

return [
    [
        'path' => '/api/backup/create',
        'method' => 'POST',
        'method' => '*',
        'auth' => true,
        'handler' => function() {
            $zip = new ZipArchive();
            $filename = 'cmd-admin--backup-'.date('Y-m-d__H_i').'.zip';
            $folder4zip = BACKUP_ADMIN_DIR.$filename;
            
            if ($zip->open($folder4zip, ZipArchive::CREATE) !== true) {
                return [
                    'success' => false,
                    'data' => $filename,
                    'mess' => "Невозможно открыть <$filename>\n",
                ];
            }
            
            $rootPath = $cnf->folder['dist'];
            
            $files = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($rootPath),
                RecursiveIteratorIterator::LEAVES_ONLY
            );
            
            foreach ($files as $name => $file)
            {
                // Skip directories (they would be added automatically)
                if (!$file->isDir())
                {
                    // Get real and relative path for current file
                    $filePath = $file->getRealPath();
                    $relativePath = substr($filePath, strlen($rootPath) + 1);
            
                    // Add current file to archive
                    $zip->addFile($filePath, $relativePath);
                }
            }
            
            $zip->close();
            
            return [
                'success' => true,
                'data' => $filename,
            ];
        },
    ], [
        'path' => '/api/backup/upload',
        'method' => 'POST',
        'auth' => true,
        'withGET' => true,
        'handler' => function() {
            
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
        },
    ], [
        'path' => '/api/backup/refresh',
        'method' => 'POST',
        'auth' => true,
        'handler' => function($body, $cnf) {
            $structure = app::listFolders(BACKUP_ADMIN_DIR);
            return [
                'success' => true,
                'data' => $structure,
            ];
        },
    ], [
        'path' => '/api/backups/cmd-admin--',
        'method' => 'GET',
        'withGET' => true,
        'handler' => function() {
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
        },
    ], [
        'path' => '/api/backup/delete',
        'method' => 'POST',
        'auth' => true,
        'handler' => function($body) {
            $fName = BACKUP_ADMIN_DIR.$body->file;
            if (file_exists($fName)) {
                unlink($fName);
                return [
                    'success' => true,
                ];
            } else {
                return [
                    'success' => false,
                    'data' => $fName,
                    'mess' => 'File does not exist'
                ];
            }
        },
    ], [
        'path' => '/api/backup/apply',
        'method' => 'POST',
        'auth' => true,
        'handler' => function($body) {
            if (file_exists(BACKUP_ADMIN_DIR.$body->file)) {
                // 1. Extract file => cmd_admin
                
                $targetzip = BACKUP_ADMIN_DIR . $body->file;
            
                if (is_dir(CMD_ADMIN_DIR_TMP)) {
                    app::delFolder( CMD_ADMIN_DIR_TMP, false );
                }
              
                if (!is_dir(CMD_ADMIN_DIR_TMP)) {
                    mkdir(CMD_ADMIN_DIR_TMP, 0777);
                }

                $zip = new ZipArchive();
                $x = $zip->open($targetzip);
                if ($x === true) {
                    $zip->extractTo(CMD_ADMIN_DIR_TMP);
                    $zip->close();
                }
                
                // 2. Rename cmd-admin => cmd-admin-tmp
                rename(CMD_ADMIN_DIR, CMD_ADMIN_DIR_TMP_NAME);
                
                // 3. Delete cmd-admin
                if (is_dir(CMD_ADMIN_DIR)) {
                    app::delFolder( CMD_ADMIN_DIR, false );
                }
                
                // 4. Rename cmd_admin => cmd-admin
                rename(CMD_ADMIN_DIR_TMP, CMD_ADMIN_DIR);
                
                $success = true;
            } else {
                $success = false;
            }
            return [
                'success' => $success,
                'data' => $body->file,
                'mess' => $success? '': 'File does not exist',
            ];
        },
    ], [
        'path' => '/api/backup/switch',
        'method' => 'POST',
        'auth' => true,
        'handler' => function() {
            if (is_dir(CMD_ADMIN_DIR_TMP_NAME)) {
                
                // 1. cmd-admin -> cmd_admin
                rename(CMD_ADMIN_DIR, CMD_ADMIN_DIR_TMP);
                // 2. cmd-admin-tmp -> cmd-admin
                rename(CMD_ADMIN_DIR_TMP_NAME, CMD_ADMIN_DIR);
                // 3. cmd_admin -> cmd-admin-tmp
                rename(CMD_ADMIN_DIR_TMP, CMD_ADMIN_DIR_TMP_NAME);
                
                $success = true;
                $mess = 'Done!';
            } else {
                $success = false;
                $mess = 'TMP dir not exist';
            }
            return [
                'success' => $success,
                'mess' => $mess,
            ];
        }
    ],
];
