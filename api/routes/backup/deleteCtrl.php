<? return [
    '/api/backup/delete',
    function($body) {
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
];
