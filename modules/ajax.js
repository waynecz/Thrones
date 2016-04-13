
module.exports = {
	return : function(err,data,res){
		if(err){
			this.failure(res,err);
		}
		else{
			this.success(res,data);
		}
	},
	failure : function(res,err,code){
		var result = {
			code : code || 500,
			errCode : "ERROR",
			message : "服务器错误，请联系开发人员",
<<<<<<< HEAD
			success : 0
=======
			success: false
>>>>>>> 2696466ab4eaaa3da123305e0043107f2a77db11
		};
		var errCodes = ["ER_BAD_NULL_ERROR","ER_DUP_ENTRY"];
		var errMsg = ["信息不全","相关信息重复"];

		if(err && err.code){
			result.errCode = err.code;
			var index = errCodes.indexOf(err.code);
			if(index>-1){
				result.message = errMsg[index];
			}
			res.json(result);
		}
		else{
			if(typeof err == "string"){
				result.message = err;
			}
			else if(err.message){
				result.message = err.message;
			}
			res.json(result);
		}
	},
	success : function(res,data){
		var result = {
			code : 200,
			data : data,
			message : "操作成功",
<<<<<<< HEAD
			success : 1
=======
			success: true
>>>>>>> 2696466ab4eaaa3da123305e0043107f2a77db11
		};
		if(typeof data == "string"){
			result.message = data;
		}
		res.json(result);
	}
}