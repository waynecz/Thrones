// Tell RequireJS where ace is located

//编辑器操作
define(["jquery","ace/ace"],function($,ace){
	var editor = ace.edit('editor');
	editor.session.setOption("useWorker", false);
	editor.setOption("enableEmmet",true);
	var obj = {
		init : function(){
			this.setMode("behaviour");	
			
			this.setReadOnly(false);
			editor.setOption("vScrollBarAlwaysVisible",false);
			editor.setOption("scrollPastEnd",false);
			editor.setOption("showGutter",true);
			editor.getSession().setUseWrapMode(true);
			editor.setShowPrintMargin(false);
			// setUseWrapMode
		},
		setFontSize : function(fontsize,isSync){
			$("#editor").css("font-size",fontsize);
			if(isSync){
				db.setConfig("fontsize",fontsize);
			}
		},
		setTheme : function(theme,isSync){
			editor.setTheme("ace/theme/"+theme);
			if(isSync){
				db.setConfig("theme",theme);
			}
		},
		setMode : function(mode){
			editor.session.setMode("ace/mode/"+mode);
			
			// editor.session.setOption("spellcheck",false);
		},
		getValue : function(){
			return editor.getValue();
		},
		setValue : function(content){
			editor.setValue(content);
		},
		clear : function(){
			this.setValue("");
		},
		setReadOnly : function(flag){
			editor.setReadOnly(flag);
		},
		isReadOnly : function(){
			return editor.getOption("readOnly");
		},
		blur : function(){
			editor.gotoLine(1);
		}
	}

	return obj;
});