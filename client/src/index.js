
import './index.less'

import app from './js'

app.$mount('#app')

if (isDev) {
    window.app = app
}
