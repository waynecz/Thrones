

function Pager(id,opts){
	this.id = id;
	_instance = this;
	this.rules = $.extend({
		pageObj : "pagination",  //实例化Pager的对象名称
		nTotal : 0,   // 总数量
		nCurrentPage : 1, //当前页数
		nPageSize : 10,  //每页显示的数量
		nTheme : 1,  //分页主题
		nItems : 8, //主题2的每页显示的数量
		sPrevFlag : "&larr;", //上一页的显示标志
		sNextFlag : "&rarr;", //下一页的显示标志
		nWidth : 30, //样式大小  1，最大，2 次之  3， 最小
		bPre:true,  // 是否显示前一页导航（默认显示)  
		bNext:true, //是否显示后一页(默认显示)
		bShowTotal:false, //是否显示总页数
		bHide: true,  //如果只有一页数据，是否隐藏分页组件
		sDirection:"center", //分页组件的对其策略left,right,center
		sId:"", //是否锚链接要页面的某个ID处
		bGo:false,//是否前往某个页面
		sGo:"GO", //前往某一页的标志
		sNull:"您查询的数据为空", //没有数据将显示该句话，可以使用HTML
		fnJump:null,   //分页跳转回调方法，传递两个参数，一是要跳转的页码，二是pager对象
		bFirst:true,  //是否由ajax获取第一页
		bJsPage:false, //是否是纯前端分页，没有服务器端
		aJsDatas:null, //设置了前端分页后，必须传递该数据
		fnJsFillData:null, //回调函数，传递分页的数据
		fnNoData:""
	},opts?opts:{});
	this.init();
	if(this.rules.bFirst){
		this.showPage(1);
	}
    else{
        if(this.getTotalPage()==0 && this.rules.fnNoData != null){
            this.rules.fnNoData();
        }
    }
}

