
<template lang="pug">
div(:class="_class? _class: 'file_tree'")
    template(v-if='isFirst')
        input#fileID_newFolder(type='checkbox', name='hosted_files')
        label(for='fileID_newFolder', @click='clickNew()') NEW FOLDER
        input(type='radio', name='hosted_files', id='fileID_README.md')
        label(for='fileID_README.md', @click="click('README.md', null, 'README.md')") README.md
        hr
    template(v-for='(item, name) in structure')
        template(v-if='item && item !== true')
            input(type='checkbox', :id="'folderID_'+name", :checked='checked')
            label(:for="'folderID_'+name", @contextmenu.prevent.stop='contextclick(startDir + name, structure, name, item)') {{name}}
            file-tree(:structure='item', _class='dir_wrapper', :checked='false', :start-dir="startDir + name + '/'", :click='click', :contextclick='contextclick')
        template(v-else-if='item === false')
            input(type='radio', name='hosted_files', :id="'fileID_'+startDir+name", :value='name')
            label(:for="'fileID_'+startDir+name", @click='click(startDir + name, structure, name)') {{name}}

</template>

<script>
    export default {
        name: 'file-tree',
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
            contextclick: Function,
            clickNew: Function,
            _class: String,
        },    
    }
</script>

<style lang="less">
    .file_tree hr {
        margin: 0;
    }
</style>
