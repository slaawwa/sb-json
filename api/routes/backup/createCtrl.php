<? return [
    '/api/backup/create',
    function() {
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
        
        $rootPath = CMD_ADMIN_DIR;
        
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
];
