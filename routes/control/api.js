var ajax = require('../../modules/ajax');
var print = require('../../modules/print');
var Promise = require('bluebird');
exports.data = function(req,res){

    print.ps("原始URL: " + req.originalUrl);
    //获取table
    var _table = req.params.model;
    var _method = req.params.operation;

    var model = (req.models)[_table];
    if(!model){
        print.ps("找不到对应的模块: " + _table);
        return ajax.failure(res,"非法请求");
    }
    if(!model[_method]){
        print.ps("找不到对应的方法:" + _method);
        return ajax.failure(res,"非法请求");
    }
    var param = req.query;
    if(req.method == "POST"){
        param = req.body;
    }

    //如果是分页查询,那么会自动的去做一些处理
    if(_method == "pageQuery"){
        var _total = 0;
        var page = param.page || 1;
        var pageSize = param.pageSize  || 10;
        //查询总量
        var _countMethod = "pageCount";
        if(!model[_countMethod]){
            //只查结果
            model[_method](param).then(function(data){
                print.ps(data);
                //返回数据信息
                var result = {
                    total : 1,
                    data : data
                };
                return ajax.success(res,result);
            });
        }
        else{
            model[_countMethod](param)
                .then(function(total){
                    //这里会拿到数量信息
                    if(total == 0){
                        //返回空
                        ajax.success(res,{
                            total : 0
                        });
                        return Promise.reject();
                    }
                    _total = total;
                    return Promise.resolve();
                })
                .then(function(){
                    //注入相关参数
                    param.offset = (page - 1) * pageSize;
                    param.pageSize = pageSize;
                    model[_method](param).then(function(data){
                        print.ps(data);
                        //返回数据+分页信息
                        var result = {
                            total : _total,
                            pageSize : pageSize,
                            page : page,
                            data : data
                        };
                        return ajax.success(res,result);
                    });
                },function(){
                    print.ps("没有数据哟");
                })
        }


    }
    else{
        model[_method](param)
            .then(function(data){
                ajax.success(res,data);
            },function(e){
               ajax.failure(res,e || "操作失败");
            });
    }
}


exports.page = function(req,res,next){
    var page = req.params.page;

    var file = "views/screen/admin/"+page+".html";

    fs.stat(file,function(err){
        if(err){
            return res.redirect("/404");
        }
    });

    var contents = template('views/screen/admin/'+page,{});
    if(contents.startsWith("{Template Error}")){
        return res.redirect("/404");
    }
    res.render('admin/index',{'contents':contents});
}