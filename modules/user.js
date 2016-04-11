var express = require('express');
var router = express.Router();
var orm = require('orm');
var D = require('./D');

var xmldoc = require('xmldoc');
var user = {
	addUser : function(req,res,next){
		var data = req.method == 'POST' ? req.body : req.query;
		var User = req.models.user;
		User.create(data,function(err,results){
			if(err){
				D.jsonReturn(res,err);
			}
			else{
				D.jsonReturn(err,"添加成功",res);
				// res.send("添加成功");
				res.render('index',{'title':"添加成功"});
			}
		});
	},
	listAllDepts : function(req,res){

		var User = req.models.user;

		User.queryAll(req.query,function(err,data){
			D.ajaxReturn(res,err,data);
		});
		// req.db.driver.execQuery("select t1.*,t2.name deptName from user t1 left join department t2 on t1.dept = t2.id",function(err,data){
		// 	D.ajaxReturn(res,err,data);
		// });

		// User.find().eager('department').all(function(err,data){
		// 	D.ajaxReturn(res,err,data);
		// });
		// User.all(function(err,data){
		// 	D.ajaxReturn(res,err,data);
		// });


		// var Dept = req.models.department;

		// var k = Dept.find({	
		// 			name:orm.like('%'+req.query.key+'%')
		// 		}).limit(2).offset(1).find(function(err,data){
		// 			res.send(data);
		// 		});
		// console.log(k);

		// Dept.find({"name":orm.like('%'+req.query.key+'%')}).limit(5).offset(0,function(err,data){
		// 	D.ajaxReturn(res,err,data);
		// });


		// Dept.find({"name":orm.like('%'+req.query.key+'%')},1,function(err,data){
		// 	D.ajaxReturn(res,err,data);
		// });

		// Dept.find({"id":orm.gt(0)},function(err,data){
		// 	D.ajaxReturn(res,err,data);
		// });	

		// Dept.count({"id":req.query.id||1},function(err,data){
		// 	D.ajaxReturn(res,err,data);
		// });	

		// Dept.one({"id":req.query.id||1},function(err,data){
		// 	D.ajaxReturn(res,err,data);
		// });

		// Dept.all(function(err,data){
		// 	D.ajaxReturn(res,err,data);
		// });
	}
}

module.exports = user;
