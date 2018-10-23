
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
            if (localStorage.token) {
                data.token = localStorage.token;
            }
            return fetch(c.url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-requested-with': 'XMLHttpRequest',
                },
                body: JSON.stringify(data),
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
    name: 'createFolder',
    params: ['folder'],
    url: '/api/createFolder',
}, {
    name: 'userGoaalCreate',
    url: '/api/?cmd=admin-user-goal-demo-create'
}])

export default api