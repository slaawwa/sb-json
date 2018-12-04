import Vue from 'vue'

import Router from 'vue-router'

import pageLogin from './comp/pageLogin'
import pageAdmin from './comp/pageAdmin'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [{
        path: '/login',
        name: 'login',
        component: pageLogin,
        meta: {
            requiresAuth: false,
        },
    }, {
        path: '/',
        name: 'admin',
        component: pageAdmin,
        meta: {
            requiresAuth: true,
        },
    }, {
        path: '*',
        redirect: '/',
    }],
})

router.beforeEach((to, from, next) => {
    const needAuth = to.matched.some(route => route.meta.requiresAuth)
    if (needAuth && !localStorage.token) {
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        });
    } else {
        if (localStorage.token && to.path === '/login') {
            const nextPath = to.query.redirect || '/';
            next({path: nextPath})
        } else {
            next()
        }
    }
})

export default router
