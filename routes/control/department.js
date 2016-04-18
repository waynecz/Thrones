var ajax = require('../../modules/ajax');

exports.list = function(req,res){
    res.renderPage("department");
}

exports.add = function(req,res){
    var name = req.body.name;
    var leader = req.body.leader;

    req.models.department.add(req.body)
        .then(function(id){
            //更新用户
            req.models.user.update({
                'id' : leader,
                'leader' : id
            }).then(function(){
                return ajax.success(res,"添加成功");
            },function(){
                return ajax.failure(res,"不存在此负责人");
            });



        },function(e){
            return ajax.failure(res,"添加失败,请联系开发人员");
        });
}