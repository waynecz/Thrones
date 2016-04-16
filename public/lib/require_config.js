// Tell RequireJS where ace is located
require.config({
    urlArgs: "version=" + new Date().getTime(),
    baseUrl : '/js/',
    paths: {
    	'jquery':'../lib/jquery',
        'bmob' : '../lib/bmob-min',
        'template' : '../lib/art_template',
        'tool' : '../lib/plugin/frame/tool',
        'dialog' : '../lib/plugin/frame/dialog',
        'frame' : '../lib/plugin/frame/frame',
        'smartmenu' : '../lib/plugin/menu/smartmenu',
        'select2' : '../lib/select2/select2.min',
        'epiceditor' : '../lib/epiceditor/js/epiceditor.min',
        'parser' : '../lib/epiceditor/js/parser',
        'bmobdb' : '../lib/bmobdb',
        'util' : '../lib/util',
        'ace' : '../lib/ace',
        'editor' : '../lib/editor',
        'pager' : '../lib/pagination/pager',
        'comjax' : '../lib/comjax',
        'mtemplate' : '../lib/mtemplate'
    },
    shim : {
    	'message' : {
    		deps : ['jquery']
    	},
        'bmob' : {
            exports : 'bmob'
        },
        'smartmenu' : {
            deps: ['jquery'],
        },
        'select2' : {
            deps : ['jquery']
        },
        'pager' : {
            deps : ['jquery']
        }
    }

});
