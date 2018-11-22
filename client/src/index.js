
import Vue from 'vue'

import {
    api,
    app,
} from './js'

import App from './js/comp/App/index'

import './index.less'

app.$options.render = h => h( App )
app.$mount('#app')

if (isDev) {
    window.Vue = Vue
    window.app = app
}
