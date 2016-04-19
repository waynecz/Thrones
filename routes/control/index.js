require("../../modules/string");
var print = require('../../modules/print');
var util = require('util');
var os = require('os');

exports.index = function(req,res){
    res.renderPage('index');
}

exports.page404 = function(req,res){
    res.renderPage('error',{"message":"找不到页面了"});
}

exports.page500  = function(req,res){
    res.renderPage('error',{"message":"My God,服务器出错了"});
}

exports.auto = function(req,res,next){
    res.renderPage(req.originalUrl);
}


exports.os = function(req,res,next){
    res.renderPage('os',
        {
            'os':os.platform(),
            'release' : os.release(),
            'uptime' : (os.uptime() / 60 / 60 / 24).toFixed(2) + '天',
            'totalmem' : (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + 'G',
            'freemen' : (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + "G",
            'hostname' : os.hostname(),
            'type' : os.type()
        }
    );
    
    
}