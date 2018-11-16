
import Vue from 'vue'

import api from './js/api'

import editor from './js/comp/editor'
import fileTree from './js/comp/file-tree'

import './index.less'

const app = new Vue({
    el: '#app',
    data: {
        login: '',
        fName: '',
        selectFile: false,
        structure: {},
        selectStructure: null,
        selectName: null,
        page: null,
        mess: '',
        fileBefore: '',
        fileContent: '',
        showBackup: false,
        backupStructure: {},
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
            return ['README.md', 'error.json'].includes( this.fName ) 
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
        },
    },
    methods: {
        /* start backups functions */
        backupSwitch() {
            if (confirm('Switch cmd-admin-tmp / cmd-admin folders?')) {
                api.switchBackup().then(() => {
                    this.mess = 'Refresh page...'
                    this.showBackup = false
                    this.getStructure()
                })
            }
        },
        backupApply(file) {
            if (confirm('Are you sure? Apply: ['+file+']')) {
                api.applyBackup(file).then(() => {
                    this.mess = 'Refresh page...'
                    this.showBackup = false
                    this.getStructure()
                })
            }
        },
        backupDel(file) {
            if (confirm('Are you sure? Delete: ['+file+']')) {
                api.delBackup(file).then(() => {
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
                api.uploadBackup(formData).then(res => {
                    e.target.value = ''
                }).catch(err => {
                    e.target.value = ''
                    console.error('Err:', err)
                })
            }
        },
        backupsRefresh() {
            api.refreshBackups().then(data => {
                this.backupStructure = data
            })
        },
        backupCreate() {
            api.createBackup().then(data => {
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
            api.getFile(fName).then(({file}) => {
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
                    api.putFile(`${fName}/${file}`, '').then(data => {
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
                            this.$nextTick(() => this.checkUrl())
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
            api.putFile(this.fName, this.fileContent).then(data => {
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
                api.delFile(this.fName).then(data => {
    
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
                                document
                                    .querySelector(`[id="folderID_${p + res}"]`)
                                    .checked = !false
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
                api.createFolder(`${fName && fName + '/'}${folder}`).then(data => {
                    const _structure = (structure && structure[name]) || this.structure
                    if (!structure) {
                        structure = this
                        name = 'structure'
                    }
                    structure[name] = {}
                    this.$nextTick(() => {
                        structure[name] = Object.assign({[folder]: {}}, _structure)
                        this.$nextTick(() => {
                            document.querySelector(`[id="folderID_${fName}"]`).checked = true
                        })
                    })
                })
            }
        },
        delFolder(fullName, parentStructure, parentName, folderName) {
            const assure = confirm(`Folder [${fullName}] delete?`)
            if (assure) {
                this.mess = 'Deleting...'
                api.delFolder(fullName).then(() => {
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
            api.auth(this.login)
                .then(({token}) => {
                    localStorage.token = token
                    this.page = 'admin'
                    this.getStructure()
                    this.mess = 'Welcome)))'
                })
                .catch(() => {
                    alert('Uncorect login')
                    this.page = 'login'
                });
        },
        logOut() {
            localStorage.removeItem('token')
            this.page = 'login'
        },
        getStructure() {
            api.structure().then(structure => {
                this.structure = structure
                this.$nextTick(() => this.checkUrl())
                this.mess = ''
            })
        },
        checkUrl() {
            if (location.hash) {
                const id = location.hash.replace('#', 'fileID_')
                const domEl = document.querySelector(`[for="${id}"]`)
                if (domEl && domEl.click) {
                    domEl.click()
                    let parent = domEl.parentElement
                    while (parent.classList.contains('dir_wrapper')) {
                        const input = parent.previousSibling.previousSibling
                        input.checked = true
                        parent = parent.parentElement
                    }
                }
            }
        },
    },
    mounted() {
        if (localStorage.token) {
            api.checkToken(localStorage.token)
                .then((/*{auth}*/) => {
                    this.page = 'admin'
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
        window.addEventListener('keydown', (e) => {
            if(e.ctrlKey || e.metaKey) {
                if (e.code === 'KeyS') {
                    e.preventDefault()
                    this.selectFileSave()
                }
            }
        });
    },
    components: {
        editor,
        fileTree,
    },
})

if (isDev) {
    window.app = app
}

export default app
