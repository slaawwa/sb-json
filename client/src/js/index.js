
import Vue from 'vue'

import api from './api'
import router from './router'

const app = Vue.prototype.$app = new Vue({
    router,
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
        user(user) {
            this.$children[0].user = user
        },
        showBackup(showBackup) {
            const modalBackup = this.$children[0].$children[0].$children[1]
            modalBackup.showBackup = showBackup
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
            return this.$children[0].isAdmin
        },
    },
})

export {
    app,
    api,
}
