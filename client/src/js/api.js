
import Vue from 'vue'
export {app} from './index'

const routes = {

    // Auth
    auth: [{
        name: 'auth',
        // params: ['login', 'pass'],
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

Vue.prototype.$api = ((cnf=[]) => {

    const {
        localStorage,
        fetch,
    } = window

    const genApi = c => {
        return function(data={}) {
            if (c.params) {
                data = {}
                let counter = 0
                for (let i of c.params) {
                    data[i] = arguments[counter]
                    counter++
                }
            }

            if (localStorage.token && !c.noToken) {
                data.token = localStorage.token
            }
            
            const headers = Object.assign({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-requested-with': 'XMLHttpRequest',
            }, c.headers || {})
            
            if (c.defContentType) {
                delete headers['Content-Type']
            }
            
            return fetch(typeof c.url === 'function'? c.url(): c.url, {
                method: c.method || 'POST',
                headers,
                // credentials: 'same-origin',
                body: c.noJSON? data: JSON.stringify(data),
            })
                .then(r => r.json())
                .then(r => {
                    if (r.success) {
                        return r.data
                    }
                    console.error(`throw Error! ${r.mess}`)
                    return Promise.reject(r)
                })
                .catch(err => {
                    const mess = err.mess? err.mess: err
                    ((app && app.noti) || console.error)(mess.toString? mess.toString(): mess)
                    /* throw new Error(`API: Error`, mess)*/
                    return Promise.reject(err)
                })
        }
    }

    return cnf.reduce((res, c) => {
        res[c.name] = genApi(c)
        return res
    }, {})
})(Object.keys(routes).reduce((res, item) => {
  res.push(...routes[item])
  return res
}, []))

export default Vue.prototype.$api
