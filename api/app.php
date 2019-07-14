<?

define('CMD_ADMIN_DIR', __DIR__.'/cmd-admin/');
define('CMD_ADMIN_DIR_TMP_NAME', __DIR__.'/cmd-admin-tmp/');
define('CMD_ADMIN_DIR_TMP', __DIR__.'/cmd_admin/');
define('BACKUP_ADMIN_DIR', __DIR__.'/backups/');

class APP {
    
    static public $USER_STATUS = [
        'ADMIN' => 9,
        'ACTIVE' => 1,
        'BAN' => 0,
    ];

    static private $_phpInput;
    
    static private $_structure;
    static private $_structurePath = [];
    
    static private $_props = [];
    
    static public function set($propName, $value) {
        self::$_props[$propName] = $value;
    }
    
    static public function get($propName) {
        return array_key_exists($propName, self::$_props)
            ? self::$_props[$propName]
            : null;
    }

    static public function checkPass($pass) {
        $passHash = self::passHash($pass);
        $success = self::get('config')->passHash === $passHash;
        return $success? $passHash: null;
    }

    static public function createHash($user) {
        $login = strtolower($user->login);
        return self::passHash($login . $user->pass);
    }

    static public function userCan($user, $_status='ADMIN') {
        $status = isset(self::$USER_STATUS[$_status])
            ? self::$USER_STATUS[$_status]
            : false;
        $userStatus = $user && isset($user['status']) && $user['status'];
        return $status && $userStatus && $userStatus >= $status;
    }

    static public function passHash($pass) {
        
        $hash = 0;
        if (strlen($pass) === 0) {
            return $hash;
        }
        $cnf = self::get('config');
        $pass .= empty(self::get('config')) ? '' : $cnf->salt;
        for ($i = 0; $i < strlen($pass); $i++) {
            $chr = ord($pass[$i]);
            $hash  = (($hash << 5) - $hash) + $chr;
            $hash = $hash & 0xffffffff;
        }
        return $hash;
    }
    
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

    static public function listFolders($dir) {
        if (!file_exists($dir) && !is_dir($dir)) {
            mkdir($dir, 0777, true);
        }
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
            ? (property_exists($input, $name) ? $input->$name : '')
            : $input;
    }

    static public function response($data=['success'=>false, 'mess'=>'404 Not found', 'data'=>null]) {
        if(!headers_sent()) {
            header('Content-Type: application/json');
        }
        return gettype($data) === 'string'? $data: json_encode($data, JSON_FORCE_OBJECT);
    } 

    static public function auth($cnf) {
        $token = isset($_GET['token'])
            ? $_GET['token']
            : ($_SERVER['REQUEST_METHOD'] === 'POST'? self::getPost('token'): null);

        $key = array_search($token, array_column($cnf->users, 'hash'));

        if ($key !== false) {
            return $cnf->users[$key];
        } else {
            return false;
        }
    }
    
    static public function log($mess='') {

        $logUrl = self::get('config')->logUrl;

        if ($logUrl) {

            $user = self::get('authUser');

            $mess = ($user? '`'.$user['name']. '` => ': ''). $mess;

            $extra = htmlentities(urlencode($mess));
            
            file_get_contents($logUrl.$extra);
        }
        
    }
};

$cnf = require('../config/cnf.php');

app::set('config', $cnf);
