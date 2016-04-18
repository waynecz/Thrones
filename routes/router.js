var print = require('../modules/print');

var User       = require('./control/user');
var Role       = require('./control/role');
var Department = require('./control/department');
var Apply      = require('./control/apply');
var Index      = require('./control/index');
var Api        = require('./control/api');
var Filter     = require('./control/filter');

module.exports = function (app) {

    //页面中间件
    app.use(Filter.renderFilter);

    app.get('/', Index.index);

    //前台页面路由:
    app.get('/index', Index.index);

    app.get('/login', User.loginPage);
    app.get('/signin', User.showSignin);
    app.get('/signup', User.showSignup);
    app.post('/signin', User.signin);
    app.post('/signup', User.signup);


    //后台管理路由:
    app.get('/admin/user/list',User.list);
    app.post('/admin/user/password',User.password);
    app.get('/admin/role/list',Role.list);

    app.get('/admin/department/list',Department.list);
    app.post('/admin/department/add',Department.add);
    app.get('/admin/os',Role.list);
    app.get('/admin/me',Role.list);
    app.get('/admin/apply/leaderlist',Apply.leaderlist);
    app.get('/admin/apply/safelist',Apply.safelist);
    app.get('/admin/apply/operationlist',Apply.operationlist);
    app.get('/admin/apply/applylist',Apply.applylist);

    //全局数据请求
    app.post("/data/:model/:operation",Api.data);
    app.get("/data/:model/:operation",Api.data);

    //全局数据请求
    app.post("/data/:model/:operation", Api.data);
    // router.get("/data/:model/:operation",Api.data);


    //错误页面
    app.get('/404', Index.page404);
    app.get('/500', Index.page500);

    // app.get('/kk',function(req,res){
    //     res.renderPage("kk");   //渲染screen/home下的kk.html
    //     res.renderPage("kk",{},"other");  //渲染other(layout)下的kk.html
    // });

    //自动渲染
    // app.get(['/admin/:homePage','/:homePage'],Index.auto);
}
