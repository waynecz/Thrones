//过滤器
require('../../modules/string');
var cache = require('memory-cache');
var cookie = require('../../modules/cookie');
var print = require('../../modules/print');
var template = require('art-template');
var fs = require('fs');
exports.filterAdmin = function(req,res,next){

}

exports.filterLogin = function(req,res,next){
    if(isWhiteListUrl(req)){
        return next();
    }

    if(req.originalUrl.startsWith("/signin")){
        //判断是否已经登陆过
        var user =  cookie.getCookieUser(req);
        if(user == null){
            return next();
        }
        //本地缓存有数据
        var loginUser = cache.get(user.username+"."+user.password);
        //跳转到首页,免密码登陆
        if(loginUser!=null && loginUser.remember){
            return res.redirect("/index");
        }
        //继续登陆
        return next();
    }
    judgeFromCookie(req,res,next);
}



//页面中间件
exports.renderFilter = function(req,res,next){
    if(req.method != 'GET'){
        return next();
    }
    var originalUrl = req.originalUrl;
    var layout = "";
    if(originalUrl.startsWith("/admin")){
        layout = "admin";
    }
    else{
        layout = "home";
    }
    res.renderPage = function(screenPage,screeData,extraDataOrLayout,selfLayout){
        print.warn('请求页面:' + screenPage);
        var data = screeData || {};
        extra = extraDataOrLayout || {};
        if(typeof extraDataOrLayout == 'string'){
            layout = extraDataOrLayout;
            extraDataOrLayout = {};
        }
        else if(selfLayout){
            layout = selfLayout;
        }
        var basedir = 'views/screen';
        var page = screenPage.slicePrefix("/admin/","/admin",'/');
        var checkfile = basedir + '/' + layout + '/' + page;
        var file =  checkfile + ".html";
        fs.stat(file,function(err){
            if(err){
                print.ps("找不到" + file);
                return res.redirect("/404");
            }
            var contents = template(checkfile,data);
            if(contents.startsWith("{Template Error}")){
                return res.redirect("/500");
            }
            print.ps("layout:?,page:?".format(layout,page));
            res.render(layout,{'contents':contents,'extra':extraDataOrLayout,'page':page});
        });
    }
    next();
}



//所有白名单
function isWhiteListUrl(req){
    var url = req.originalUrl;
    return url.startsWith("/signup","/messages/","/data",'/admin',"/404","/500");
}


function judgeFromCookie(req,res,next){
    var cookieUser = cookie.getCookieUser(req);
    if(cookieUser == null){
        return res.render("error",{"message":"请登录"});
    }
    if(cache.get(cookieUser.username+"."+cookieUser.password) == null){
        return res.render("error",{"message":"请登录"});
    }
    return next();
}