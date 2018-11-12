
const api = ((cnf=[]) => {

    const genApi = (c) => {
        return function(data={}) {
            if (c.params) {
                data = {}
                let counter = 0
                for (let i of c.params) {
                    data[i] = arguments[counter];
                    counter++;
                }
            }
            
            if (localStorage.token && !c.noToken) {
                data.token = localStorage.token;
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
                    console.error(`throw Error! ${r.mess}`);
                    return Promise.reject(r.mess);
                })
                .catch(err => {
                    ((app && app.noti) || console.error)(err && err.toString && err.toString());
                    throw new Error(`API: Error`);
                });
        }
    }

    return cnf.reduce((res, c) => {
        res[c.name] = genApi(c);
        return res;
    }, {});
})([{
    name: 'auth',
    params: ['login'],
    url: '/api/auth'
}, {
    name: 'checkToken',
    params: ['token'],
    url: '/api/token'
}, {
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
}, {
    name: 'userGoaalCreate',
    url: '/api/?cmd=admin-user-goal-demo-create'
}, {
    name: 'uploadBackup',
    defContentType: true,
    noJSON: true,
    url: () => '/api/backup/upload?token=' + localStorage.token,
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
}])

export default api