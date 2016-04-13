var app = require('express').Router();

var ajax = require('./ajax');
app._get = function(url,page,data){
	app.get(url,function(req,res){
		ajax.page(res,page,data);
	})
}


module.exports = app;