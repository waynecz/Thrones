var crypto = require('crypto');
var global_salt = "thrones";
var secret = "thrones_secret";
module.exports =  {
    md5 : function(content){
        var md5 = crypto.createHash('md5');
        md5.update(content);
        return md5.digest('hex');
    },
    encrypt : function(username,password,salt){
        return this.md5(username + '' + password + '' + salt);
    },
    getPassword : function(username,password) {
        return this.encrypt(username, password, global_salt);
    },
    getPasswordFromRequest : function(request){
        return this.getPassword(request.body.username || '',request.body.password || '');
    },
    resetRequestPassword : function(req){
        req.body.password = this.getPasswordFromRequest(req);
    },
    encode : function(data){
        var cipher = crypto.createCipher("aes192", secret);
        var m = cipher.update(data, "utf8", "hex");//编码方式从utf-8转为hex;
        return m + cipher.final("hex");//编码方式从转为hex;
    },
    decode : function(data){
        var decipher = crypto.createDecipher("aes192", secret);
        var m = decipher.update(data, "hex", "utf8");//编码方式从hex转为utf-8;
        return m + decipher.final("utf8");//编码方式从utf-8;
    }
}