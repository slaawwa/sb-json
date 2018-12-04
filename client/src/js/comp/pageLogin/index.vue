<template lang="pug">
    form.form-signin(
            @submit.prevent='send'
            autocomplete='off'
        )

        h2.form-signin-heading.text-info
            | Enter page

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
</template>

<script>
export default {
    data() {
        return {
            login: '',
            pass: '',
            confirm: false,
        }
    },
    methods: {
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
                    this.mess = 'Welcome)))'
                    const url = this.$route.query.redirect || '/'
                    this.$router.push(`${url}${location.hash}`)
                })
                .catch(({mess, data}) => {
                    console.log('Err:', mess, data)
                    if (data === 900) {
                        const confirm = prompt('Please, confirm your password:')
                        if (confirm === this.pass) {
                            this.confirm = true
                            this.$nextTick(() => this.send())
                        } else {
                            alert('Try again')
                        }
                    } else {
                        alert(mess)
                    }
                });
        },
    }
}
</script>