Pager.prototype = {
	//初始化分页组件
	init : function(){
		var data = [],
			rules = this.rules,
			pages = this.getTotalPage(),
			curPage = this.getCurrentPage(),
			pagerId = this.id;
		//风格一
		if(rules.nTheme == 1){
			if(curPage==1){
				 //type 为0 表示disabled,type为1表示是可链接，type为2表示为当前页,type:3->input,go
				 //bNum 为-1表示前一页，bNum为1表示下一页，bNum为0表示总页数，bNum为2表示数字
				data.push({"num":rules.sPrevFlag,"type":"0","bNum":-1});
			}
			else{
				data.push({"num":rules.sPrevFlag,"type":"1","bNum":-1});
			}
			if(pages<=10){
				data = this.pushData(data,1,pages);
			}
			else{
				if(curPage<=5){
					data = this.pushData(data,1,7);
					data.push({"num":"···","type":"0"});
					data.push({"num":pages,"type":"1","bNum":"2"});
				}
				else if(curPage>5&&curPage<=7){
					data = this.pushData(data,1,curPage+2);
					data.push({"num":"···","type":"0"});	
					data.push({"num":pages,"type":"1","bNum":"2"});
				}
				else if(curPage>5&&curPage<=pages-4){
					data.push({"num":"1","type":"1","bNum":"2"});
					data.push({"num":"···","type":"0"});
					data = this.pushData(data,curPage-3,curPage+3);
					data.push({"num":"···","type":"0"});
					data.push({"num":pages,"type":"1","bNum":"2"});
				}
				else{
					data.push({"num":"1","type":"1","bNum":"2"});
					data.push({"num":"···","type":"0"});
					data = this.pushData(data,pages-7,pages);
				}
			}
			if(curPage==pages){
				data.push({"num":rules.sNextFlag,"type":"0","bNum":1});
			}
			else{
				data.push({"num":rules.sNextFlag,"type":"1","bNum":1});
			}	
		}
		//风格二
		if(rules.nTheme==2){
			var tempFlag = rules.nItems%2;
			var half = Math.floor(rules.nItems/2);
			if(curPage==1){
				data.push({"num":rules.sPrevFlag,"type":"0","bNum":-1});
			}
			else{
				data.push({"num":rules.sPrevFlag,"type":"1","bNum":-1});
			}
			if(pages<=rules.nItems){
				data = this.pushData(data,1,pages,curPage);
			}
			else{
				if(curPage<=half){
					data = this.pushData(data,1,rules.nItems,curPage);
				}
				else if(curPage>half&&curPage<=pages-half){
					if(tempFlag==0){
						data = this.pushData(data,curPage-half,curPage+half-1);
					}
					if(tempFlag==1){
						data = this.pushData(data,curPage-half,curPage+half);
					}
				}
				else{
					data = this.pushData(data,pages-rules.nItems+1,pages);
				}
			}
			if(curPage==pages){
					data.push({"num":rules.sNextFlag,"type":"0","bNum":1});
				}
			else{
					data.push({"num":rules.sNextFlag,"type":"1","bNum":1});
			}	
		}
		
		if(this.rules.bShowTotal){
			data.push({"num":"共"+pages+"页","type":"0","bNum":0});
		}

		if(this.rules.bGo){
			data.push({"num":"i","type":"3","bNum":-2});
			data.push({"num":"b","type":"3","bNum":-3});
		}
		
		$(this.id).append("<ul class='mypage-list'>");
		var ul = $(this.id).find(".mypage-list").eq(0);
		for(var i=0;i<data.length;i++){
			//获取每个分页页码对象
			var pageObj = data[i];
			//添加一个li
			ul.append("<li class='mypage-li'>");	
			//为刚添加的li添加a标签，并赋予其href及文本值
			if(pageObj.bNum<2){
				$(ul.find(".mypage-li").get(i)).addClass("word");
				if(pageObj.bNum==-1){
					$(ul.find(".mypage-li").get(i)).addClass("prev");
				}
				if(pageObj.bNum==1){
					$(ul.find(".mypage-li").get(i)).addClass("next");
				}
				if(pageObj.bNum==0){
					$(ul.find(".mypage-li").get(i)).addClass("all");
				}
				if(pageObj.bNum==-2){
					$(ul.find(".mypage-li").get(i)).addClass("goinput");
				}
				if(pageObj.bNum==-3){
					$(ul.find(".mypage-li").get(i)).addClass("gobtn");
				}
			}
			else{
				$(ul.find(".mypage-li").get(i)).addClass("num");
			}
			if(pageObj.type==0){
				$(ul.find(".mypage-li").get(i)).addClass("disabled");
				$("<span>"+pageObj.num+"</span>").appendTo(ul.find(".mypage-li").get(i));
			}
			else if(pageObj.type==1){
				var nums = 1;
				if(pageObj.bNum==-1){
					nums = curPage - 1;
				}
				else if(pageObj.bNum==1){
					nums = curPage - 1 + 2;
				}
				else if(pageObj.bNum==2){
					nums = pageObj.num;
				}
				$("<a href='javascript:"+this.rules.pageObj+".showPage("+nums+")'>"+pageObj.num+"</a>").appendTo(ul.find(".mypage-li").get(i));
			}
			else if(pageObj.type==2){
				$(ul.find(".mypage-li").get(i)).addClass("active");
				$("<span>"+pageObj.num+"</span>").appendTo(ul.find(".mypage-li").get(i));
			}
			if(pageObj.num=="i"){
				$("<input>",{"class":"topage go"}).appendTo(ul.find(".mypage-li").get(i));
			}
			else if(pageObj.num=="b"){
				$("<a>",{"class":"pager-search go","text":rules.sGo}).appendTo(ul.find(".mypage-li").get(i));
			}
		}
		var fo = ul.find(".mypage-li").find("span:contains('···')");
		fo.each(function(){
			$(fo).css({"font-size":"20px","border":"none","color":"#BBBBBB","font-family": "微软雅黑"});
		});
		
		var mywidth = this.rules.nWidth;


		$(this.id).find(".mypage-li a").css({width:mywidth+"px",height:mywidth+"px","line-height":mywidth+"px"});
		$(this.id).find(".mypage-li span").css({width:mywidth+"px",height:mywidth+"px","line-height":mywidth+"px"});
		$(this.id).find(".topage").css({width:mywidth+"px",height:mywidth+"px"});
		$(this.id).find(".mypage-li.word a").css({width:"auto"});
		$(this.id).find(".mypage-li.word span").css({width:"auto"});
		var t_num = $(this.id).find(".mypage-li.num a");
		var t_num2 = $(this.id).find(".mypage-li.num span");
		t_num.each(function(index,value){
			var txt = $(this).text();
			var num = parseInt(txt);
			if(txt>100){
				$(this).css({
					"width":mywidth+10
				});
			}
			if(txt>1000){
				$(this).css({
					"width":mywidth+20
				});
			}
		});
		t_num2.each(function(index,value){
			var txt = $(this).text();
			var num = parseInt(txt);
			if(txt>100){
				$(this).css({
					"width":mywidth+10
				});
			}
			if(txt>1000){
				$(this).css({
					"width":mywidth+20
				});
			}
		});

		var t_word = $(this.id).find(".mypage-li.word a");
		t_word.each(function(index,value){
			var w = t_word.eq(index).width()+20;
			if(w<mywidth){
				$(this).css({
					"width":mywidth-20
				});
			}
		});
		if(rules.sDirection=="center"){
			setUlWidth();
		}
		if(rules.sDirection=="right"){
			setUlWidth();
			ul.css("float","right");
		}
		if(rules.sDirection=="left"){
			setUlWidth();
			ul.css("float","left");
		}

		function setUlWidth(){
			var width = 0;
			$(pagerId).find(".mypage-li").each(function(){
				width += $(this).outerWidth(true);
			});
			ul.width(width+30);			
		}
		
		if(pages==0){
			this.showNullMsg();
		}
		_instance = this;
		if(rules.bGo){
			ul.find(".pager-search").click(function(){
				var page = ul.find(".topage").val();
				if(!/^\d+/.test(page)){
					alert("您输入的格式不对哟");
				}
				var totalPage = pages;
				var flag = totalPage-page;//定义一个变量保存两个数的差。小技巧比较
				if(flag<0){
					_instance.showPage(totalPage);
				}
				if(page-1<0){
					_instance.showPage(1);
				}
				if(page>0&&flag>=0){
					_instance.showPage(page);
				}
			});
		}
		if(this.rules.bHide && this.rules.getTotalPage == 1){
			this.hide();
		}
	},
	pushData : function(data,from,to){
		var curPage = this.getCurrentPage();
		for(var i=from;i<=to;i++){
			if(curPage==i){
				data.push({"num":i,"type":"2","bNum":2});
			}
			else{
				data.push({"num":i,"type":"1","bNum":2});
			}	
		}
		return data;
	},
	initDataIndex:function(){
		var args = this.getLocationArgs();
		var page  = args[this.rules.sPageFlag];
		if(page == undefined){
			page = 1;
		}
		$(".data_index").each(function(index,value){
			$(this).text((page-1)*this.getPageSize()-0+index+1);
		});
	},
	setCurrentPage : function(currentPage){
		this.rules.nCurrentPage = currentPage;
	},
	setTotal : function(total){
		this.rules.nTotal = total;
	},
	//获取当前页
	getCurrentPage: function(){
		if(this.rules.nCurrentPage==""){
			return 1;
		}
		return parseInt(this.rules.nCurrentPage);
	},
	showPage : function(page){
		//服务器端分页
		if(!this.rules.bJsPage){
			this.rules.fnJump(page,_instance);
		}
		//单纯的前端分页
		else{
			var startIndex = (parseInt(page)-1)*this.getPageSize();
			var endIndex = startIndex + this.getPageSize();
		    var datas = this.rules.aJsDatas.slice(startIndex,endIndex);
		    this.rules.fnJsFillData(datas);
		    this.goPage(page);
		}
		
	},
	goPage : function(page){
		this.setCurrentPage(page);
		this.refresh();
	},
	//跳转到上一页
	goPrevPage:function(){
		this.goPage(this.getCurrentPage()-1);
	},
	//跳转到下一页
	goNextPage:function(){
		this.goPage(this.getCurrentPage()+1)
	},
	//获取总数量
	getTotalNum:function(){
		return parseInt(this.rules.nTotal);
	},
	//获取总页数
	getTotalPage:function(){
		return Math.ceil(this.rules.nTotal/this.rules.nPageSize);;
	},
	//设置每页数量
	setPageSize:function(pageSize){
		this.rules.nPageSize = pageSize;
	},
	//获取每页数量
	getPageSize:function(){
		return parseInt(this.rules.nPageSize);
	},
	//设置js分页的数据
	setJsPageData:function(data){
		this.rules.aJsDatas = data;
	},
	//获取设置的js分页数据
	getJsPageData:function(){
		return this.rules.aJsDatas;
	},
	//refresh pagenation
	refresh : function(){
		$(this.id).html("");
		this.init();
	},
	//隐藏该分页组件
	hide : function(){
		$(this.id).hide(); 
	},
	//显示该分页组件
	show: function(){
		$(this.id).fadeIn();
	},
    showNullMsg : function(){
        $(this.id).html("<p>"+this.rules.sNull+"</p>");
    }
}


/*
使用方式:

var pager = new Pager("#mypage",{
    nTotal : 100,
    nPageSize : 10,
    nCurrentPage : 4,
    fnJump : function(page,pager){


    }




 */