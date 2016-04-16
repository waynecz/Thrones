define(['jquery','tool'],function($,tool){

	$.fn.dialog = function(opts){
		if(opts == 'hide'){
			$(this).hide();
			$("#layer"+$(this).data('id')).hide();
			return;
		}
		else if(opts == 'show'){
			$(this).show();
			$("#layer"+$(this).data('id')).show();
			return;
		}
		else if(opts == 'remove'){
			$(this).hide();
			$("#layer"+$(this).data('id')).remove();
			return;
		};
		var _default = $.extend({
			width : "400",
			hideFoot : false,  //是否隐藏底部
			ready : null,
			fnSure:null, //点击确定后调用此方法
			fnCancel:null //点击关闭或取消调用该方法
		},opts||{});
		//实例
		var _id = Math.round(Math.random() * 10000000);
		$(this).data("id",_id);
		var _this = $(this);
		var Frame = {
			//初始化
			init : function() {
				if(_default.title){
					_this.find(".mywindow_title").html(_default.title);
				}


				// $(window).scrollTop(–––0);
				_this.width(_default.width);
				
				if(_default.height != "undefined"){
					_this.find(".mywindow_body").height(_default.height);
				}
				
				var w = window.innerWidth;
				var l = (w - _default.width) / 2;
				_this.css("left",l);
				this.open();
				var b = window.innerHeight - _this.height();
				var scrollTop = $(window).scrollTop();
				if(b>0){
					_this.css("top",b/2+scrollTop);
				}
				else{
					_this.css("top",20+scrollTop);
				}
				if(_default.hideFoot){
					_this.find(".mywindow_foot").remove();
				}
				//添加遮盖层
				$("<div class='cover_layer' id='layer"+_id+"'></div>").appendTo("body");
				//绑定关闭事件
				_this.find(".mywindow_close_btn").click(function(){
					Frame.cancel();
				});
				_this.find(".mywindow_sure_btn").click(function(){
					Frame.sure();
				});
				_this.find(".mywindow_cancel_btn").click(function(){
					Frame.cancel();
				});

				tool.moveArea(_this,_this.find(".mywindow_head"));

				_default.ready && _default.ready();
			},
			open :function() {
				_this.show();
			},
			close : function() {
				$("#layer"+_id).remove();
				_this.hide();
				this.unbind();
			},
			sure : function(fun){
				if(typeof _default.fnSure == "function"){
					_default.fnSure(Frame);
				}
				else{
					Frame.close();
				}
			},
			cancel : function(){
				if(typeof _default.fnCancel == "function"){
					_default.fnCancel();
				}
				Frame.close();
			},
			clear : function(){
				var $form = _this.find("form");
				$form.find("input").val("");
				$form.find("textarea").val("");
			},
			unbind : function(){
				_this.find(".mywindow_close_btn").unbind("click");
				_this.find(".mywindow_sure_btn").unbind("click");
				_this.find(".mywindow_cancel_btn").unbind("click");
			},
			setHeight : function(height){
				_this.find(".mywindow_body").height(height);
			}
			
		}
		Frame.init();
	}
});