var md5 = require('./md5')
var print = require('../modules/print')
module.exports = {
    setCookie : function(res,user){
        var opts = {
            maxAge : "1000",
            HttpOnly : true,
            path : "/"
        }
        res.setHeader('Set-Cookie',this.makeCookie(this.getEncodeCookieName(),user.username + "^^^" + user.password,opts));
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
    getCookieUser : function(req){
        var info = this.getCookieValue(req,this.getEncodeCookieName());
        if(info == null){
            return null;
        }
        print.ps(info,"&");
        var realInfo = md5.decode(info);
        print.ps(realInfo,'#');
        var index = realInfo.indexOf("^^^");
        if(index > -1){
            if(realInfo.length == (index + 3)){
                return null;
            }
            return {"username":realInfo.slice(0,index),"password":realInfo.slice(index+3)};
        }
        return null;
    },
    makeCookie : function(name,val,opt){
        var pairs = [name + '=' + md5.encode(val)];
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