
import Vue from 'vue'

const requireComponents = require.context(
    '.', true, /[\w-]+\.vue$/
)

requireComponents.keys().forEach(comp => {

    // Get file name
    const _name = comp.split('/')
    let name = _name.pop()

    // Get folder name if file name is index.vue
    name === 'index.vue' && (name = _name.pop())

    // Validation name
    name = name
        .replace(/\.vue$/i, '')
        .replace(/\W/gi, ' ')
        .trim()
        .replace(/\s\w/g, v => v.trim().toUpperCase())

    // Require file
    const config = requireComponents(comp)

    // Register component
    Vue.component(name, config.default || config)
})
