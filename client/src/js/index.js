
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
            this.$children[0].mess = mess
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
        isAdmin() {
            return this.$children[0].isAdmin
        },
    },
})

export {
    app,
    api,
}
