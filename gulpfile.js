
var ggs = require('gulp-git-sftp'),
    cnf = require('./config/cnf'), // Look in help directory
    argv = require('yargs').argv,
    gulp = require('gulp'),
    CNF = ggs.cnf(cnf);
    
console.log('CNF:', CNF)
 
var FTP = ggs.ftp(CNF);
 
var conn = FTP.conn();
 
gulp.task('dep:files', function() {
    
    var files = argv.f;
        
    if (!files) return;
    
    files = FTP._file2format( files.split(',') );
    console.log(files)

    ggs.git({
        conn: conn,
        files: files,
        basePath: CNF.basePath,
        remotePath: CNF.remotePath,
    }, function(err) {
        if (err) console.log('ERRROR2:', err);
        console.log('Files from -f to FTP is deployed!!!')
        return true;
    });
});
 
gulp.task('dep:git', function() {
    ggs.git({
        conn: conn,
        basePath: CNF.basePath,
        remotePath: CNF.remotePath,
    }, function(err) {
        if (err) console.log('ERRROR2:', err);
        console.log('Files from git to FTP is deployed!!!')
        return true;
    });
});
 
gulp.task('deploy', function() {
       
    if (!argv.del) {
        return gulp.src( [
            `${CNF.basePath}/**/*`,
            '!node_modules{,/**}',
            '!bower{,/**}',
            '!bower_components{,/**}',
            '!cmd-admin{,/**}',
            '!cmd-admin-tmp{,/**}',
            '!backups{,/**}',
            '**/.htaccess',
        ], { base: CNF.basePath, buffer: false } )
            .pipe( conn.newer( CNF.remotePath || argv.remotePath ) ) // only upload newer files 
            .pipe( conn.dest( CNF.remotePath || argv.remotePath ) );
    } else {
        return conn.rmdir(CNF.remotePath, function(e) {
            console.log('deleted:', CNF.remotePath);
        });
    }
});
