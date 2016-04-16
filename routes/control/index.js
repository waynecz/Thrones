require("../../modules/string");
var print = require('../../modules/print');
var util = require('util');
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
    util.inspect(res);
    var url = req.originalUrl;
    res.renderPage(url);
}