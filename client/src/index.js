
import Vue from 'vue'

import api from './api'

import editor from './comp/editor.vue'
import fileTree from './comp/file-tree.vue'

import './style.less'

const app = new Vue({
    el: '#app',
    data: {
        auth: null,
        login: '',
        fName: '',
        selectFile: false,
        structure: {},
        selectStructure: null,
        selectName: null,
        page: null,
        message: '',
        contentA: `\n{\n    "name": "Slaawwa"\n}\n`,
    },
    watch: {
        message(mess) {
            if (mess && !mess.endsWith('...')) {
                setTimeout(() => this.message='', 1500)
            }
        },
        fName(fName) {
            console.log('fName:', fName.endsWith('.js')? 'javascript': 'json');
        },
    },
    methods: {
        selectFileClick(fName, structure, name) {
            this.selectStructure = structure
            this.selectName = name
            this.message = 'Opening...'
            api.getFile(fName).then(({file}) => {
                this.fName = fName
                this.selectFile = file
                this.contentA = typeof file === 'object'
                    ? JSON.stringify(file)
                    : file
                this.message = ''
            })
        },
        createFileClick(fName, structure, name, item) {
            const file = prompt(`Create new file [${fName}]`, 'new-file.json');
            if (file) {
                this.message = 'Creating file...'
                api.putFile(`${fName}/${file}`, '').then(data => {
                    console.log('New file', data)
                    this.message = 'Created file!'
                    
                    structure[name][file] = false

                    const _structure = structure[name]
                    structure[name] = {}

                    this.$nextTick(() => {
                        structure[name] = _structure
                    })
                })
                .catch(e => {
                    console.log('New file error', e)
                })
            }
        },
        selectFileSave() {
            // const selectFile = 'common/data.json'
            this.message = 'Saving...'
            api.putFile(this.fName, this.contentA).then(data => {
                this.message = 'Saved'
            }).catch(e => {
                console.log('Saving error:', e)
                this.message = 'Saving error!'
            })
        },
        selectFileOpen() {
            const url = '/api/?cmd=admin-'+this.fName.replace(/\.(\w+)$/, '').replace(/\//g, '-');
            console.log('OPEN', url)
            window.open(url, '_blank')
        },
        selectFileDelete() {
            // const selectFile = 'common/data.json'
            if (confirm('WARNING!!! Delete?')) {
                this.message = 'Deleting...'
                api.delFile(this.fName).then(data => {
    
                    delete this.selectStructure[this.selectName]
    
                    const _structure = this.structure
    
                    this.structure = {}
    
                    this.$nextTick(() => {
                        this.structure = _structure
                    })
                    this.selectFile = false
                    this.message = 'Deleted!'
                }).catch(e => {
                    console.log(' - Deleting error:', e)
                })
            }
        },

        clickNewDir() {
            const folder = prompt('Create New Folder', '')
            if (folder) {
                api.createFolder(folder).then(data => {
                    const _structure = this.structure
                    this.structure = {}
                    this.$nextTick(() => {
                        this.structure = Object.assign({[folder]: {}}, _structure)
                    })
                })
            }
        },
        changeContentA(val) {
            if (this.contentA !== val) {
                this.contentA = val
            }
        },
        send() {
            api.auth(this.login)
                .then(({token}) => {
                    localStorage.token = token
                    this.auth = true;
                    this.page = 'admin'
                    this.getStructure()
                    this.message = 'Welcome!!!'
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
            api.structure().then(structure => this.structure = structure)
        },
    },
    mounted() {
        if (localStorage.token) {
            api.checkToken(localStorage.token)
                .then(({auth}) => {
                    this.auth = auth;
                    this.page = 'admin'
                    this.getStructure()
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
