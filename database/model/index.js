var xmldoc = require('xmldoc')
var fs = require('fs')

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
            	return function(param,cb){
                    console.log(param);
                    console.log(cb);

                    var res = null;
                    if(arguments.length == 1 && typeof param == "object"){
                        if(param.hasOwnProperty("domain")){
                            res = param;
                            param = null;
                            cb = null;
                        }
                        else{
                            throw new Error("回调方法不能为空");
                        }
                    }
                    console.log(res == null);
            		if(typeof param == "function"){
                        console.log("param is function");
                        cb = param;
	                    param = null;
	                }
                    console.log(cb);
	                if( cb != null && typeof cb == "object"){
                        console.log("cb is object");
	                	res = cb;
	                	cb = null;
	                }
                    console.log(res == null);
	                switch(operation){
	                    case "select":
                            
	                        dbutil.query(db,oName,method,param,cb,res);
	                        break;
	                    case "insert":
	                    	//先判断唯一值
	                    	dbutil.query(db,oName,"isUnique",param,function(err,data){
	                    		if(err){
	                    			return cb(err);
	                    		}
	                    		console.log("添加");
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