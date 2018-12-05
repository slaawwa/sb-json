
export {app} from './index'

const ajaxPlugin = {
    install: (Vue, options={}) => {

        const {routes=[]} = options

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
    }
}

export default ajaxPlugin
