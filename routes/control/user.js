var md5 = require('../../modules/md5');
var Promise = require('bluebird');
var ajax = require('../../modules/ajax');
var cookie = require('../../modules/cookie');
var app = require('express')();
var print = require('../../modules/print');


exports.loginPage = function(req,res){
    res.renderPage("login",{"page":"login"}, "login");
};
exports.pending = function(req,res){
    res.renderPage("pending",{"page":"pending"});
};


exports.signin = function(req,res){
    md5.resetRequestPassword(req);
    //查询
    req.models.user.login(req.body)
        .then(function(userInfo){
            if(userInfo == null){
                return ajax.failure(res,"用户名或密码错误");
            }
            app.locals.user = userInfo;
            print.ps(app.locals);
            cookie.setCookie(res,userInfo);
            return ajax.success(res,"登陆成功");
        });
};
exports.signup = function(req,res){
    md5.resetRequestPassword(req);
    console.log(req.body);
    req.body.status = 1; //默认激活
    req.body.role = 'R01'; //默认普通用户角色
    console.log(req.body);
    //判断部门是否存在
    req.models.department.get({id:req.body.department_id})
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
        },function(e){
            return ajax.failure(res,e);
        });
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

exports.sysuser = function(req,res){
    req.models.user.queryByRole()
        .then(function(data){
            var result = {'online':100};
            for(var i in data){
                result[data[i].role] = data[i].total;
            }
            return ajax.success(res,result);
        });
}
