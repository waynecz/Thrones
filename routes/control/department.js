var ajax = require('../../modules/ajax');

exports.list = function(req,res){
    res.renderPage("department");
}

exports.add = function(req,res){
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

exports.update = function(req,res){
    var department_id = req.body.id;
    var new_leader = req.body.update_leader;
    var old_leader = req.body.old_leader;

    req.models.department.update(req.body)
        .then(function(){
            //添加新的leader
            req.models.user.update({
                'id' : new_leader, //新leader
                'leader' : department_id //部门
            }).then(function(){
                //删除旧的leader
                req.models.user.update({
                    'id' : old_leader, //旧leader
                    'leader' : 0 //置0
                }).then(function(){
                    return ajax.success(res,"更新成功");
                },function(){
                    return ajax.success(res,"旧leader更新失败");
                })
            },function(){
                return ajax.failure(res,"不存在此负责人");
            });

        },function(e){
            return ajax.failure(res,"更新失败,请联系开发人员");
        });
}