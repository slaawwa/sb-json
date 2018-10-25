
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
        mess: '',
        contentA: '',
    },
    computed: {
        alertClass() {
            return {
                colorInfo: this.mess.endsWith('...'),
                colorDanger: this.mess.endsWith('!'),
                colorWarning: this.mess.endsWith(' '),
            }
        },
    },
    watch: {
        mess(mess) {
            if (mess && !mess.endsWith('...')) {
                setTimeout(() => this.mess='', 1500)
            }
        },
        /*fName(fName) {
            console.log('fName:', fName.endsWith('.js')? 'javascript': 'json');
        },*/
    },
    methods: {
        selectFileClick(fName, structure, name) {
            this.selectStructure = structure
            this.selectName = name
            this.mess = 'Opening...'
            api.getFile(fName).then(({file}) => {
                location.hash = this.fName = fName
                this.selectFile = file
                this.contentA = typeof file === 'object'
                    ? JSON.stringify(file)
                    : file
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
                        this.$nextTick(() => structure[name] = _structure)
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
            api.putFile(this.fName, this.contentA).then(data => {
                this.mess = 'Saved'
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
            // const selectFile = 'common/data.json'
            if (confirm('WARNING!!! Delete?')) {
                this.mess = 'Deleting...'
                api.delFile(this.fName).then(data => {
    
                    delete this.selectStructure[this.selectName]
    
                    const _structure = this.structure
    
                    this.structure = {}
    
                    this.$nextTick(() => {
                        this.structure = _structure
                    })
                    this.selectFile = false
                    this.mess = 'Deleted!'
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
                .then(({auth}) => {
                    this.auth = auth;
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
