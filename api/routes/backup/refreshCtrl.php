<? return [
    '/api/backup/refresh',
    function($body, $cnf) {
        $structure = app::listFolders(BACKUP_ADMIN_DIR);
        return [
            'success' => true,
            'data' => $structure,
        ];
    },
];