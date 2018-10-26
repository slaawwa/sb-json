<?

define('CMD_ADMIN_DIR', __DIR__.'/cmd-admin/');

class APP {
    
    static private $_phpInput;
    
    static private $_structure;
    static private $_structurePath = [];
    
    static public function getFile($file) {
        if (file_exists(CMD_ADMIN_DIR . $file)) {
            return file_get_contents(CMD_ADMIN_DIR . $file);
        }
        return false;
    }
    
    static public function createFolder($folder) {
        return mkdir(CMD_ADMIN_DIR . $folder);
    }
    
    static public function putFile($file, $content) {
        return file_put_contents(CMD_ADMIN_DIR . $file, $content) === false? false: true;
    }
    
    static public function delFile($file) {
        return (boolean) unlink(CMD_ADMIN_DIR . $file);
    }
    
    static public function delFolder($folder='', $isFirst=true) {
        if ($isFirst) {
            $folder = CMD_ADMIN_DIR . $folder;
        }
        $files = array_merge(
            glob("$folder/*", GLOB_ONLYDIR), // Folders
            glob("$folder/*.*") // Files
        );
        foreach ($files as $file) {
          if (is_dir($file)) {
              self::delFolder($file, false);
          } else {
            unlink($file);
          }
        }
        return rmdir($folder);
    }
    
    // static public function delFolder($folderName) {
    //     $folder = CMD_ADMIN_DIR . $folderName;
    //     array_map('unlink', glob("$folder/*.*"));
    //     return rmdir($folder);
    // }
    
    static private function listFolders2path($dh, $full='') {
        foreach ($dh as $folder => $folderFiles) {
            if ($folder != '.' && $folder != '..') {
                $f = $full . ($full? '/': '') . $folder;
                if (is_dir(CMD_ADMIN_DIR . $f)) {
                    self::listFolders2path($folderFiles, $f);
                } else {
                    $info = pathinfo($f);
                    $info = $info['dirname'] . '-' . $info['filename'];
                    self::$_structurePath[str_replace(['/', '.-'], ['-', ''], $info)] = CMD_ADMIN_DIR . $f;
                }
            }
        }

    }

    static private function listFolders($dir) {

        $dh = scandir($dir);
        $return = [];
        $files = [];

        foreach ($dh as $folder) {
            if ($folder != '.' && $folder != '..') {
                if (is_dir($dir . '/' . $folder)) {
                    $return[$folder] = self::listFolders($dir . '/' . $folder);
                } else {
                    $files[$folder] = false;
                }
            }
        }

        return array_merge($return, $files);
    }
    
    static public function scanDir($file, $getStructure=false) {
        if (!self::$_structurePath || self::$_structurePath[$file]) {
            self::$_structure = self::listFolders(CMD_ADMIN_DIR);
            self::listFolders2path(self::$_structure);
        }
        if (!isset(self::$_structurePath[$file])) {
            $file = 'error';
        }
        return $getStructure? self::$_structure: self::$_structurePath[$file];
    }
    
    static public function getPost($name=false) {
        $input = self::$_phpInput;
        if (!$input) {
            $inputJSON = file_get_contents('php://input');
            $input = json_decode($inputJSON);
            self::$_phpInput = $input;
        }
        return $name && gettype($input) === 'object'
            ? $input->$name
            : $input;
    }
    
    static public function response($data=['success'=>false, 'mess'=>'404 Not found', 'data'=>null]) {
        
      header('Content-Type: application/json');
      return gettype($data) === 'string'? $data: json_encode($data, JSON_FORCE_OBJECT);
    } 
    
    static public function auth($cnf) {
        $token = $_SERVER['REQUEST_METHOD'] === 'GET'
            ? (isset($_GET['token'])? $_GET['token']: null)
            : self::getPost('token');
        if ((string) $cnf->passHash === $token) {
            return true;
        } else {
            return false;
        }
    } 
};
