var md5 = require('../../modules/md5');
var ajax = require('../../modules/ajax');
exports.showSignup = function(req,res){
    res.renderPage("login",{"page":"signup"});
};
exports.showSignin = function(req,res){
    res.renderPage("login",{"page":"signin"});
};

exports.loginPage = function(req,res){
    res.renderPage("login",{"page":"login"}, "login");
};
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
<<<<<<< HEAD
}
=======
};
>>>>>>> 866c12da16fcf0410c9e49d7ef322f10819537e8
exports.signup = function(req,res){
    md5.resetRequestPassword(req);
    req.body.status = 1; //默认激活
    req.body.role = 'R01'; //默认普通用户角色
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
//更改用户密码
exports.password = function(req,res){
    var key = req.body.key;
    if(key != "abc123"){
        return ajax.failure(res,"秘钥不正确");
    }
    if(!req.body.username || !req.body.password){
        return ajax.failure(res,"参数传递不正确");
    }
    md5.resetRequestPassword(req);
    req.models.user.updatePassword(req.body)
        .then(function(){
            return ajax.success(res,"更改成功");
        },function(){
            return ajax.failure(res,"更新失败,请联系开发人员");
        })
}
