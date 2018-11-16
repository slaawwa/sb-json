<? return [
    '/api/backup/switch',
    function() {
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
];
