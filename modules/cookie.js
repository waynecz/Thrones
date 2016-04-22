var md5 = require('./md5');
var cache = require('memory-cache');
var print = require('./print');
var dateutil = require('./date');
module.exports = {
    setCookie : function(res,user){
        var maxAge = 24 * 60 * 60 * 1000
        var effectTime = dateutil.gapTime('now',maxAge,'ms');
        var opts = {
            maxAge : maxAge / 1000,
            HttpOnly : true,
            path : "/"
        }
        var key = String.random(12);
        cache.put(key,user,maxAge);
        res.setHeader('Set-Cookie',this.makeCookie(this.getEncodeCookieName(),key,opts));
        //并保存到mysql
        var db = require('../database/mysql').db();
        db.models.session.add({
            'mkey' : key,
            'user_id' : user.id,
            'name' : user.name,
            'gmt_effect' : effectTime
        });
    },
    remove : function(req){
        var key = this.getCookieValue(req,this.getEncodeCookieName());
        cache.del(key);
        req.models.session.delete({'mkey':key});
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
    loginUser : function(req){
        var key = this.getCookieValue(req,this.getEncodeCookieName());
        if(key){
            return cache.get(key);
        }
        return false;
    },
    role : function(req){
        var user = this.loginPage(req);
        if(user){
            return user.role;
        }
        return null;
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
    },
    init : function(db){
        db.models.session.all().then(this.setCache);
    },
    setCache : function(cookies){
        for(var i in cookies){
            var item = cookies[i];
            var effectTime = dateutil.bettweenTime('now',item.gmt_effect);
            cache.put(item.mkey,item,effectTime);
        }
    }
}