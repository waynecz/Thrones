var xmldoc = require('xmldoc')
var template = require('art-template')
require('../modules/art-template-db-helper')(template)
var fs = require('fs');
var cache = require('memory-cache');
var ajax = require('../modules/ajax');
var settings = require('../config/jdbc');
var print = require('../modules/print');
var validate = require('./model/validate');
require('../modules/string');
var util = {
	exec : function(db,model,method,param,resolve,reject,res,ele,deal){
		var key = model + "." + method;
		//先读缓存
		var cacheSql = cache.get(key);
		if(settings.debug){
			print.info("读取模板" + key)
		}
		var presql = cacheSql;
		if(!cacheSql){
			var path = 'database/mapper/'+ model+'.xml';
			if(!fs.existsSync(path)){
				return reject("mapper不存在");
			};
			var presqlfile = fs.readFileSync(path,{encoding:"utf-8"});
			var document = new xmldoc.XmlDocument(presqlfile);
			var methodEle = document.childWithAttribute("id",method)

			if(!methodEle || !methodEle.val){
				return reject(model+"的"+method+"方法未定义");
			}
			var presql = document.childWithAttribute("id",method).val;
			//写入缓存
			cache.put(key,presql,1000 * 60 * 5);
		}
		if(settings.debug && settings.showTemplateSql){
			print.info("DEBUG:模板SQL");
			print.info(presql);
		}
		if(settings.debug){
			print.info("传入参数:");
			print.info(param);
		}
		var sql = '';
		try{
			sql = template.compile(presql,{compress:true,escape:false})(param);
		}
		catch(e){
			print.info("SQL模板编译出错");
			print.info(presql);
			return reject(e);
		}
		
		if(settings.debug && settings.showSql){
			print.info("DEBUG:执行SQL");
			print.info(sql);
		}
		db.query(sql,function(err,data){
			//查询失败
			if(err){
				if(settings.debug){
					print.info("数据操作失败");
					print.info(err);
				}
				return reject(err);
			}

			//调用回调方法处理MYSQL返回结果
			if(settings.debug){
				print.info("执行结果:")
				print.info(data)
			}
            try{
                data = deal(data,method,ele);
            }catch (e){
            	if(res){
            		return ajax.failure(res,e);
            	}
                return reject(e);
            }

			if(settings.debug){
				print.info("处理结果:")
				print.info(data)
			}
			if(method == "isUnique" && data > 0){
				var msg = validate[model].unique;
				if(res){
					return ajax.failure(res,msg);
				}
				return reject(msg);
			}
			else if(method == "isUnique" && data == 0){
				return resolve(0);
			}

			if(res){
				return ajax.success(res,data);
			}

			return resolve(data);
		});
	},
	query : function(){
		util.exec.apply(util,util.getArgs(arguments,function(data,method,ele){
			print.ps(ele);
			if(data.length == 1 && util.countEle(data[0]) == 1){
				data = util.getFirstEle(data[0]);
			}
            else if(data.length == 1 && !method.contains("pageQuery,all,list")){
                data = data[0];
            }
			else if(data.length == 0){
				return null;
			}
			else if(ele.attr.child){
				var result = [];
				for(var i in data){
					push(result,data[i],ele.attr.child,ele.attr.childName,ele.attr.key);
				}
				data = result;
			}
			return data;
		}));
	},
	insert : function(){
		util.exec.apply(util,util.getArgs(arguments,null,function(data){
			var id = data.insertId || -1;
			return id;
		}));
	},
	update : function(){
		util.exec.apply(util,util.getArgs(arguments,null,function(data){
            var affected = data.affectedRows;
            if(affected>0){
                return 1;
            }
            else{
                throw new Error("更新失败");
            }
		}));
	},
	delete : function(){
		util.exec.apply(util,util.getArgs(arguments,null,function(data){
            var affected = data.affectedRows;
            if(affected>0){
                return 1;
            }
            else{
                throw new Error("删除失败");
            }
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
		if(typeof o == "object"){
			for(var i in o){
				return o[i];
			}
		}
		return -1;
	},
	getArgs : function(args,other1,other2){
		var arr = [];
		for(var i in args){
			arr[i] = args[i];
		}
		if(typeof other1 != "undefined"){
			arr.push(other1);
		}
		if(typeof other2 != "undefined"){
			arr.push(other2);
		}
		return arr;
	},
    contains : function(s1,s2){
        if(util.contain(s2,",")){
            var ms = s2.split(",");
            for(var i in ms){
                if(util.contain(s1,ms[i])){
                    return true;
                }
            }
            return false;
        }
        return util.contain(s1,s2);
    },
    contain : function(s1,s2){
        return s1.toLowerCase().indexOf(s2.toLowerCase()) > -1;
    }
}


function push(arr,item,childColumns,childName,key){

    key = key || 'id';
    childName = childName || 'child';
    if(arr.length == 0){
        arr.push(copyBean(item));
        return;
    }
    var flag = false;
    var kindex = 0;
    for(var i in arr){
        var o = arr[i];
        if(o[key] == item[key]){
            flag = true;
            kindex = i;
            break;
        }
    }
    if(flag){
        var oc = arr[kindex];
        var mchild = oc[childName] || [copyBean(oc,childColumns)];
        mchild.push(copyBean(item,childColumns));
        arr[kindex][childName] = mchild;
    }
    else{
        arr.push(copyBean(item));
    }
}

function copyBean(source,keys,includeOrExclude){
    includeOrExclude = includeOrExclude || 'include';
    var keys = keys || '';
    var es = keys.split(',');
    var target = {};
    for(var key in source){
        if(keys == ''){
            target[key] = source[key];
            continue;
        }
        if(includeOrExclude == 'include'){ //只包含keys字段
            if(es.indexOf(key) >= 0){
                target[key] = source[key];
            }
        }
        else{ //剔除keys字段
            if(es.indexOf(key) < 0){
                target[key] = source[key];
            }
        }
    }
    return target;
}
module.exports = util;