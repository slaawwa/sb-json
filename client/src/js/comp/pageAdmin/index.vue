
<template lang="pug">
    div
        div(v-if='$app.page', key='content')
            include menu
            include index
            modal-backup
        div#pageLoading(v-else, key='page-loader')
            | Initialization...
</template>

<script>

import editor from '../editor'
import fileTree from '../file-tree/index'
import modalBackup from '../modal-backup/index'

const CANT_DELETE_FOLDERS = [
    'README.md',
    'error.json',
    'USERS.json',
];

export default {
    components: {
        editor,
        fileTree,
        modalBackup,
    },
    data() {
        return {
            fName: '',
            selectFile: false,
            structure: {},
            selectStructure: null,
            selectName: null,
            page: null,
            mess: '',
            fileBefore: '',
            fileContent: '',
            user: {},
        }
    },
    watch: {
        mess(mess) {
            if (mess && !mess.endsWith('...')) {
                setTimeout(() => this.$app.mess='', 1500)
            }
            this.$app && (
                this.$app.mess = mess
            )
        },
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
            return CANT_DELETE_FOLDERS.includes( this.fName ) 
        },
        contentIsChanged() {
            return this.fileBefore !== this.fileContent
        },
        alertClass() {
            return {
                colorInfo: this.$app.mess.endsWith('...'),
                colorDanger: this.$app.mess.endsWith('!'),
                colorWarning: this.$app.mess.endsWith(' '),
            }
        },
        isAdmin() {
            return Boolean(this.user && this.user.status === 9)
        },
    },
    methods: {
        logOut() {
            localStorage.removeItem('token')
            this.$app.user = {};
            this.$router.push(`/login${location.hash}`);
        },
        file2pretty() {
            if (this.fileContent && this.fileContent.trim()) {
                let json = '';
                try {
                    eval(`json = ${this.fileContent}`)
                    this.fileContent = JSON.stringify(json, null, 4)
                    this.$app.mess = 'Formated success'
                } catch (e) {
                    console.error(e)
                    this.$app.mess = e.toString()+'!'
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
            this.$app.mess = 'Opening...'
            this.$api.getFile(fName).then(({file}) => {
                location.hash = this.fName = fName
                this.selectFile = file
                this.fileContent = typeof file === 'object'
                    ? JSON.stringify(file)
                    : file
                this.fileBefore = this.fileContent
                this.$app.mess = ''
            })
        },
        createFileClick(fName, structure, name='', item='') {
            const file = prompt(`Create new file [${fName}]`, 'new-file.json');
            const isFile = file && file.includes('.')
            if (file) {
                if (isFile) {
                    this.$app.mess = 'Creating file...'
                    this.$api.putFile(`${fName}/${file}`, '').then(data => {
                        this.$app.mess = 'Created file'
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
            this.$app.mess = 'Saving...'
            this.$api.putFile(this.fName, this.fileContent).then(data => {
                this.$app.mess = 'Saved'
                this.fileBefore = this.fileContent
            }).catch(e => {
                console.log('Saving error:', e)
                this.$app.mess = 'Saving error!'
            })
        },
        selectFileOpen() {
            const url = '/api/?cmd=admin-'+this.fName
                .replace(/\.(\w+)$/, '')
                .replace(/\//g, '-');
            window.open(url, '_blank')
        },
        selectFileDelete() {
            if (confirm('WARNING!!! Delete file?')) {
                this.$app.mess = 'Deleting...'
                this.$api.delFile(this.fName).then(data => {

                    delete this.selectStructure[this.selectName]

                    const p = this.fName.lastIndexOf('/')
                    const pp = this.fName.split('/')
                    const folder = p !== -1 && this.fName.substring(0, p)

                    const el = `[id='folderID_${folder}']`

                    const _structure = this.structure

                    this.structure = {}

                    this.selectFile = false
                    this.$app.mess = 'Deleted!'

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
                this.$app.mess = 'Deleting...'
                this.$api.delFolder(fullName).then(() => {
                    // TODO: Need update structure((((
                    this.$app.mess = 'Folder was deleted!'
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
                    this.$app.mess = 'Error!'
                    console.error('Error:', e)
                })
            }
        },
        changeFileContent(val) {
            if (this.fileContent !== val) {
                this.fileContent = val
            }
        },
        getStructure() {
            this.$api.structure().then(structure => {
                this.structure = structure
                this.$app.mess = ''
            })
        },
    },
    mounted() {
        // Auto Auth
        if (localStorage.token) {
            this.$api.checkToken(localStorage.token)
                .then(user => {

                    this.$app.page = 'admin'
                    this.$app.user = user
                    this.getStructure()
                    this.$app.mess = 'Welcome)))'

                    // Ctrl + S
                    window.addEventListener('keydown', (e) => {
                        if(e.ctrlKey || e.metaKey) {
                            if (e.code === 'KeyS') {
                                e.preventDefault()
                                this.selectFileSave()
                            }
                        }
                    });
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    alert('Uncorect token')
                    this.$app.page = 'login'
                });
        } else {
            this.$app.page = 'login'
        }
    },
}
</script>
