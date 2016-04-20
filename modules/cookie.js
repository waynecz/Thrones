var md5 = require('./md5');
var cache = require('memory-cache');
var print = require('../modules/print');
module.exports = {
    setCookie : function(res,user){
        var opts = {
            maxAge : "1000",
            HttpOnly : true,
            path : "/"
        }
        var key = md5.md5(user.username + "" + user.password);
        cache.put(key,user);
        res.setHeader('Set-Cookie',this.makeCookie(this.getEncodeCookieName(),key,opts));
    },
    parseCookie : function(cookie){
        var cookies = {};
        if(!cookie){
            return cookies;
        }
        var list = cookie.split(';');
        for(var i in list){
            var pair = list[i].split("=");
            cookies[pair[0].trim()] = pair[1];
        }
        return cookies;
    },
    getCookieValue : function(req,name){
        return this.parseCookie(req.headers.cookie)[name] || null;
    },
    isLogin : function(req){
        var info = this.getCookieValue(req,this.getEncodeCookieName());
        if(info){
            return cache.get(info);
        }
        return false;
    },
    makeCookie : function(name,val,opt){
        var pairs = [name + '=' + val];
        opt = opt || {};
        if(opt.maxAge){
            pairs.push('Max-Age=' + opt.maxAge);
        }
        if(opt.domin){
            pairs.push('Domin=' + opt.domin);
        }
        if(opt.path){
            pairs.push('Path=' + opt.path);
        }
        if(opt.expires){
            pairs.push('Expires=' + opt.expires.toUTCString());
        }
        if(opt.httpOnly){
            pairs.push('HttpOnly');
        }
        if(opt.secure){
            pairs.push('Secure');
        }
        return pairs.join(';');
    },
    getEncodeCookieName : function(){
        return md5.encode("cookie-username");
    }
}