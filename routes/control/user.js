var md5 = require('../../modules/md5');

exports.showSignup = function(req,res){
    res.render("login",{"page":"signup"});
}
exports.showSignin = function(req,res){
    res.render("login",{"page":"signin"});
}
exports.signin = function(req,res){
    md5.resetRequestPassword(req);
    //查询
    req.models.user.login(req.body)
        .then(function(user){
            if(user == null){
                return ajax.failure(res,"用户名或密码错误");
            }
            doLogin(user,res);
            return ajax.success(res,"登陆成功");
        });
}
exports.signup = function(res,res){
    md5.resetRequestPassword(req);
    req.body.status = 1; //默认激活
    req.body.role = '01'; //默认普通用户角色
    //判断部门是否存在
    req.models.department.get({id:req.body.dept})
        .then(function(department){
            if(department == null){
                return ajax.failure(res,"部门不存在");
            }
            return Promise.resolve();
        })
        .then(function(){
            return req.models.user.add(req.body);
        })
        .then(function(id){
            if(id > 0){
                return ajax.success(res, "用户注册成功");
            }
            return ajax.failure(res, "用户注册失败,请联系管理员");
        });
}



//用户列表
exports.list = function(req,res){


    res.renderPage('user');
}
//添加用户
exports.update = function(req,res){

}
//禁用用户
exports.forbid = function(req,res){

}
//修改用户
exports.update = function(req,res){

}