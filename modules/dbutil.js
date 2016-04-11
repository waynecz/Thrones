
var template = require('art-template');
require('./art_templtate_db_helper')(template);
var xmldoc = require('xmldoc');
var fs = require('fs');
var cache = require('memory-cache');
var util = {
	exec : function(db,model,method,param,callback){
		var path = 'dbmodel/mapper/'+ model+'.xml';
		//先读缓存
		var cacheSql = cache.get(path);
		var presql = cacheSql;
		if(!cacheSql){
			if(!fs.existsSync(path)){
				callback(new Error("mapper不存在"),0);
				return;
			}
			var presqlfile = fs.readFileSync(path,{encoding:"utf-8"});
			var document = new xmldoc.XmlDocument(presqlfile);
			var methodEle = document.childWithAttribute("id",method);
			if(!methodEle || !methodEle.val){
				callback(new Error(model+"的"+method+"方法未定义"),0);
				return;
			}
			var presql = document.childWithAttribute("id",method).val;
			//写入缓存
			cache.put(path,presql,1000 * 60 * 5);
		}
		var sql = template.compile(presql,{compress:true,escape:false})(param);
		db.driver.execQuery(sql,callback); 
	},
	query : function(db,model,method,param,callback){
		util.exec(db,model,method,param,function(err,data){
			if(err){
				callback(err);
				return;
			}
			if(data.length == 1 && util.countEle(data[0]) == 1){
				data = util.getFirstEle(data[0]);
			}
			callback(err,data);
		});
	},
	insert : function(db,model,method,param,callback){
		util.exec(db,model,method,param,function(err,data){
			if(err){
				callback(err);
				return;
			}
			var id = data.insertId || -1;
			callback(err,id);
		});
	},
	update : function(db,model,method,param,callback,param){
		util.exec(db,model,method,param,function(err,data){
			if(err){
				callback(err);
				return;
			}
			if(data.length == 1 && util.countEle(data[0]) == 1){
				data = util.getFirstEle(data[0]);
			}
			callback(err,data);
		});
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
		if(typeof o == "object"){
			for(var i in o){
				return o[i];
			}
		}
		return -1;
	}
}
module.exports = util;