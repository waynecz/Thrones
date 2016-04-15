var md5 = require('./md5')

module.exports = {
    setCookie : function(res,user){
        var opts = {
            maxAge : "1000",
            HttpOnly : true,
            path : "/"
        }
        res.setHeader('Set-Cookie',this.makeCookie(user.username,user.password,opts));
    },
    parseCookie : function(cookie){
        var cookies = {};
        if(!cookie){
            return cookies;
        }
        var list = cookie.split(';');
        for(var i in list){
            var pair = list[i].split("=");
            cookies[pair[0]] = pair[1];
        }
        return cookies;
    },
    getCookieValue : function(res,name){
        return parseCookie(req.headers.cookie).name || null;
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
    }
}