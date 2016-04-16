/**
 * 弹出层设计,消息提示框，消息确认框，鼠标划过显示图片，鼠标点击显示图片在中央
 */
function Window(opts){
	this.params = $.extend({
		id : "win_update",
		dragable : false,
		width : 800, //弹出层的宽度
		title : '',
		hideFoot : false,  //是否隐藏底部
		fnSure:null, //点击确定后调用此方法
		fnCancel:null //点击关闭或取消调用该方法
	},opts?opts:{});
	this.id = this.params.id;
	this.r = Math.floor(Math.random() * 100000 + 1);
	this.init();
}
Window.prototype = {
	//初始化
	init : function() {
		var _this = $("#"+this.id);
		if(this.params.title){
			$("#"+this.id).find(".mywindow_title").html(this.params.title);
		}
		// $(window).scrollTop(0);
		_this.width(this.params.width);
		
		if(this.params.height != "undefined"){
			$("#"+this.id).find(".mywindow_body").height(this.params.height);
		}
		
		var w = window.innerWidth;
		var l = (w - this.params.width) / 2;
		_this.css("left",l);
		this.open();
		var b = window.innerHeight - $("#"+this.id).height();
		var scrollTop = $(window).scrollTop();
		if(b>0){
			_this.css("top",b/2+scrollTop);
		}
		else{
			_this.css("top",20+scrollTop);
		}
		if(this.params.hideFoot){
			_this.find(".mywindow_foot").remove();
		}
		//添加遮盖层
		$("<div class='cover_layer' id='layer"+this.r+"'></div>").appendTo("body");
		//绑定关闭事件
		var _win = this;
		_this.find(".mywindow_close_btn").click(function(){
			_win.cancel();
		});
		_this.find(".mywindow_sure_btn").click(function(){
			_win.sure();
		});
		_this.find(".mywindow_cancel_btn").click(function(){
			_win.cancel();
		});

		this.moveArea(_this,_this.find(".mywindow_head"));
	},
	open :function() {
		$("#"+this.id).show();
	},
	close : function() {
		$("#layer"+this.r).remove();
		$("#"+this.id).hide();
		this.unbind();
	},
	sure : function(fun){
		var _win = this;
		if(typeof _win.params.fnSure == "function"){
			_win.params.fnSure(_win);
		}
		else{
			_win.close();
		}
	},
	cancel : function(){
		var _win = this;
		if(typeof _win.params.fnCancel == "function"){
			_win.params.fnCancel();
		}
		else{
			_win.close();
		}
	},
	reset : function(){
		var $form = $("#"+this.id).find("form");
		$form.find("input").val("");
		$form.find("textarea").val("");
	},
	unbind : function(){
		$("#"+this.id).find(".mywindow_close_btn").unbind("click");
		$("#"+this.id).find(".mywindow_sure_btn").unbind("click");
		$("#"+this.id).find(".mywindow_cancel_btn").unbind("click");
	},
	setHeight : function(height){
		$("#"+this.id).find(".mywindow_body").height(height);
	},
	//工具方法
	getElementPosition : function(element) {
	    var arr = [];
	    //把左上角的横坐标压入
	    arr.push(element.offset().left);
	    //把左上角的纵坐标压入
	    arr.push(element.offset().top);
	    //把右下角的横坐标压入
	    arr.push(arr[0]+element.outerWidth());
	    //把右下角的纵坐标压入
	    arr.push(arr[1]+element.outerHeight());
	    return {
	        "x1" : arr[0],
	        "y1" : arr[1],
	        "x2" : arr[2],
	        "y2" : arr[3],
	        "width" : element.outerWidth(),
	        "height" : element.outerHeight()
	    }
	},
	getMousePosition: function(event){
	    event = event || window.event;
	    var x = event.pageX || event.clientX + document.body.scrollLeft;
	    var y = event.pageY || event.clientY + document.body.scrollTop;
	    return {
	        "x" : x,
	        "y" : y
	    }
	},
	isMouseInElementContainer :function (element,event){
	    var elementPosition = this.getElementPosition(element);
	    var mousePosition = this.getMousePosition(event);
	    var x = mousePosition.x,
	        y = mousePosition.y;
	   
	    var flag = x>=elementPosition.x1 && x<=elementPosition.x2 && y>=elementPosition.y1 && y<=elementPosition.y2;
	    return flag;
	},
	run:function(times,period,func,i,fnBack){
	    if(times==-1){
	        setInterval(func,period);
	    }
	    else{
	        if(i==undefined){
	            i = 0;
	        }
	        if(i<times){
	            setTimeout(function(){
	                func(i);
	                i++;
	                Window.prototype.run(times,period,func,i,fnBack);
	            },period);
	        }
	        else{
	        	if(typeof fnBack == "function"){
	        		fnBack(i);
	        	}
	        }
	    }
	},
	//在规定的时间(total)内，周期调用functimes共times次
	runTimes : function(total,times,func,fnBack){
	    var period = (total / times) * 1000;
	    Window.prototype.run(times,period,func,1,fnBack);
	},
	//关闭窗口，传来的是随机值r
	closeWin:function(r){
			var w = $(window).width() / 2;
			var h = $(window).height() / 2;
			$("#win"+r).animate({
				"left" : w + "px",
				"top" : h + "px",
				"width" : 0,
				"height" : 0
			},200,function(){
				$("#win" + r).remove();
				$("#layer" + r).remove();
			});
	},
	moveArea:function (container,dragarea){
		dragarea.css("cursor","move");
		dragarea.mousedown(function(e){
			//获取鼠标与窗口的距离
			var mousePosition = Window.prototype.getMousePosition(e);

			var winPosition = Window.prototype.getElementPosition(container);

			var winX = mousePosition.x - winPosition.x1;
			var winY = mousePosition.y - winPosition.y1;


			document.onmousemove = function(event){
				Window.prototype.fnMove(event,container,winX,winY);
			}
			document.onmouseup = function(event){
				document.onmousemove = null;
			}
		});
	},
    fnMove:function (event,container,winX,winY){
		var mousePosition = Window.prototype.getMousePosition(event);
		var posX = mousePosition.x - winX;
		var posY = mousePosition.y - winY;
//		var winW = window.innerWidth;
//		var winH = window.innerHeight;
//		posX = (posX < 0) ? 0 : ((posX <= winW - container.outerWidth()) ? posX : (winW - container.outerWidth()));
//		posY = (posY < 0) ? 0 : ((posY <= winH - container.outerHeight()) ? posY : (winH - container.outerHeight()));

		container.css({
			"left" : posX,
			"top" : posY
		});
	}
};
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
		Window.prototype.moveArea($("#win"+r),$("#win"+r).find(".confirm_window_head"));
		$("#win"+r).find(".mywindow_close_btn").click(function(){
			Window.prototype.closeWin(r);
		});
		$("#win"+r).find(".confirm_window_cancel").click(function(){
			Window.prototype.closeWin(r,_this.params.fnCancel);
		});	
		$("#win"+r).find(".confirm_window_sure").click(function(){
			if(typeof _this.params.fnSure == "function"){
				_this.params.fnSure();
			}
			Window.prototype.closeWin(r);
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
			Window.prototype.runTimes(1,10,function(i){
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
//全局作用

function previewAndShowImg(){
	console.log("111");
	$(".img_preview").each(function(){
		var img = $(this).attr("data-img");
		$(this).css("cursor","pointer");
		$(this).hover(function(event){
			$.preview(img,event);
		});
	});
	$(".img_show").each(function(){
		$(this).css("cursor","pointer");
		var img = $(this).attr("data-img");
		$(this).unbind("click");
		$(this).click(function(){
			$.showImg(img);
		});
	});
}