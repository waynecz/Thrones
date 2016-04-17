define(['jquery','message'],function($){
	return {
		jax : function(param){
			$.ajax({
				url : param.url,
				type : param.type,
				data : param.data,
				dataType : 'json',
				success : function(e){
					if(!e.success){
						$.showErrorMessage(e.message);
						return;
					}
					if(e.data){
						return param.cb && param.cb(e.data);
					}
					param.cb && param.cb(e);
				},
				error : function(e){
					$.showErrorMessage("服务器错误");
				}
			})
		},
		post : function(url,data,cb){
			this.jax({
				url : url,
				type : 'post',
				data : data,
				cb : cb
			});
		},
		formdata : function(form){
			return $(form).serialize();
		},
		form2param : function(form){
			return this.query2param($(form).serialize(),form);
		},
		query2param : function(s,form){
			var i = s.indexOf("?");
			if(i>-1){
				s = s.slice(i + 1);
			}
			var ts = s.split("&");
			var result = {};
			for(var i in ts){
				var k = ts[i].split("=");
				if(k.length == 2){
					if(k[1] == ""){
						k[1] = $(form).find("input[name="+k[0]+"]").attr("defaultVal") || '';
					}
					result[k[0]] = decodeURIComponent(k[1]);
				}
			}
			return result;
		}
	}
})