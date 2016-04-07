var express = require('express');
var router = express.Router();

var user = {
	addUser : function(req,res,next){
		var data = req.method == 'POST' ? req.body : req.query;
		console.log(data);
		var User = req.models.user;
		User.create(data,function(err,results){
			if(err){
				console.log(err);
				// res.send(err.code);
				res.render('index',{'title':"添加失败"+err.code});
			}
			else{
				// res.send("添加成功");
				res.render('index',{'title':"添加成功"});
			}
		});
	}
}

module.exports = user;
