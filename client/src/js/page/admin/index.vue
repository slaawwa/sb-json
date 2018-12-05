
<template lang="pug">
    div(v-if='$root.page', key='content')
        include menu
        include index
        modal-backup(
                @updateStructure='getStructure'
                :showBackup='$root.showBackup'
            )
    div(v-else, key='page-loader')
        #pageLoading Initialization...
</template>

<script>

const CANT_DELETE_FOLDERS = [
    'README.md',
    'error.json',
    'USERS.json',
];

export default {
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
                setTimeout(() => this.$root.mess='', 1500)
            }
            this.$root.mess = mess
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
    },
    methods: {
        logOut() {
            localStorage.removeItem('token')
            this.$root.user = {};
            this.$router.push(`/login${location.hash}`);
        },
        file2pretty() {
            if (this.fileContent && this.fileContent.trim()) {
                let json = '';
                try {
                    eval(`json = ${this.fileContent}`)
                    this.fileContent = JSON.stringify(json, null, 4)
                    this.$root.mess = 'Formated success'
                } catch (e) {
                    console.error(e)
                    this.$root.mess = e.toString()+'!'
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
            this.$root.mess = 'Opening...'
            this.$api.getFile(fName).then(({file}) => {
                location.hash = this.fName = fName
                this.selectFile = file
                this.fileContent = typeof file === 'object'
                    ? JSON.stringify(file)
                    : file
                this.fileBefore = this.fileContent
                this.$root.mess = ''
            })
        },
        createFileClick(fName, structure, name='', item='') {
            const file = prompt(`Create new file [${fName}]`, 'new-file.json');
            const isFile = file && file.includes('.')
            if (file) {
                if (isFile) {
                    this.$root.mess = 'Creating file...'
                    this.$api.putFile(`${fName}/${file}`, '').then(data => {
                        this.$root.mess = 'Created file'
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
            this.$root.mess = 'Saving...'
            this.$api.putFile(this.fName, this.fileContent).then(data => {
                this.$root.mess = 'Saved'
                this.fileBefore = this.fileContent
            }).catch(e => {
                console.log('Saving error:', e)
                this.$root.mess = 'Saving error!'
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
                this.$root.mess = 'Deleting...'
                this.$api.delFile(this.fName).then(data => {

                    delete this.selectStructure[this.selectName]

                    const p = this.fName.lastIndexOf('/')
                    const pp = this.fName.split('/')
                    const folder = p !== -1 && this.fName.substring(0, p)

                    const el = `[id='folderID_${folder}']`

                    const _structure = this.structure

                    this.structure = {}

                    this.selectFile = false
                    this.$root.mess = 'Deleted!'

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
                this.$root.mess = 'Deleting...'
                this.$api.delFolder(fullName).then(() => {
                    // TODO: Need update structure((((
                    this.$root.mess = 'Folder was deleted!'
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
                    this.$root.mess = 'Error!'
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
            return this.$api.structure().then(structure => {
                this.structure = structure
                this.$root.mess = ''
            })
        },
        setUser(user) {
            this.$root.page = 'admin'
            this.$root.user = user
            this.getStructure().then(() => {
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
            this.$root.mess = 'Welcome)))'
            return Promise.resolve(user)
        },
    },
    mounted() {
        // Auto Auth
        if (localStorage.token) {

            let req = Object.keys(this.$root.user).length
                ? new Promise(fn => fn(this.$root.user))
                : this.$api.checkToken(localStorage.token)

            req
                .then(this.setUser)
                .catch(() => {
                    localStorage.removeItem('token');
                    alert('Uncorect token')
                    this.$root.page = 'login'
                })

        } else {
            this.$root.page = 'login'
        }
    },
}
</script>
