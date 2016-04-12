var xmldoc = require('xmldoc')
var fs = require('fs')
var ajax = require('../../modules/ajax')
module.exports = function(db,dbutil){
    
	console.log("start init model "+new Date().toString());
	//遍历mapper目录下的所有文件
	var files = fs.readdirSync('database/mapper');
    
    for(var i in files){
    	console.log(files[i]);
        var presqlfile = fs.readFileSync('database/mapper/'+files[i],{encoding:"utf-8"});
        var document = new xmldoc.XmlDocument(presqlfile);
        //获取根节点的名称,即对象名称
        var oName = "";

        try{
            oName = document.attr.id;
            if(oName == ""){
                console.err("请设置xml所属对象");
            }
        }
        catch(e){
            console.err("请设置xml所属对象");
        }

        var obj = {};
        document.eachChild(function(ele){
            var operation = ele.name;
            var method = "";
            try{
                method = ele.attr.id;
            }
            catch(e){
                console.err("请设置xml节点方法名");
            }

            obj[method] = (function(oName,method){
            	return function(arg0,arg1){
                    //分以下种情况
                    //res
                    //cb
                    //param,res
                    //param,cb

                    var param,cb,res
                    //res
                    if(arguments.length == 1 && arg0.hasOwnProperty("domain")){
                        param = null;
                        cb = null;
                        res = arg0;
                    }
                    //cb
                    else if(arguments.length == 1 && typeof arg0 == "function"){
                        param = null;
                        res = null;
                        cb = arg0;
                    }
                    //param,res
                    else if(arguments.length == 2 && arg1.hasOwnProperty("domain")){
                        if(typeof arg0 == "undefined"){
                           return ajax.failure(arg1,"传入参数为undefined");
                        }
                        param = arg0;
                        res = arg1;
                        cb = null;
                    }
                    //param,cb
                    else if(arguments.length == 2 && typeof arg1 == "function"){
                        if(typeof arg0 == "undefined"){
                            return ajax.failure(arg1,"传入参数为undefined");
                        }
                        param = arg0;
                        cb = arg1;
                        res = null;
                    }

	                switch(operation){
	                    case "select":
	                        dbutil.query(db,oName,method,param,cb,res);
	                        break;
	                    case "insert":
	                    	//先判断唯一值
	                    	dbutil.query(db,oName,"isUnique",param,function(err,data){
	                    		if(err){
                                    if(res){
                                        return ajax.failure(res,err);
                                    }
	                    			return cb(err);
	                    		}
	                    		dbutil.insert(db,oName,method,param,cb,res);
	                    	},res);
	                        
	                        break;
	                    case "update":
	                    case "delete":
	                        dbutil.update(db,oName,method,param,cb,res);
	                        break;
	                    default :
	                        break;
	                }	
            	}
            })(oName,method);
        });
        
        (db.models)[oName] = obj;
    }
	console.log("init model end "+new Date().toString());

}