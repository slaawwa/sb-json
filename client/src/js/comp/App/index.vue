
<template lang="pug">
    #app
        router-view
</template>

<script>

export default {
    data() {
        return {
            login: '',
            pass: '',
            fName: '',
            selectFile: false,
            confirm: false,
            structure: {},
            selectStructure: null,
            selectName: null,
            mess: '',
            fileBefore: '',
            fileContent: '',
            backupStructure: {},
            user: {},
        }
    },
    computed: {
        lang() {
            let ext = this.fName && this.fName.toLowerCase && this.fName.toLowerCase().match(/(\w+)$/)[0]
            switch (ext) {
                case 'js':
                    ext = 'javascript'
                break;
                case 'md':
                    ext = 'markdown'
                break;
                // default:
                    // return 'json'
            }
            return ext
        },
        contentIsChanged() {
            return this.fileBefore !== this.fileContent
        },
        alertClass() {
            return {
                colorInfo: this.mess.endsWith('...'),
                colorDanger: this.mess.endsWith('!'),
                colorWarning: this.mess.endsWith(' '),
            }
        },
        isAdmin() {
            return Boolean(this.user && this.user.status === 9)
        },
    },
    watch: {
        mess(mess) {
            if (mess && !mess.endsWith('...')) {
                setTimeout(() => this.mess='', 1500)
            }
            this.$app && (
                this.$app.mess = mess
            )
        },
    },
    methods: {
    },
}
    
</script>