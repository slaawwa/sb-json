
import Vue from 'vue'

import api from './api'

const app = new Vue({
    $app: null,
    data: {
        mess: '',
    },
    watch: {
        mess(mess) {
            this.$children[0].mess = mess
        },
    },
    computed: {
        isAdmin() {
            return this.$children[0].isAdmin
        },
    },
    mounted() {
        app.$options.$app = app
    },
})

export {
    app,
    api,
}
