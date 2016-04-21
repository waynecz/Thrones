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
    errs : {
        uniqueError : '唯一性错误',
        checkError : '删除时检查错误'
    },
    getExecsql : function(model,method,param){
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
        return sql;
    },
	exec : function(db,model,method,param,resolve,reject,res,ele,deal){

        /*前置操作
         1.如果是删除操作,则进行合法性判断
         2.如果是分页查询操作,则要把查询总量也要返回

         后置数据处理
         1.如果对于非列表查询,则将返回的数据进行处理
         2.如果一对多查询,那么在查询后要处理成一对多的形式

         */
        var beforeMethod = ele.attr.before;
        var args = arguments;
        if(beforeMethod){ //需要前置处理
            //先判断是否存在此方法
            var bean = (db.models)[model];
            if(bean.hasOwnProperty(beforeMethod)){
                bean[beforeMethod](param).then(function(){
                    //继续执行
                    util.justDeal.apply(util,args);
                },function(err){

                    print.ps("前置处理出现错误:");
                    print.ps(err);
                    if(res){
                        return ajax.failure(res,err);
                    }
                    return reject(err);
                });
            }
            else{
                print.error("前置方法未定义");
                return reject("服务器错误");
            }
        }
        else{
            util.justDeal.apply(util,args);
        }
	},
    justDeal : function(db,model,method,param,resolve,reject,res,ele,deal){
        var sql = this.getExecsql(model,method,param);
        db.query(sql,function(err,data){
            //查询失败
            if(err){
                if(settings.debug){
                    print.info("数据操作失败");
                    print.info(err);
                }
                if(res){
                    return ajax.failure(res,"服务器错误");
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
                var msg = e.message;
                switch (msg){
                    case util.errs.uniqueError :
                        if(validate[model] && validate[model].unique) {
                            msg = validate[model].unique;
                        }
                        else{
                            msg = "存在相同记录";
                        }
                        break;
                    case util.errs.checkError:
                        if(validate[model] && validate[model].check) {
                            msg = validate[model].check;
                        }
                        else{
                            msg = "该记录已被关联,无法删除";
                        }
                        break;
                    default :
                        break;
                }
                if(res){
                    return ajax.failure(res,msg);
                }
                return reject(msg);
            }
            if(settings.debug){
                print.info("处理结果:")
                print.info(data)
            }

            if(res){
                return ajax.success(res,data);
            }
            return resolve(data);
        });
    },
	select : function(){
		util.exec.apply(util,util.getArgs(arguments,function(data,method,ele){
            //结果集只有一个元素
            if(data.length == 1 && util.countEle(data[0]) == 1){
                data = util.getFirstEle(data[0]);
            }
            if(method.startsWith("isUnique","unique")){
                if(data > 0){
                    throw new Error(util.errs.uniqueError);
                }
            }
            else if(method.startsWith("isCheck","check")){
                if(data > 0){
                    throw new Error(util.errs.checkError);
                }
            }
            else if(data.length == 1 && !method.contains("pageQuery,all,list") && !ele.attr.child){
                data = data[0];
            }
			else if(data.length == 0){
				return null;
			}
			else if(ele.attr.child){
				var result = [];
				for(var i in data){
					push(result,data[i],ele.attr.child,ele.attr.childName,ele.attr.childId,ele.attr.key);
				}
				data = result;
                if(!method.contains("pageQuery,all,list") && data.length == 1){
                    data = result[0];
                }
			}
			return data;
		}));
	},
	insert : function(){
		util.exec.apply(util,util.getArgs(arguments,function(data,method,ele){
			var id = data.insertId || -1;
			return id;
		}));
	},
	update : function(){
		util.exec.apply(util,util.getArgs(arguments,function(data,method,ele){
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
		util.exec.apply(util,util.getArgs(arguments,function(data,method,ele){
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


function push(arr,item,childColumns,childName,childId,key){
    childName = childName || 'child';
    childId = childId || 'id';
    key = key || 'id';
    if(arr.length == 0){
        if(item[childId]){
            var mchild = [copyBean(item,childColumns)];
            item[childName] = mchild;
        }
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
        if(item[childId]){
            var mchild = [copyBean(item,childColumns)];
            item[childName] = mchild;
        }
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