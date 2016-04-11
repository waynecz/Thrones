var mysql = require('mysql')
var settings = require('../config/jdbc')
var dbutil = require('./dbutil')
var connection = null
module.exports = {
	//项目启动时执行此方法
	init : function(cb){
		if(connection){
			if(cb){
				return cb(null,db)
			}
			return;
		}
		db = mysql.createConnection(settings.connection())
		db.connect(function(err){
			if(err){
				throw new Error("数据库连接失败")
			}
			connection = db
			db.models = {}
			require('./model/index')(db,dbutil)
			if(cb){
				return cb(null,db)
			}
		})
	},
	//中间件使用此方法
	use : function(cb){
		if(connection){
			return cb(null,connection)
		} 
		init(cb)
	},
	//其它模块获取connection
	db : function(){
		if(connection){
			if(settings.debug){
				console.log("old connection")
			}
			return connection
		}
		if(settings.debug){
			console.log("new connection")
		}
		db = mysql.createConnection(settings.connection())
		db.models = {}
		require('./model/index')(db,dbutil)
		return db;
	}
}	
