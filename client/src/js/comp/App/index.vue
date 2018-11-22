
<template src='./index.pug'></template>

<script>

import editor from '../editor'
import fileTree from '../file-tree/index'

export default {
    components: {
        editor,
        fileTree,
    },
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
            page: null,
            mess: '',
            fileBefore: '',
            fileContent: '',
            showBackup: false,
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
        cantDelete() {
            return ['README.md', 'error.json', 'USERS.json'].includes( this.fName ) 
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
        isAdmin() {
            return Boolean(this.user && this.user.status === 9)
        },
    },
    watch: {
        showBackup(show) {
            if (show) {
                this.backupsRefresh()
            }
        },
        mess(mess) {
            if (mess && !mess.endsWith('...')) {
                setTimeout(() => this.mess='', 1500)
            }
            this.$root.$options.$app && (
                this.$root.$options.$app.mess = mess
            )
        },
    },
    methods: {
        /* start backups functions */
        backupSwitch() {
            if (confirm('Switch cmd-admin-tmp / cmd-admin folders?')) {
                this.$api.switchBackup().then(() => {
                    this.mess = 'Refresh page...'
                    this.showBackup = false
                    this.getStructure()
                })
            }
        },
        backupApply(file) {
            if (confirm('Are you sure? Apply: ['+file+']')) {
                this.$api.applyBackup(file).then(() => {
                    this.mess = 'Refresh page...'
                    this.showBackup = false
                    this.getStructure()
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
            const file = e.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('file', file, file.name);
                this.$api.uploadBackup(formData).then(res => {
                    e.target.value = ''
                }).catch(err => {
                    e.target.value = ''
                    console.error('Err:', err)
                })
            }
        },
        backupsRefresh() {
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
        /* end backups functions */
        file2pretty() {
            if (this.fileContent && this.fileContent.trim()) {
                let json = '';
                try {
                    eval(`json = ${this.fileContent}`)
                    this.fileContent = JSON.stringify(json, null, 4)
                    this.mess = 'Formated success'
                } catch (e) {
                    console.error(e)
                    this.mess = e.toString()+'!'
                }
            }
        },
        fileClose() {
            this.selectFile = false
            location.hash = ''
        },
        selectFileClick(fName, structure, name) {
            this.selectStructure = structure
            this.selectName = name
            this.mess = 'Opening...'
            this.$api.getFile(fName).then(({file}) => {
                location.hash = this.fName = fName
                this.selectFile = file
                this.fileContent = typeof file === 'object'
                    ? JSON.stringify(file)
                    : file
                this.fileBefore = this.fileContent
                this.mess = ''
            })
        },
        createFileClick(fName, structure, name='', item='') {
            const file = prompt(`Create new file [${fName}]`, 'new-file.json');
            const isFile = file && file.includes('.')
            if (file) {
                if (isFile) {
                    this.mess = 'Creating file...'
                    this.$api.putFile(`${fName}/${file}`, '').then(data => {
                        this.mess = 'Created file'
                        let _structure;
                        if (name === '') {
                            // NOTE: in root folder file 
                            structure = this
                            name = 'structure'
                        }
                        structure[name][file] = false
                        _structure = structure[name]
                        structure[name] = {}
                        location.hash = `${fName}/${file}`;
                        this.$nextTick(() => {
                            structure[name] = _structure
                        })
                    })
                    .catch(e => {
                        console.log('New file error', e)
                    })
                } else {
                    // NOTE: Create new folder
                    this.clickNewDir(file/*folder*/, structure, name, fName)
                }
            }
        },
        selectFileSave() {
            // const selectFile = 'common/data.json'
            this.mess = 'Saving...'
            this.$api.putFile(this.fName, this.fileContent).then(data => {
                this.mess = 'Saved'
                this.fileBefore = this.fileContent
            }).catch(e => {
                console.log('Saving error:', e)
                this.mess = 'Saving error!'
            })
        },
        selectFileOpen() {
            const url = '/api/?cmd=admin-'+this.fName.replace(/\.(\w+)$/, '').replace(/\//g, '-');
            console.log('OPEN', url)
            window.open(url, '_blank')
        },
        selectFileDelete() {
            if (confirm('WARNING!!! Delete file?')) {
                this.mess = 'Deleting...'
                this.$api.delFile(this.fName).then(data => {

                    delete this.selectStructure[this.selectName]

                    const p = this.fName.lastIndexOf('/')
                    const pp = this.fName.split('/')
                    const folder = p !== -1 && this.fName.substring(0, p)

                    const el = `[id='folderID_${folder}']`

                    const _structure = this.structure

                    this.structure = {}

                    this.selectFile = false
                    this.mess = 'Deleted!'

                    this.$nextTick(() => {
                        this.structure = _structure
                        if (!folder) return
                        this.$nextTick(() => {
                            pp.pop()
                            pp.reduce((p, res) => {
                                const el = document.querySelector(`[id="folderID_${p + res}"]`)
                                el && (el.checked = !false)
                              return p + res + '/'
                            }, '')
                        })
                    })
                }).catch(e => {
                    console.log(' - Deleting error:', e)
                })
            }
        },
        clickNewDir(folder=null, structure=null, name='', fName='') {
            name !== '' || (folder = prompt('Create New Folder', ''))
            if (folder) {
                this.$api.createFolder(`${fName && fName + '/'}${folder}`).then(data => {
                    const _structure = (structure && structure[name]) || this.structure
                    if (!structure) {
                        structure = this
                        name = 'structure'
                    }
                    structure[name] = {}
                    this.$nextTick(() => {
                        structure[name] = Object.assign({[folder]: {}}, _structure)
                        this.$nextTick(() => {
                            const el = document.querySelector(`[id="folderID_${fName}"]`)
                            el && (el.checked = true)
                        })
                    })
                })
            }
        },
        delFolder(fullName, parentStructure, parentName, folderName) {
            const assure = confirm(`Folder [${fullName}] delete?`)
            if (assure) {
                this.mess = 'Deleting...'
                this.$api.delFolder(fullName).then(() => {
                    // TODO: Need update structure((((
                    this.mess = 'Folder was deleted!'
                    let structure = parentStructure;
                    if (structure === null) {
                        structure = this
                        parentName = 'structure'
                    }
                    console.log(' - parentName:', parentName)
                    console.log(' - folderName:', folderName)
                    structure[parentName][folderName]= true
                    const _structure = structure[parentName]
                    structure[parentName] = {}
                    this.$nextTick(() => structure[parentName] = _structure)

                }).catch(e => {
                    this.mess = 'Error!'
                    console.error('Error:', e)
                })
            }
        },
        changeFileContent(val) {
            if (this.fileContent !== val) {
                this.fileContent = val
            }
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
                    this.user = user
                    this.page = 'admin'
                    this.getStructure()
                    this.mess = 'Welcome)))'
                })
                .catch(({mess, data}) => {
                    console.log('Err:', mess, data)
                    if (data === 900) {
                        const confirm = prompt('Please, confirm your password:')
                        console.log('confirm', this.confirm)
                        if (confirm === this.pass) {
                            console.log('TRUE')
                            this.confirm = true
                            this.$nextTick(() => this.send())
                        } else {
                            console.log('False')
                            alert('Try again')
                        }
                    } else {
                        alert(mess)
                    }
                    this.page = 'login'
                });
        },
        logOut() {
            localStorage.removeItem('token')
            this.page = 'login'
            this.user = {};
        },
        getStructure() {
            this.$api.structure().then(structure => {
                this.structure = structure
                this.mess = ''
            })
        },
    },
    mounted() {
        // Auto Auth
        if (localStorage.token) {
            this.$api.checkToken(localStorage.token)
                .then(user => {
                    this.page = 'admin'
                    this.user = user
                    this.getStructure()
                    this.mess = 'Welcome)))'
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    alert('Uncorect token')
                    this.page = 'login'
                });
        } else {
            this.page = 'login'
        }

        // Ctrl + S
        window.addEventListener('keydown', (e) => {
            if(e.ctrlKey || e.metaKey) {
                if (e.code === 'KeyS') {
                    e.preventDefault()
                    this.selectFileSave()
                }
            }
        });
    },
}
    
</script>