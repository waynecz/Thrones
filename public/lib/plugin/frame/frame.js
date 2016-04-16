define(['jquery','tool'],function($,tool){
	$.extend({
		confirm : function(opts){
			this.params = $.extend({
				msg : "您确定执行该操作吗?",
				title : "温馨提示",
				dragable : true,
				width : 500, //弹出层的宽度
				height : 150, //内容的高度
				showLayer: true, //是否显示遮罩层
				fnSure : null,
				fnCancel : null
			},opts?opts:{});
			var htmlContent = "";
			var r = Math.floor(Math.random() * 100000 + 1);
			htmlContent +=  '<div class="confirm_window" id="win'+r+'">' + 
								'<div class="confirm_window_head">' +
									'<span class="confirm_window_title">'
										+ this.params.title +
									'</span>' + 
									'<span class="mywindow_close_btn" title="关闭"></span>' + 
								'</div>' + 
								'<div class="confirm_window_body">' + 
									'<div class="confirm_window_msg">'+
										'<span class="confirm_icon"></span>' + 
										'<span class="confirm_info_msg">'+this.params.msg+'</span>'+
									'</div>'+
								'</div>'+
								'<div class="confirm_window_foot">' +
									'<span class="confirm_window_cancel mywindow_btn mywindow_btn_cancel btn btn-default btn-sm">' +
										'取消' + 
									'</span>' +
									'<span class="confirm_window_sure mywindow_btn mywindow_btn_sure btn btn-primary btn-sm">' +
										'确定' +
									'</span>' + 
								'</div>' +
							'</div>';
			$(htmlContent).appendTo("body");
			$("#win"+r).find(".confirm_window_head").css("height","30px");
			$("#win"+r).width(this.params.width);
			$("#win"+r).find(".confirm_window_body").height(this.params.height);
			$("#win"+r).find(".confirm_window_msg").css({"height":this.params.height+"px","line-height":this.params.height+"px"});
			var w = $(window).width();
			var l = (w - this.params.width) / 2;
			$("#win"+r).css("left",l);
			var b = $(window).height() - $("#win"+r).outerHeight();
			$("#win"+r).css("top",-$("#win"+r).outerHeight());
			$("#win"+r).show();
			_this = this;
			$("#win"+r).animate({
				"top" : b/2
			},function(){
				//添加遮盖层
				if(_this.params.showLayer){
					$("<div class='cover_layer' id='layer"+r+"'></div>").appendTo("body");
				}
			});
			tool.moveArea($("#win"+r),$("#win"+r).find(".confirm_window_head"));
			$("#win"+r).find(".mywindow_close_btn").click(function(){
				tool.closeWin(r);
			});
			$("#win"+r).find(".confirm_window_cancel").click(function(){
				tool.closeWin(r,_this.params.fnCancel);
			});	
			$("#win"+r).find(".confirm_window_sure").click(function(){
				if(typeof _this.params.fnSure == "function"){
					_this.params.fnSure();
				}
				tool.closeWin(r);
			});
		},
		showConfirm : function(msg,func,flag){
			msg = msg || '您确定执行该操作吗?';
			$.confirm({
				msg : msg,
				fnSure : func,
				"showLayer" : flag
			});
		},
		alert : function(opts){
			this.closeAlert();
			params = $.extend({
				msg : "操作成功",
				width : 400, //弹出层的宽度
				isSuccess : true,
				direction : 'right-bottom',
				fn : null,
				timer : 3000
			},opts?opts:{});
			var len = arguments.length;
			var htmlContent = "";
			var r = Math.floor(Math.random() * 100000 + 1);
			var icon = params.isSuccess ? "alert_icon_success" : "alert_icon_error";
			var borderCls = params.isSuccess ? "mywindow_border_success" : "mywindow_border_error";
			htmlContent +=  '<div class="alert_window ' + borderCls+'" id="win'+r+'">'+
								'<div class="alert_window_head">' +
									'<span class="mywindow_close_btn"></span>'+
								'</div>'+
								'<div class="alert_window_body">'+
									'<div class="alert_window_msg">'+
										'<span class="alert_icon '+icon+'"></span>' + 
										'<span class="alert_info_msg">'+params.msg+'</span>'+
									'</div>'+
								'</div>'+
							'</div>';
			//添加遮盖层
			$(htmlContent).appendTo("body");
			$("#win"+r).width(params.width);
			//位置:
			if(params.direction=="right-bottom"){
				$("#win"+r).css({
					"right" : "5px",
					"bottom" : "5px"
				})
			}
			if(params.direction=="center"){
				var w = $(window).width();
				var h = $(window).height();
				var mW = (w - 400) / 2;
				var mH = (h - $("#win"+r).outerHeight()) / 2;
				$("#win"+r).css({
					"left" : mW + "px",
					"top" : -$("#win"+r).outerHeight() + "px"
				});
				$("#win"+r).show();
				$("#win"+r).animate({
					top : mH
				});
			}
			if(params.direction=="center-top"){
				var w = $(window).width();
				var mW = (w - 400) / 2;
				$("#win"+r).css({
					"left" : mW + "px",
					"top" : -$("#win"+r).outerHeight() + "px"
				});
				$("#win"+r).show();
				$("#win"+r).animate({
					top : 50
				});
			}
			if(params.direction=="right-bottom"){
				$("#win"+r).slideDown();
			}
			
			if(params.fn != null){
				params.fn();
			}
			$("#win"+r).find(".mywindow_close_btn").click(function(){
				$("#win"+r).remove();
				
			});
			setTimeout(function(){
				var glintColor =  params.isSuccess ? "#0E8730" : "#C40000";
				var oldColor =$("#win"+r).css("border-color");
				tool.runTimes(1,10,function(i){
					if(i%2==1){
						$("#win"+r).css("border-color",glintColor);
					}
					else{
						$("#win"+r).css("border-color",oldColor);
					}
				},function(){
					var right = 5,bottom = 5;
					$("#win"+r).animate({
						width : 0,
						height : 0,
						opacity : 0,
						right : right + "px",
						bottom : bottom + "px"
					},'swing',function(){
						$("#win"+r).remove();
					});
				});
			},params.timer);
		},
		success : function(info,fn,direction){
			if(typeof info=="function"){
				fn = info;
				info = "操作成功";
			}
			this.alert({
				msg : info,
				fn : fn,
				direction : direction
			});
		},
		failure: function(errorInfo,func,direction){
			errorInfo = errorInfo || "操作失败";
			this.closeAlert();
			this.alert({
				msg : errorInfo,
				isSuccess : false,
				fn : func,
				direction : direction
			});
		},
		closeAlert : function(){
			$(".alert_window").fadeOut().remove();
		}
	});
});
