define(['jquery'],function($){
	var Tool =  {
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
		                Tool.run(times,period,func,i,fnBack);
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
		    Tool.run(times,period,func,1,fnBack);
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
				var mousePosition = Tool.getMousePosition(e);

				var winPosition = Tool.getElementPosition(container);

				var gapX = mousePosition.x - winPosition.x1;
				var gapY = mousePosition.y - winPosition.y1;
				document.onmousemove = function(event){
					Tool.fnMove(event,container,gapX,gapY);
				}
				document.onmouseup = function(event){
					document.onmousemove = null;
				}
			});
		},
	    fnMove:function (event,container,gapX,gapY){
			var mousePosition = this.getMousePosition(event);
			var posX = mousePosition.x - gapX;
			var posY = mousePosition.y - gapY;
            console.log(mousePosition);
            console.log(posX);
            console.log(posY);
            console.error("xxxxx");
			container.css({
				"left" : posX,
				"top" : posY
			});
		}
	}
	return Tool;
});