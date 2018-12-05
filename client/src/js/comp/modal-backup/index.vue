
<template lang="pug" src="./index.pug"></template>

<script>
export default {
    name: 'modal-backup',
    props: {
        showBackup:{
            attributes: Boolean,
            default: false,
            required: false,
        },
    },
    data() {
        return {
            backupStructure: {},
        }
    },
    watch: {
        showBackup(show) {
            if (show) {
                this.backupsRefresh()
            }
        },
    },
    computed: {
        downloadStructure() {
            const downloads = {}
            Object.keys(this.backupStructure).forEach(item => {
                if (item.startsWith('cmd-admin--backup-')) {
                    downloads[item] = item.substr(18)
                }
            })

            return downloads
        },
        uploadStructure() {
            const uploads = {}
            Object.keys(this.backupStructure).forEach(item => {
                if (item.startsWith('cmd-admin--upload-')) {
                    uploads[item] = item.substr(18)
                }
            })

            return uploads
        },
    },
    methods: {
        backupSwitch() {
            if (confirm('Switch cmd-admin-tmp / cmd-admin folders?')) {
                this.$api.switchBackup().then(() => {
                    this.$root.mess = 'Refresh page...'
                    this.$emit('updateStructure')
                })
            }
        },
        backupApply(file) {
            if (confirm('Are you sure? Apply: ['+file+']')) {
                this.$api.applyBackup(file).then(() => {
                    this.$root.mess = 'Refresh page...'
                    this.$emit('updateStructure')
                })
            }
        },
        backupDel(file) {
            if (confirm('Are you sure? Delete: ['+file+']')) {
                this.$api.delBackup(file).then(() => {
                    delete this.backupStructure[file]
                    const $tmp = this.backupStructure
                    this.backupStructure = {}
                    this.$nextTick(() => {
                        this.backupStructure = $tmp
                    })
                })
            }
        },
        uploadFile(e) {
            if (e.target.lastChild) {
                e.target.lastChild.click()
            }
        },
        uploadFileChange(e) {
            const file = e.target.files[0]
            if (file) {
                const formData = new FormData()
                formData.append('file', file, file.name)
                this.$api.uploadBackup(formData).then(res => {
                    e.target.value = ''
                }).catch(err => {
                    e.target.value = ''
                    console.error('Err:', err)
                })
            }
        },
        backupsRefresh() {
            this.backupStructure = {}
            this.$api.refreshBackups().then(data => {
                this.backupStructure = data
            })
        },
        backupCreate() {
            this.$api.createBackup().then(data => {
                this.backupStructure[data] = true
                const $tmp = this.backupStructure
                this.backupStructure = {}
                this.$nextTick(() => {
                    this.backupStructure = $tmp
                })
            })
        },
    },
}
</script>

<style scoped>
    .modal-body {
        max-height: 400px;
        overflow-y: auto;
    }
</style>
