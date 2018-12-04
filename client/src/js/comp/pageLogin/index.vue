<template lang="pug">
    form.form-signin(
            @submit.prevent='send'
            autocomplete='off'
        )

        h2.form-signin-heading.text-info
            | Enter page

        div(v-if='showForm')
            label.sr-only(for='inputEmail')
                | Email address
            input#inputEmail.form-control(
                    type='email'
                    v-model='login'
                    placeholder='Email address'
                    required=''
                    autofocus=''
                )

            label.sr-only(for='inputPassword')
                | Password
            input#inputPassword.form-control(
                    type='password'
                    v-model='pass'
                    placeholder='Password'
                    required=''
                )

            button.btn.btn-lg.btn-primary.btn-block(type='submit')
                | Login

            button.btn.btn-link(
                    type='button'
                    v-if='showForgotBtn'
                    @click='forgotClick'
                )
                | Forgot password

        .text-danger {{ errorMess }}
</template>

<script>

const ERR_CONFIRM_PASS = 900;
const ERR_BAD_PASS = 901;

export default {
    data() {
        return {
            login: '',
            pass: '',
            errorMess: '',
            confirm: false,
            showForm: true,
            showForgotBtn: false,
        }
    },
    methods: {
        forgotClick() {
            this.$api.forgotPass(this.login)
                .then(res => {
                    this.showForm = false
                    this.errorMess = 'Wait for contact and try login again'
                })
                .catch((err={}) => {
                    let mess = err,
                        data = null
                    if (typeof err === 'object') {
                        mess = err.mess || mess
                        data = err.data || data
                    }
                    this.errorMess = mess
                })
        },
        send() {
            const data = {
                login: this.login,
                pass: this.pass,
                ...(this.confirm? {confirm: true}: {}),
            }
            this.$api.auth(data)
                .then(user => {
                    localStorage.token = user.hash
                    this.$app.user = user
                    this.$app.mess = 'Welcome)))'
                    const url = this.$route.query.redirect || '/'
                    this.$router.push(`${url}${location.hash}`)
                })
                .catch(({mess, data}) => {
                    console.log('Err:', mess, data)
                    if (data === ERR_CONFIRM_PASS) {
                        const confirm = prompt('Please, confirm your password:')
                        if (confirm === this.pass) {
                            this.confirm = true
                            this.$nextTick(() => this.send())
                        } else {
                            this.errorMess = 'Try again'
                        }
                    } else if (data === ERR_BAD_PASS) {
                        this.showForgotBtn = true
                        this.errorMess = mess
                    } else {
                        this.errorMess = mess
                    }
                });
        },
    }
}
</script>
