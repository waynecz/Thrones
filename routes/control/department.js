var ajax = require('../../modules/ajax');

exports.list = function(req,res){
    res.renderPage("department");
}

exports.add = function(req,res){
    req.models.department.add(req.body)
        .then(addLeader,function(err){
            return ajax.failure(res,err);
        });

    function addLeader(id){
        var user_id = req.body.user_id;
        if(user_id){
            req.body.department_id = id;
            req.models.leader.add(req.body)
                .then(function(){
                    return ajax.success(res,"添加成功");
                });
        }
        return ajax.success(res,"添加成功");
    }
}

exports.update = function(req,res){
    var department_id = req.body.id;

    req.models.department.update(req.body)
        .then(updateLeader,function(err){
            return ajax.failure(res,err);
        });

    function updateLeader(){
        req.models.leader.delete({"department_id":department_id});
        req.body.department_id = department_id;
        req.models.leader.add(req.body,res);
    }
}