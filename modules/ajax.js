
module.exports = {
	return : function(err,data,res){
		if(err){
			this.failure(res,err);
		}
		else{
			this.success(res,data);
		}
	},
	failure : function(res,err){
		var result = {
			message : "服务器错误，请联系开发人员",
			success : 0
		};
		if(typeof err == "string"){
			result.message = err;
		}
		else if(err.message){
			result.message = err.message;
		}
		res.json(result);
	},
	success : function(res,data){
		var result = {
			data : data,
			message : "操作成功",
			success : 1
		};
		if(typeof data == "string"){
			result.message = data;
		}
		res.json(result);
	}
}