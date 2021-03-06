var xmldoc = require('xmldoc');
var fs = require('fs');
var ajax = require('../../modules/ajax');
var Promise = require('bluebird');
var print = require('../../modules/print')
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
                print.error("请设置xml所属对象");
            }
        }
        catch(e){
            print.error("请设置xml所属对象");
        }

        var obj = {};
        document.eachChild(function(ele){
            var operation = ele.name;
            var method = "";
            try{
                method = ele.attr.id;
            }
            catch(e){
                print.error("请设置xml节点方法名");
            }

            obj[method] = (function(oName,ele){
                var method = ele.attr.id;
                return function(param,res){
                    //简单的讲：只有传入param
                    
                    //可能传入以下几种格式：
                    //0、不传任何参数
                    //1、param
                    //2、res
                    //3、param,res

                    //不传任何参数
                    if(arguments.length == 0){
                        param = {};
                    }   
                    //只传递param
                    else if(arguments.length == 1 && !param.hasOwnProperty("domain")){
                        res = null;
                    }
                    //只传递res
                    else if(arguments.length == 1 && param.hasOwnProperty("domain")){
                        res = param;
                        param = {};
                    }
                    //param,res都传
                    return new Promise(function(resolve,reject){
                        //参数判断
                        if(typeof param != "object"){
                            print.error("开发人员注意了：注入参数类型错误，请传对象");
                            return reject("参数有误");
                        }
                        if(res != null && !res.hasOwnProperty("domain")){
                            print.error("开发人员注意了：参数有误，传递的不是response对象");
                            return reject("参数有误");
                        }

                        switch(operation){
                            case "select":
                            case "insert":
                            case "update":
                            case "delete":
                                dbutil[operation](db,oName,method,param,resolve,reject,res,ele);
                                break;
                            default :
                                print.error("非法标签");
                                break;
                        }        
                    });
                }
            })(oName,ele);
        });
        
        (db.models)[oName] = obj;
    }
    console.log("init model end "+new Date().toString());

    
}