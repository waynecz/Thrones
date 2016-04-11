var xmldoc = require('xmldoc')
var template = require('art-template')
require('../modules/art-template-db-helper')(template)
var fs = require('fs');
var cache = require('memory-cache');
var ajax = require('../modules/ajax');
var settings = require('../config/jdbc');
var util = {
	exec : function(db,model,method,param,cb,res,deal){
		console.log(res);
		var key = model + "." + method;
		//先读缓存
		var cacheSql = cache.get(key);
		if(settings.debug){
			console.log("读取模板" + key)
		}
		var presql = cacheSql;
		if(!cacheSql){
			var path = 'database/mapper/'+ model+'.xml';
			if(!fs.existsSync(path)){
				cb(new Error("mapper不存在"),0);
				return;
			}
			var presqlfile = fs.readFileSync(path,{encoding:"utf-8"});
			var document = new xmldoc.XmlDocument(presqlfile);
			var methodEle = document.childWithAttribute("id",method);
			if(!methodEle || !methodEle.val){
				cb(new Error(model+"的"+method+"方法未定义"),0);
				return;
			}
			var presql = document.childWithAttribute("id",method).val;
			//写入缓存
			cache.put(key,presql,1000 * 60 * 5);
		}
		if(settings.debug && settings.showTemplateSql){
			console.log("DEBUG:模板SQL");
			console.log(presql);
		}
		var sql = template.compile(presql,{compress:true,escape:false})(param);
		if(settings.debug && settings.showSql){
			console.log("DEBUG:执行SQL");
			console.log(sql);
		}
		db.query(sql,function(err,data){
			//查询失败
			if(err){
				if(settings.debug){
					console.log("数据操作失败");
					console.log(err);
				}
				if(res){
					return ajax.return(err,null,res);
				}
				return cb(err);
			}

			//调用回调方法处理MYSQL返回结果
			if(settings.debug){
				console.log("执行结果:")
				console.log(data)
			}
			data = deal(data);
			if(settings.debug){
				console.log("处理结果:")
				console.log(data)
			}
			if(method == "isUnique" && data > 0){
				var msg = param.unique_msg||"存在相同记录";
				if(res){
					return ajax.return(msg,null,res);
				}
				return cb(msg)
			}
			if(res){
				if(method == "isUnique" && data == 0){
					return cb(null);//继续执行添加操作
				}
				return ajax.return(null,data,res);
			}
			return cb(null,data);
		});
	},
	query : function(){
		console.log(arguments[0])
		console.log(arguments[1])
		console.log(arguments[2])
		console.log(arguments[3])
		console.log(arguments[4])
		console.log(arguments[5])
		util.exec.apply(util,util.getArgs(arguments,function(data){
			if(data.length == 1 && util.countEle(data[0]) == 1){
				data = util.getFirstEle(data[0]);
			}
			return data;
		}));
	},
	insert : function(){
		util.exec.apply(util,util.getArgs(arguments,function(data){
			var id = data.insertId || -1;
			return id;
		}));
	},
	update : function(){
		util.exec.apply(util,util.getArgs(arguments,function(data){
			if(data.length == 1 && util.countEle(data[0]) == 1){
				data = util.getFirstEle(data[0]);
			}
			return data;
		}));
	},
	countEle : function(o){
		if(typeof o == "object"){
			var sum = 0;
			for(var i in o){
				sum ++;
			}
			return sum;
		}
		return -1;
	},
	getFirstEle : function(o){
		console.log(o);
		if(typeof o == "object"){
			for(var i in o){
				return o[i];
			}
		}
		return -1;
	},
	getArgs : function(args,other){
		var arr = [];
		for(var i in args){
			arr[i] = args[i];
		}
		if(typeof other != "undefined"){
			arr.push(other);
		}
		return arr;
	}
}
module.exports = util;