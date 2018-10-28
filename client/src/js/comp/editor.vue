<template lang='pug'>
    div(:id='editorId')
</template>

<script>
    
    import ace from 'ace-builds/src-noconflict/ace'
    
    // ace.config.set('basePath', '/ace/');
    // ace.config.set('modePath', '/ace/');
    // ace.config.set('themePath', '/ace/');
    // ace.config.set('workerPath', '/ace/');
    
    // import javascript from 'ace-builds/src-noconflict/mode-javascript'
    // import json from 'ace-builds/src-noconflict/mode-json'
    // import php from 'ace-builds/src-noconflict/mode-php'
    // import markdown from 'ace-builds/src-noconflict/mode-markdown'
    
    // const modes = {
    //     javascript,
    //     json,
    //     php,
    //     markdown,
    // }
    
    // import pastel_on_dark from 'ace-builds/src-noconflict/theme-pastel_on_dark'
    // import monokai from 'ace-builds/src-noconflict/theme-monokai'
    
    // import 'ace-builds/webpack-resolver';
    
    // ace.config.setModuleUrl('ace/ext/beautify', require('file-loader!ace-builds/src-noconflict/ext-beautify.js'))
    // ace.config.setModuleUrl('ace/ext/elastic_tabstops_lite', require('file-loader!ace-builds/src-noconflict/ext-elastic_tabstops_lite.js'))
    // ace.config.setModuleUrl('ace/ext/emmet', require('file-loader!ace-builds/src-noconflict/ext-emmet.js'))
    // ace.config.setModuleUrl('ace/ext/error_marker', require('file-loader!ace-builds/src-noconflict/ext-error_marker.js'))
    // ace.config.setModuleUrl('ace/ext/keyboard_menu', require('file-loader!ace-builds/src-noconflict/ext-keybinding_menu.js'))
    // ace.config.setModuleUrl('ace/ext/language_tools', require('file-loader!ace-builds/src-noconflict/ext-language_tools.js'))
    // ace.config.setModuleUrl('ace/ext/linking', require('file-loader!ace-builds/src-noconflict/ext-linking.js'))
    // ace.config.setModuleUrl('ace/ext/modelist', require('file-loader!ace-builds/src-noconflict/ext-modelist.js'))
    // ace.config.setModuleUrl('ace/ext/options', require('file-loader!ace-builds/src-noconflict/ext-options.js'))
    // ace.config.setModuleUrl('ace/ext/rtl', require('file-loader!ace-builds/src-noconflict/ext-rtl.js'))
    // ace.config.setModuleUrl('ace/ext/searchbox', require('file-loader!ace-builds/src-noconflict/ext-searchbox.js'))
    // ace.config.setModuleUrl('ace/ext/settings_menu', require('file-loader!ace-builds/src-noconflict/ext-settings_menu.js'))
    // ace.config.setModuleUrl('ace/ext/spellcheck', require('file-loader!ace-builds/src-noconflict/ext-spellcheck.js'))
    // ace.config.setModuleUrl('ace/ext/split', require('file-loader!ace-builds/src-noconflict/ext-split.js'))
    // ace.config.setModuleUrl('ace/ext/static_highlight', require('file-loader!ace-builds/src-noconflict/ext-static_highlight.js'))
    // ace.config.setModuleUrl('ace/ext/statusbar', require('file-loader!ace-builds/src-noconflict/ext-statusbar.js'))
    // ace.config.setModuleUrl('ace/ext/textarea', require('file-loader!ace-builds/src-noconflict/ext-textarea.js'))
    // ace.config.setModuleUrl('ace/ext/themelist', require('file-loader!ace-builds/src-noconflict/ext-themelist.js'))
    // ace.config.setModuleUrl('ace/ext/whitespace', require('file-loader!ace-builds/src-noconflict/ext-whitespace.js'))
    // ace.config.setModuleUrl('ace/keyboard/emacs', require('file-loader!ace-builds/src-noconflict/keybinding-emacs.js'))
    // ace.config.setModuleUrl('ace/keyboard/vim', require('file-loader!ace-builds/src-noconflict/keybinding-vim.js'))
    // ace.config.setModuleUrl('ace/mode/abap', require('file-loader!ace-builds/src-noconflict/mode-abap.js'))
    // ace.config.setModuleUrl('ace/mode/abc', require('file-loader!ace-builds/src-noconflict/mode-abc.js'))
    // ace.config.setModuleUrl('ace/mode/actionscript', require('file-loader!ace-builds/src-noconflict/mode-actionscript.js'))
    // ace.config.setModuleUrl('ace/mode/ada', require('file-loader!ace-builds/src-noconflict/mode-ada.js'))
    // ace.config.setModuleUrl('ace/mode/apache_conf', require('file-loader!ace-builds/src-noconflict/mode-apache_conf.js'))
    // ace.config.setModuleUrl('ace/mode/applescript', require('file-loader!ace-builds/src-noconflict/mode-applescript.js'))
    // ace.config.setModuleUrl('ace/mode/asciidoc', require('file-loader!ace-builds/src-noconflict/mode-asciidoc.js'))
    // ace.config.setModuleUrl('ace/mode/asl', require('file-loader!ace-builds/src-noconflict/mode-asl.js'))
    // ace.config.setModuleUrl('ace/mode/assembly_x86', require('file-loader!ace-builds/src-noconflict/mode-assembly_x86.js'))
    // ace.config.setModuleUrl('ace/mode/autohotkey', require('file-loader!ace-builds/src-noconflict/mode-autohotkey.js'))
    // ace.config.setModuleUrl('ace/mode/batchfile', require('file-loader!ace-builds/src-noconflict/mode-batchfile.js'))
    // ace.config.setModuleUrl('ace/mode/bro', require('file-loader!ace-builds/src-noconflict/mode-bro.js'))
    // ace.config.setModuleUrl('ace/mode/c9search', require('file-loader!ace-builds/src-noconflict/mode-c9search.js'))
    // ace.config.setModuleUrl('ace/mode/cirru', require('file-loader!ace-builds/src-noconflict/mode-cirru.js'))
    // ace.config.setModuleUrl('ace/mode/clojure', require('file-loader!ace-builds/src-noconflict/mode-clojure.js'))
    // ace.config.setModuleUrl('ace/mode/cobol', require('file-loader!ace-builds/src-noconflict/mode-cobol.js'))
    // ace.config.setModuleUrl('ace/mode/coffee', require('file-loader!ace-builds/src-noconflict/mode-coffee.js'))
    // ace.config.setModuleUrl('ace/mode/coldfusion', require('file-loader!ace-builds/src-noconflict/mode-coldfusion.js'))
    // ace.config.setModuleUrl('ace/mode/csharp', require('file-loader!ace-builds/src-noconflict/mode-csharp.js'))
    // ace.config.setModuleUrl('ace/mode/csound_document', require('file-loader!ace-builds/src-noconflict/mode-csound_document.js'))
    // ace.config.setModuleUrl('ace/mode/csound_orchestra', require('file-loader!ace-builds/src-noconflict/mode-csound_orchestra.js'))
    // ace.config.setModuleUrl('ace/mode/csound_score', require('file-loader!ace-builds/src-noconflict/mode-csound_score.js'))
    // ace.config.setModuleUrl('ace/mode/csp', require('file-loader!ace-builds/src-noconflict/mode-csp.js'))
    // ace.config.setModuleUrl('ace/mode/css', require('file-loader!ace-builds/src-noconflict/mode-css.js'))
    // ace.config.setModuleUrl('ace/mode/curly', require('file-loader!ace-builds/src-noconflict/mode-curly.js'))
    // ace.config.setModuleUrl('ace/mode/c_cpp', require('file-loader!ace-builds/src-noconflict/mode-c_cpp.js'))
    // ace.config.setModuleUrl('ace/mode/d', require('file-loader!ace-builds/src-noconflict/mode-d.js'))
    // ace.config.setModuleUrl('ace/mode/dart', require('file-loader!ace-builds/src-noconflict/mode-dart.js'))
    // ace.config.setModuleUrl('ace/mode/diff', require('file-loader!ace-builds/src-noconflict/mode-diff.js'))
    // ace.config.setModuleUrl('ace/mode/django', require('file-loader!ace-builds/src-noconflict/mode-django.js'))
    // ace.config.setModuleUrl('ace/mode/dockerfile', require('file-loader!ace-builds/src-noconflict/mode-dockerfile.js'))
    // ace.config.setModuleUrl('ace/mode/dot', require('file-loader!ace-builds/src-noconflict/mode-dot.js'))
    // ace.config.setModuleUrl('ace/mode/drools', require('file-loader!ace-builds/src-noconflict/mode-drools.js'))
    // ace.config.setModuleUrl('ace/mode/edifact', require('file-loader!ace-builds/src-noconflict/mode-edifact.js'))
    // ace.config.setModuleUrl('ace/mode/eiffel', require('file-loader!ace-builds/src-noconflict/mode-eiffel.js'))
    // ace.config.setModuleUrl('ace/mode/ejs', require('file-loader!ace-builds/src-noconflict/mode-ejs.js'))
    // ace.config.setModuleUrl('ace/mode/elixir', require('file-loader!ace-builds/src-noconflict/mode-elixir.js'))
    // ace.config.setModuleUrl('ace/mode/elm', require('file-loader!ace-builds/src-noconflict/mode-elm.js'))
    // ace.config.setModuleUrl('ace/mode/erlang', require('file-loader!ace-builds/src-noconflict/mode-erlang.js'))
    // ace.config.setModuleUrl('ace/mode/forth', require('file-loader!ace-builds/src-noconflict/mode-forth.js'))
    // ace.config.setModuleUrl('ace/mode/fortran', require('file-loader!ace-builds/src-noconflict/mode-fortran.js'))
    // ace.config.setModuleUrl('ace/mode/fsharp', require('file-loader!ace-builds/src-noconflict/mode-fsharp.js'))
    // ace.config.setModuleUrl('ace/mode/ftl', require('file-loader!ace-builds/src-noconflict/mode-ftl.js'))
    // ace.config.setModuleUrl('ace/mode/gcode', require('file-loader!ace-builds/src-noconflict/mode-gcode.js'))
    // ace.config.setModuleUrl('ace/mode/gherkin', require('file-loader!ace-builds/src-noconflict/mode-gherkin.js'))
    // ace.config.setModuleUrl('ace/mode/gitignore', require('file-loader!ace-builds/src-noconflict/mode-gitignore.js'))
    // ace.config.setModuleUrl('ace/mode/glsl', require('file-loader!ace-builds/src-noconflict/mode-glsl.js'))
    // ace.config.setModuleUrl('ace/mode/gobstones', require('file-loader!ace-builds/src-noconflict/mode-gobstones.js'))
    // ace.config.setModuleUrl('ace/mode/golang', require('file-loader!ace-builds/src-noconflict/mode-golang.js'))
    // ace.config.setModuleUrl('ace/mode/graphqlschema', require('file-loader!ace-builds/src-noconflict/mode-graphqlschema.js'))
    // ace.config.setModuleUrl('ace/mode/groovy', require('file-loader!ace-builds/src-noconflict/mode-groovy.js'))
    // ace.config.setModuleUrl('ace/mode/haml', require('file-loader!ace-builds/src-noconflict/mode-haml.js'))
    // ace.config.setModuleUrl('ace/mode/handlebars', require('ace-builds/src-noconflict/mode-handlebars.js'))
    // ace.config.setModuleUrl('ace/mode/haskell', require('file-loader!ace-builds/src-noconflict/mode-haskell.js'))
    // ace.config.setModuleUrl('ace/mode/haskell_cabal', require('file-loader!ace-builds/src-noconflict/mode-haskell_cabal.js'))
    // ace.config.setModuleUrl('ace/mode/haxe', require('file-loader!ace-builds/src-noconflict/mode-haxe.js'))
    // ace.config.setModuleUrl('ace/mode/hjson', require('file-loader!ace-builds/src-noconflict/mode-hjson.js'))
    ace.config.setModuleUrl('ace/mode/html', require('ace-builds/src-noconflict/mode-html.js'))
    // ace.config.setModuleUrl('ace/mode/html_elixir', require('file-loader!ace-builds/src-noconflict/mode-html_elixir.js'))
    // ace.config.setModuleUrl('ace/mode/html_ruby', require('file-loader!ace-builds/src-noconflict/mode-html_ruby.js'))
    // ace.config.setModuleUrl('ace/mode/ini', require('file-loader!ace-builds/src-noconflict/mode-ini.js'))
    // ace.config.setModuleUrl('ace/mode/io', require('file-loader!ace-builds/src-noconflict/mode-io.js'))
    // ace.config.setModuleUrl('ace/mode/jack', require('file-loader!ace-builds/src-noconflict/mode-jack.js'))
    // ace.config.setModuleUrl('ace/mode/jade', require('file-loader!ace-builds/src-noconflict/mode-jade.js'))
    // ace.config.setModuleUrl('ace/mode/java', require('file-loader!ace-builds/src-noconflict/mode-java.js'))
    ace.config.setModuleUrl('ace/mode/javascript', require('ace-builds/src-noconflict/mode-javascript.js'))
    ace.config.setModuleUrl('ace/mode/json', require('ace-builds/src-noconflict/mode-json.js'))
    // ace.config.setModuleUrl('ace/mode/jsoniq', require('file-loader!ace-builds/src-noconflict/mode-jsoniq.js'))
    // ace.config.setModuleUrl('ace/mode/jsp', require('file-loader!ace-builds/src-noconflict/mode-jsp.js'))
    // ace.config.setModuleUrl('ace/mode/jssm', require('file-loader!ace-builds/src-noconflict/mode-jssm.js'))
    // ace.config.setModuleUrl('ace/mode/jsx', require('file-loader!ace-builds/src-noconflict/mode-jsx.js'))
    // ace.config.setModuleUrl('ace/mode/julia', require('file-loader!ace-builds/src-noconflict/mode-julia.js'))
    // ace.config.setModuleUrl('ace/mode/kotlin', require('file-loader!ace-builds/src-noconflict/mode-kotlin.js'))
    // ace.config.setModuleUrl('ace/mode/latex', require('file-loader!ace-builds/src-noconflict/mode-latex.js'))
    // ace.config.setModuleUrl('ace/mode/less', require('file-loader!ace-builds/src-noconflict/mode-less.js'))
    // ace.config.setModuleUrl('ace/mode/liquid', require('file-loader!ace-builds/src-noconflict/mode-liquid.js'))
    // ace.config.setModuleUrl('ace/mode/lisp', require('file-loader!ace-builds/src-noconflict/mode-lisp.js'))
    // ace.config.setModuleUrl('ace/mode/livescript', require('file-loader!ace-builds/src-noconflict/mode-livescript.js'))
    // ace.config.setModuleUrl('ace/mode/logiql', require('file-loader!ace-builds/src-noconflict/mode-logiql.js'))
    // ace.config.setModuleUrl('ace/mode/lsl', require('file-loader!ace-builds/src-noconflict/mode-lsl.js'))
    // ace.config.setModuleUrl('ace/mode/lua', require('file-loader!ace-builds/src-noconflict/mode-lua.js'))
    // ace.config.setModuleUrl('ace/mode/luapage', require('file-loader!ace-builds/src-noconflict/mode-luapage.js'))
    // ace.config.setModuleUrl('ace/mode/lucene', require('file-loader!ace-builds/src-noconflict/mode-lucene.js'))
    // ace.config.setModuleUrl('ace/mode/makefile', require('file-loader!ace-builds/src-noconflict/mode-makefile.js'))
    ace.config.setModuleUrl('ace/mode/markdown', require('ace-builds/src-noconflict/mode-markdown.js'))
    // ace.config.setModuleUrl('ace/mode/mask', require('file-loader!ace-builds/src-noconflict/mode-mask.js'))
    // ace.config.setModuleUrl('ace/mode/matlab', require('file-loader!ace-builds/src-noconflict/mode-matlab.js'))
    // ace.config.setModuleUrl('ace/mode/maze', require('file-loader!ace-builds/src-noconflict/mode-maze.js'))
    // ace.config.setModuleUrl('ace/mode/mel', require('file-loader!ace-builds/src-noconflict/mode-mel.js'))
    // ace.config.setModuleUrl('ace/mode/mixal', require('file-loader!ace-builds/src-noconflict/mode-mixal.js'))
    // ace.config.setModuleUrl('ace/mode/mushcode', require('file-loader!ace-builds/src-noconflict/mode-mushcode.js'))
    // ace.config.setModuleUrl('ace/mode/mysql', require('file-loader!ace-builds/src-noconflict/mode-mysql.js'))
    // ace.config.setModuleUrl('ace/mode/nix', require('file-loader!ace-builds/src-noconflict/mode-nix.js'))
    // ace.config.setModuleUrl('ace/mode/nsis', require('file-loader!ace-builds/src-noconflict/mode-nsis.js'))
    // ace.config.setModuleUrl('ace/mode/objectivec', require('file-loader!ace-builds/src-noconflict/mode-objectivec.js'))
    // ace.config.setModuleUrl('ace/mode/ocaml', require('file-loader!ace-builds/src-noconflict/mode-ocaml.js'))
    // ace.config.setModuleUrl('ace/mode/pascal', require('file-loader!ace-builds/src-noconflict/mode-pascal.js'))
    // ace.config.setModuleUrl('ace/mode/perl', require('file-loader!ace-builds/src-noconflict/mode-perl.js'))
    // ace.config.setModuleUrl('ace/mode/pgsql', require('file-loader!ace-builds/src-noconflict/mode-pgsql.js'))
    ace.config.setModuleUrl('ace/mode/php', require('ace-builds/src-noconflict/mode-php.js'))
    // ace.config.setModuleUrl('ace/mode/php_laravel_blade', require('file-loader!ace-builds/src-noconflict/mode-php_laravel_blade.js'))
    // ace.config.setModuleUrl('ace/mode/pig', require('file-loader!ace-builds/src-noconflict/mode-pig.js'))
    // ace.config.setModuleUrl('ace/mode/plain_text', require('file-loader!ace-builds/src-noconflict/mode-plain_text.js'))
    // ace.config.setModuleUrl('ace/mode/powershell', require('file-loader!ace-builds/src-noconflict/mode-powershell.js'))
    // ace.config.setModuleUrl('ace/mode/praat', require('file-loader!ace-builds/src-noconflict/mode-praat.js'))
    // ace.config.setModuleUrl('ace/mode/prolog', require('file-loader!ace-builds/src-noconflict/mode-prolog.js'))
    // ace.config.setModuleUrl('ace/mode/properties', require('file-loader!ace-builds/src-noconflict/mode-properties.js'))
    // ace.config.setModuleUrl('ace/mode/protobuf', require('file-loader!ace-builds/src-noconflict/mode-protobuf.js'))
    // ace.config.setModuleUrl('ace/mode/puppet', require('file-loader!ace-builds/src-noconflict/mode-puppet.js'))
    // ace.config.setModuleUrl('ace/mode/python', require('file-loader!ace-builds/src-noconflict/mode-python.js'))
    // ace.config.setModuleUrl('ace/mode/r', require('file-loader!ace-builds/src-noconflict/mode-r.js'))
    // ace.config.setModuleUrl('ace/mode/razor', require('file-loader!ace-builds/src-noconflict/mode-razor.js'))
    // ace.config.setModuleUrl('ace/mode/rdoc', require('file-loader!ace-builds/src-noconflict/mode-rdoc.js'))
    // ace.config.setModuleUrl('ace/mode/red', require('file-loader!ace-builds/src-noconflict/mode-red.js'))
    // ace.config.setModuleUrl('ace/mode/redshift', require('file-loader!ace-builds/src-noconflict/mode-redshift.js'))
    // ace.config.setModuleUrl('ace/mode/rhtml', require('file-loader!ace-builds/src-noconflict/mode-rhtml.js'))
    // ace.config.setModuleUrl('ace/mode/rst', require('file-loader!ace-builds/src-noconflict/mode-rst.js'))
    // ace.config.setModuleUrl('ace/mode/ruby', require('file-loader!ace-builds/src-noconflict/mode-ruby.js'))
    // ace.config.setModuleUrl('ace/mode/rust', require('file-loader!ace-builds/src-noconflict/mode-rust.js'))
    // ace.config.setModuleUrl('ace/mode/sass', require('file-loader!ace-builds/src-noconflict/mode-sass.js'))
    // ace.config.setModuleUrl('ace/mode/scad', require('file-loader!ace-builds/src-noconflict/mode-scad.js'))
    // ace.config.setModuleUrl('ace/mode/scala', require('file-loader!ace-builds/src-noconflict/mode-scala.js'))
    // ace.config.setModuleUrl('ace/mode/scheme', require('file-loader!ace-builds/src-noconflict/mode-scheme.js'))
    // ace.config.setModuleUrl('ace/mode/scss', require('file-loader!ace-builds/src-noconflict/mode-scss.js'))
    // ace.config.setModuleUrl('ace/mode/sh', require('file-loader!ace-builds/src-noconflict/mode-sh.js'))
    // ace.config.setModuleUrl('ace/mode/sjs', require('file-loader!ace-builds/src-noconflict/mode-sjs.js'))
    // ace.config.setModuleUrl('ace/mode/slim', require('file-loader!ace-builds/src-noconflict/mode-slim.js'))
    // ace.config.setModuleUrl('ace/mode/smarty', require('file-loader!ace-builds/src-noconflict/mode-smarty.js'))
    // ace.config.setModuleUrl('ace/mode/snippets', require('file-loader!ace-builds/src-noconflict/mode-snippets.js'))
    // ace.config.setModuleUrl('ace/mode/soy_template', require('file-loader!ace-builds/src-noconflict/mode-soy_template.js'))
    // ace.config.setModuleUrl('ace/mode/space', require('file-loader!ace-builds/src-noconflict/mode-space.js'))
    // ace.config.setModuleUrl('ace/mode/sparql', require('file-loader!ace-builds/src-noconflict/mode-sparql.js'))
    // ace.config.setModuleUrl('ace/mode/sql', require('file-loader!ace-builds/src-noconflict/mode-sql.js'))
    // ace.config.setModuleUrl('ace/mode/sqlserver', require('file-loader!ace-builds/src-noconflict/mode-sqlserver.js'))
    // ace.config.setModuleUrl('ace/mode/stylus', require('file-loader!ace-builds/src-noconflict/mode-stylus.js'))
    // ace.config.setModuleUrl('ace/mode/svg', require('file-loader!ace-builds/src-noconflict/mode-svg.js'))
    // ace.config.setModuleUrl('ace/mode/swift', require('file-loader!ace-builds/src-noconflict/mode-swift.js'))
    // ace.config.setModuleUrl('ace/mode/tcl', require('file-loader!ace-builds/src-noconflict/mode-tcl.js'))
    // ace.config.setModuleUrl('ace/mode/terraform', require('file-loader!ace-builds/src-noconflict/mode-terraform.js'))
    // ace.config.setModuleUrl('ace/mode/tex', require('file-loader!ace-builds/src-noconflict/mode-tex.js'))
    // ace.config.setModuleUrl('ace/mode/text', require('file-loader!ace-builds/src-noconflict/mode-text.js'))
    // ace.config.setModuleUrl('ace/mode/textile', require('file-loader!ace-builds/src-noconflict/mode-textile.js'))
    // ace.config.setModuleUrl('ace/mode/toml', require('file-loader!ace-builds/src-noconflict/mode-toml.js'))
    // ace.config.setModuleUrl('ace/mode/tsx', require('file-loader!ace-builds/src-noconflict/mode-tsx.js'))
    // ace.config.setModuleUrl('ace/mode/turtle', require('file-loader!ace-builds/src-noconflict/mode-turtle.js'))
    // ace.config.setModuleUrl('ace/mode/twig', require('file-loader!ace-builds/src-noconflict/mode-twig.js'))
    // ace.config.setModuleUrl('ace/mode/typescript', require('file-loader!ace-builds/src-noconflict/mode-typescript.js'))
    // ace.config.setModuleUrl('ace/mode/vala', require('file-loader!ace-builds/src-noconflict/mode-vala.js'))
    // ace.config.setModuleUrl('ace/mode/vbscript', require('file-loader!ace-builds/src-noconflict/mode-vbscript.js'))
    // ace.config.setModuleUrl('ace/mode/velocity', require('file-loader!ace-builds/src-noconflict/mode-velocity.js'))
    // ace.config.setModuleUrl('ace/mode/verilog', require('file-loader!ace-builds/src-noconflict/mode-verilog.js'))
    // ace.config.setModuleUrl('ace/mode/vhdl', require('file-loader!ace-builds/src-noconflict/mode-vhdl.js'))
    // ace.config.setModuleUrl('ace/mode/wollok', require('file-loader!ace-builds/src-noconflict/mode-wollok.js'))
    // ace.config.setModuleUrl('ace/mode/xml', require('file-loader!ace-builds/src-noconflict/mode-xml.js'))
    // ace.config.setModuleUrl('ace/mode/xquery', require('file-loader!ace-builds/src-noconflict/mode-xquery.js'))
    // ace.config.setModuleUrl('ace/mode/yaml', require('file-loader!ace-builds/src-noconflict/mode-yaml.js'))
    
    // ace.config.setModuleUrl('ace/theme/ambiance', require('file-loader!ace-builds/src-noconflict/theme-ambiance.js'))
    // ace.config.setModuleUrl('ace/theme/chaos', require('file-loader!ace-builds/src-noconflict/theme-chaos.js'))
    // ace.config.setModuleUrl('ace/theme/chrome', require('file-loader!ace-builds/src-noconflict/theme-chrome.js'))
    // ace.config.setModuleUrl('ace/theme/clouds', require('file-loader!ace-builds/src-noconflict/theme-clouds.js'))
    // ace.config.setModuleUrl('ace/theme/clouds_midnight', require('file-loader!ace-builds/src-noconflict/theme-clouds_midnight.js'))
    // ace.config.setModuleUrl('ace/theme/cobalt', require('file-loader!ace-builds/src-noconflict/theme-cobalt.js'))
    // ace.config.setModuleUrl('ace/theme/crimson_editor', require('file-loader!ace-builds/src-noconflict/theme-crimson_editor.js'))
    // ace.config.setModuleUrl('ace/theme/dawn', require('file-loader!ace-builds/src-noconflict/theme-dawn.js'))
    // ace.config.setModuleUrl('ace/theme/dracula', require('file-loader!ace-builds/src-noconflict/theme-dracula.js'))
    // ace.config.setModuleUrl('ace/theme/dreamweaver', require('file-loader!ace-builds/src-noconflict/theme-dreamweaver.js'))
    // ace.config.setModuleUrl('ace/theme/eclipse', require('file-loader!ace-builds/src-noconflict/theme-eclipse.js'))
    // ace.config.setModuleUrl('ace/theme/github', require('file-loader!ace-builds/src-noconflict/theme-github.js'))
    // ace.config.setModuleUrl('ace/theme/gob', require('file-loader!ace-builds/src-noconflict/theme-gob.js'))
    // ace.config.setModuleUrl('ace/theme/gruvbox', require('file-loader!ace-builds/src-noconflict/theme-gruvbox.js'))
    // ace.config.setModuleUrl('ace/theme/idle_fingers', require('file-loader!ace-builds/src-noconflict/theme-idle_fingers.js'))
    // ace.config.setModuleUrl('ace/theme/iplastic', require('file-loader!ace-builds/src-noconflict/theme-iplastic.js'))
    // ace.config.setModuleUrl('ace/theme/katzenmilch', require('file-loader!ace-builds/src-noconflict/theme-katzenmilch.js'))
    // ace.config.setModuleUrl('ace/theme/kr_theme', require('file-loader!ace-builds/src-noconflict/theme-kr_theme.js'))
    // ace.config.setModuleUrl('ace/theme/kuroir', require('file-loader!ace-builds/src-noconflict/theme-kuroir.js'))
    // ace.config.setModuleUrl('ace/theme/merbivore', require('file-loader!ace-builds/src-noconflict/theme-merbivore.js'))
    // ace.config.setModuleUrl('ace/theme/merbivore_soft', require('file-loader!ace-builds/src-noconflict/theme-merbivore_soft.js'))
    ace.config.setModuleUrl('ace/theme/monokai', require('ace-builds/src-noconflict/theme-monokai.js'))
    ace.config.setModuleUrl('ace/theme/pastel_on_dark', require('ace-builds/src-noconflict/theme-pastel_on_dark.js'))
    // ace.config.setModuleUrl('ace/theme/mono_industrial', require('file-loader!ace-builds/src-noconflict/theme-mono_industrial.js'))
    // ace.config.setModuleUrl('ace/theme/solarized_dark', require('file-loader!ace-builds/src-noconflict/theme-solarized_dark.js'))
    // ace.config.setModuleUrl('ace/theme/solarized_light', require('file-loader!ace-builds/src-noconflict/theme-solarized_light.js'))
    // ace.config.setModuleUrl('ace/theme/sqlserver', require('file-loader!ace-builds/src-noconflict/theme-sqlserver.js'))
    // ace.config.setModuleUrl('ace/theme/terminal', require('file-loader!ace-builds/src-noconflict/theme-terminal.js'))
    // ace.config.setModuleUrl('ace/theme/textmate', require('file-loader!ace-builds/src-noconflict/theme-textmate.js'))
    // ace.config.setModuleUrl('ace/theme/tomorrow', require('file-loader!ace-builds/src-noconflict/theme-tomorrow.js'))
    // ace.config.setModuleUrl('ace/theme/tomorrow_night', require('file-loader!ace-builds/src-noconflict/theme-tomorrow_night.js'))
    // ace.config.setModuleUrl('ace/theme/tomorrow_night_blue', require('file-loader!ace-builds/src-noconflict/theme-tomorrow_night_blue.js'))
    // ace.config.setModuleUrl('ace/theme/tomorrow_night_bright', require('file-loader!ace-builds/src-noconflict/theme-tomorrow_night_bright.js'))
    // ace.config.setModuleUrl('ace/theme/tomorrow_night_eighties', require('file-loader!ace-builds/src-noconflict/theme-tomorrow_night_eighties.js'))
    // ace.config.setModuleUrl('ace/theme/twilight', require('file-loader!ace-builds/src-noconflict/theme-twilight.js'))
    // ace.config.setModuleUrl('ace/theme/vibrant_ink', require('file-loader!ace-builds/src-noconflict/theme-vibrant_ink.js'))
    // ace.config.setModuleUrl('ace/theme/xcode', require('file-loader!ace-builds/src-noconflict/theme-xcode.js'))
    // ace.config.setModuleUrl('ace/mode/coffee_worker', require('file-loader!ace-builds/src-noconflict/worker-coffee.js'))
    // ace.config.setModuleUrl('ace/mode/css_worker', require('file-loader!ace-builds/src-noconflict/worker-css.js'))
    // ace.config.setModuleUrl('ace/mode/html_worker', require('file-loader!ace-builds/src-noconflict/worker-html.js'))
    // ace.config.setModuleUrl('ace/mode/javascript_worker', require('file-loader!ace-builds/src-noconflict/worker-javascript.js'))
    // ace.config.setModuleUrl('ace/mode/json_worker', require('file-loader!ace-builds/src-noconflict/worker-json.js'))
    // ace.config.setModuleUrl('ace/mode/lua_worker', require('file-loader!ace-builds/src-noconflict/worker-lua.js'))
    // ace.config.setModuleUrl('ace/mode/php_worker', require('file-loader!ace-builds/src-noconflict/worker-php.js'))
    // ace.config.setModuleUrl('ace/mode/xml_worker', require('file-loader!ace-builds/src-noconflict/worker-xml.js'))
    // ace.config.setModuleUrl('ace/mode/xquery_worker', require('file-loader!ace-builds/src-noconflict/worker-xquery.js'))
    
    // const themes = {pastel_on_dark, monokai}
    // ace.config.set('basePath', '/ace/');
    
    // ace.require('ace/ext/language_tools');
    
    const monokaiTheme = ['php', 'javascript', 'html']
    
    export default {
        name: 'editor',
        props: {
            'editorId': String,
            'content': String,
            'lang': String,
            'theme': String,
        },
        data() {
            return {
                editor: Object,
                beforeContent: '',
            }
        },
        computed: {
            _theme() {
                return this.theme || (monokaiTheme.includes(this.lang)? 'monokai': 'pastel_on_dark')
            },
        },
        methods: {
            getTheme() {
                // return themes[this._theme]
                return `ace/theme/${this._theme}`
            },
        },
        watch: {
            _theme(theme) {
                this.editor.setTheme(`ace/theme/${theme}`);
            },
            lang(lang) {
                // this.editor.getSession().setMode(new modes[lang].Mode()/*`ace/mode/${lang}`*/);
                this.editor.getSession().setMode(`ace/mode/${lang}`);
                this.theme = lang === 'json'? 'pastel_on_dark': 'monokai' 
            },
            content(value) {
                if (this.beforeContent !== value) {
                    this.editor.setValue(value, 1);
                }
            }
        },
        mounted() {
            const lang = this.lang || 'php';
    
            const update = () => {
                this.beforeContent = this.editor.getValue()
                this.$emit('change-content', this.beforeContent)
            };
    
            this.editor = ace.edit(this.editorId);
            if (isDev) {
                window.editor = this.editor;
            }
            
            
            // ace.config.loadModule('ace/ext/language_tools', () => {
            //   this.editor.setOptions({
            //     enableSnippets: true,
            //     enableBasicAutocompletion: true
            //   });
            // });
            
            this.editor.setValue(this.content, 1);
            this.editor.setTheme(this.getTheme());
            // this.editor.getSession().setMode(new modes[lang].Mode()/*`ace/mode/${lang}`*/);
            this.editor.getSession().setMode(`ace/mode/${lang}`);
            
            // this.editor.setTheme(`ace/theme/${theme}`);
            // this.editor.setTheme(`ace/theme/${this._theme}`);
            // this.editor.setTheme(themes[theme]);
    
            this.editor.getSession().on('change', update);
            
            
            this.editor.focus();
            this.editor.setOptions({
                useWorker: false,
                fontSize: '10pt',
                // showLineNumber: true,
                showGutter: true,
                vScrollBarAlwaysVisible: true,
                tabSize: 4,
                useSoftTabs: !true,
            });
        }
    }

</script>

<!--<style lang='less'></style>-->
