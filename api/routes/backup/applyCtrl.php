<? return [
    '/api/backup/apply',
    function($body) {
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
            if (is_dir(CMD_ADMIN_DIR_TMP_NAME)) {
                app::delFolder( CMD_ADMIN_DIR_TMP_NAME, false );
            }

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
];
