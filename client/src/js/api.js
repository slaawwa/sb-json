
import apiPlugin from './api-plugin'

export {apiPlugin}

export default {

    // Auth
    auth: [{
        name: 'auth',
        url: '/api/auth'
    }, {
        name: 'checkToken',
        params: ['token'],
        url: '/api/token'
    }, {
        name: 'forgotPass',
        params: ['login'],
        url: '/api/forgotPass'
    }],

    // Structure
    structure: [{
        name: 'structure',
        url: '/api/structure'
    }, {
        name: 'getFile',
        params: ['file'],
        url: '/api/file',
    }, {
        name: 'putFile',
        params: ['file', 'content'],
        url: '/api/putFile',
    }, {
        name: 'delFile',
        params: ['file'],
        url: '/api/delFile',
    }, {
        name: 'delFolder',
        params: ['folder'],
        url: '/api/delFolder',
    }, {
        name: 'createFolder',
        params: ['folder'],
        url: '/api/createFolder',
    }],

    // Backup
    backup: [{
        name: 'uploadBackup',
        defContentType: true,
        noJSON: true,
        url: () => '/api/backup/upload?token=' + window.localStorage.token,
    }, {
        name: 'createBackup',
        url: '/api/backup/create'
    }, {
        name: 'refreshBackups',
        url: '/api/backup/refresh'
    }, {
        name: 'delBackup',
        params: ['file'],
        url: '/api/backup/delete'
    }, {
        name: 'applyBackup',
        params: ['file'],
        url: '/api/backup/apply'
    }, {
        name: 'switchBackup',
        url: '/api/backup/switch'
    }],
}
