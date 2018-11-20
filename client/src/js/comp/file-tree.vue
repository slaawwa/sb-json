
<template lang="pug">
div(:class='_class')
    include file-tree/top
    template(v-for='(item, name) in structure')
        include file-tree/folder
        include file-tree/file
</template>

<script>
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
                default: '',
            },
        },
        watch: {
            search() {
            },
        },
        methods: {
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
            isSearched(name) {
                const search = this.search.toLowerCase(),
                    fullPath = (this.startDir + name).toLowerCase()
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
            const hash = window.location.hash.replace(/^#/, ''),
                el = document.querySelector('[for="fileID_' + hash + '"]');
            if (el) {
                el.click()
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
            &:not(.showSearch):not(:hover) {
                opacity: 0.3;
            }
        }
    }
</style>
