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

            obj[method] = (function(oName,method){
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
                                dbutil.query(db,oName,method,param,resolve,reject,res);
                                break;
                            case "insert":
                                if(param.length > 0){
                                    param['uuid'] = generateUUID();
                                }
                                //先判断唯一值
                                if(((db.models)[oName]).hasOwnProperty("isUnique")){
                                    var model = db.models[oName];
                                    model.isUnique(param).then(function(data){
                                        dbutil.insert(db,oName,method,param,resolve,reject,res);
                                    },function(err){
                                        if(res){
                                            return ajax.failure(res,err);
                                        }
                                        return reject(err);
                                    });
                                }
                                else{
                                    dbutil.insert(db,oName,method,param,resolve,reject,res);
                                }
                                break;
                            case "update":
                                dbutil.update(db,oName,method,param,resolve,reject,res);
                                break;
                            case "delete":
                                dbutil.delete(db,oName,method,param,resolve,reject,res);
                                break;
                            default :
                                break;
                        }        
                    });
                }
            })(oName,method);
        });
        
        (db.models)[oName] = obj;
    }
    console.log("init model end "+new Date().toString());

    function generateUUID(){
        var seq = 'abcdefghijklmnopqrstuvwxyz1234567890012346789zyxwutrqponmlkjihgfedcba';
        var result = '';
        for(var i = 0;i<8;i++){
            result += Math.floor(Math.random() * (seq.length - 1));
        }
        return result;
    }
}