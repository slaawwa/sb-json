
import Vue from 'vue'

import routes, {apiPlugin} from './api'
import router, {Router} from './router'
import './comp'

Vue.use(apiPlugin, {routes})

Vue.use(Router)

const app = new Vue({
    router,
    render: h => h({
        template: '<router-view id="app"/>',
    }),
    data: {
        page: null,
        mess: '',
        user: {},
        showBackup: false,
    },
    watch: {
        mess(mess) {
            if (mess && !mess.endsWith('...')) {
                setTimeout(() => this.mess='', 1500)
            }
        },
    },
    computed: {
        alertClass() {
            return {
                colorInfo: this.mess.endsWith('...'),
                colorDanger: this.mess.endsWith('!'),
                colorWarning: this.mess.endsWith(' '),
            }
        },
        isAdmin() {
            return this.user.status === 9
        },
    },
})

export {app}
export default app
