
exports.data = function(req,res){
    //获取table
    var _table = req.params.model;
    var _method = req.params.operation;

    var model = (req.models)[_table];
    if(!model){
        return ajax.failure(res,"非法请求");
    }
    if(!model[_method]){
        return ajax.failure(res,"非法请求");
    }
    var param = req.query;
    if(req.method == "POST"){
        param = req.body;
    }
    model[_method](param,res);
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