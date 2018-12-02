
<template lang="pug">
div(:class='_class')
    include top
    template(v-for='(item, name) in _structure')
        include folder
        include file
</template>

<script>
    let isRealFirst = true
    export default {
        name: 'file-tree',
        data() {
            return {
                isFocused: false,
                checkeds: {},
            }
        },
        props: {
            isFirst: {
                type: Boolean,
                default: false,
            },
            structure: {
                type: Object,
            },
            checked: {
                type: Boolean,
                default: true,
            },
            startDir: {
                type: String,
                default: '',
            },
            click: Function,
            contextClick: Function,
            clickNew: Function,
            dblclickFolder: Function,
            _class: {
                type: String,
                default: 'file_tree',
            },
            _parentStructure: {
                type: Object,
                default: null,
            },
            _parentName: {
                type: String,
                default: '',
            },
            search: {
                type: String,
                default:  localStorage.search || '',
            },
        },
        computed: {
            _structure() {
                return this.filterStructure(this.startDir, this.structure)
            },
        },
        watch: {
            search(search) {
                if (this.isFirst) {
                    localStorage.search = search
                }
            },
        },
        methods: {
            filterStructure(startDir, structure) {
                if (this.search === '') {
                    return structure
                } else {
                    const _structure = {}
                    for (const i in structure) {
                        if (typeof(structure[i]) === 'object') {
                            const tmp = this.filterStructure(`${startDir}${i}/`, structure[i])
                            if (tmp) {
                                _structure[i] = tmp
                            }
                        } else if (this.isSearched(startDir, i)) {
                            _structure[i] = structure[i]
                        }
                    }

                    if (Object.keys(_structure).length === 0) {
                        return false
                    }

                    return _structure
                }
            },
            isOpen(name) {
                return this.search? true: (this.checked || (() => {
                    const key = `folder_${this.startDir}${name}`,
                        isSet = key in this.checkeds,
                        hash = window.location.hash,
                        _checked = isSet
                            ? this.checkeds[key]
                            : hash.startsWith(`#${this.startDir}${name}`)
                    return _checked
                })())
            },
            onChangeChecked($event, name) {
                const key = `folder_${this.startDir}${name}`
                this.checkeds[key] = $event.target.checked
            },
            isSearched(startDir, name) {
                const search = this.search.toLowerCase(),
                    fullPath = (startDir + name).toLowerCase()
                return search === '' || fullPath.includes(search)
            },
            resize() {
                if (this.isFirst) {
                    const h = window.innerHeight - 100,
                        el = document.querySelector('.file_tree')
                    el && (el.style.minHeight = el.style.maxHeight = `${h}px`)
                }
            },
        },
        mounted() {
            // AutoResize
            window.onresize = () => this.resize()
            this.resize()

            // AutoOpen file
            if (isRealFirst) {
                const hash = window.location.hash.replace(/^#/, ''),
                    el = document.querySelector('[for="fileID_' + hash + '"]')
                if (el) {
                    isRealFirst = false
                    el.click()
                }
            }
        },
    }
</script>

<style lang="less">
    .file_tree {
        max-height: 550px;
        overflow-y: auto;
        hr {
            margin: 0;
        }
        .searchFilter {
            &:not(.showSearch) {
                opacity: .3;
                &:hover {
                    opacity: .7;
                }
            }
        }
    }
</style>
