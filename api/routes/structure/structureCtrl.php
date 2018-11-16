<? return [
    '/api/structure',
    function() {
        $structure = app::scanDir('error', true);
        return [
            'success' => true,
            'data' => $structure,
        ];
    },
];
