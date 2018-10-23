
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
        message: 'Hello Vue!',
        contentA: `\n{\n    "name": "Slaawwa"\n}\n`,
    },
    watch: {
        fName(fName) {
            console.log('fName:', fName.endsWith('.js')? 'javascript': 'json');
        },
    },
    methods: {
        selectFileClick(fName, structure, name) {
            this.selectStructure = structure
            this.selectName = name
            api.getFile(fName).then(({file}) => {
                this.fName = fName
                this.selectFile = file
                this.contentA = typeof file === 'object'
                    ? JSON.stringify(file)
                    : file
            })
        },
        createFileClick(fName, structure, name, item) {
            const file = prompt(`Create new file [${fName}]`, 'new-file.json');
            if (file) {
                api.putFile(`${fName}/${file}`, '').then(data => {
                    console.log('New file', data)
                    
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
            console.log(' - Saving...')
            api.putFile(this.fName, this.contentA).then(data => {
                console.log(' - Saved')
            }).catch(e => {
                console.log(' - Saving error:', e)
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
                console.log(' - Deleting...')
                api.delFile(this.fName).then(data => {
    
                    delete this.selectStructure[this.selectName]
    
                    const _structure = this.structure
    
                    this.structure = {}
    
                    this.$nextTick(() => {
                        this.structure = _structure
                    })
                    console.log(' - Deleted')
                    this.selectFile = false
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
