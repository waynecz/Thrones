var express = require('express');
var router = express.Router();
var ajax = require('../modules/ajax');
var md5 = require('../modules/md5');
var Promise = require('bluebird');
var cookie = require('../modules/cookie');
/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Express' });
});


router.get('/cookie',function(req,res){
    console.log(req.headers.cookie);
    cookie.setCookie(res,{"username":"zhangsan2","password":"123456"});
    res.render("index")
});

router.post('/login',function(req,res){
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
});


router.post('/regist',function(req,res){
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
});
function doLogin(user,res){
    res.setHeader('Set-Cookie','test_cookie="001","language=javascript";')
}




function cb(req,res){
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
router.post("/data/:model/:operation",cb);
router.get("/data/:model/:operation",cb);


module.exports = router;


		