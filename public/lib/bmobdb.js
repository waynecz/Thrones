define(['bmob'],function(bmob){

	// Bmob.initialize("8cd52da9c671f4198c6302287cb9da1d", "6609ca0cef00d1c862a5a49eb9653918");
	Bmob.initialize("67fc7d2577fcb80eaf6b281518f1ade8","bec6a4d0f724f120ffb166286f8cbc07")

	function errorCallback(model,error){
		if(error.code == '401'){
			alert("存在相同的记录");
			return;
		}
		alert("操作失败,刷新页面试试");
	}
	function doback(callback,errback){
		return {
			success: callback,
            error: errback || errorCallback
		}
	}

	return {
		save : function(opts){
			var Table = Bmob.Object.extend(opts.table);
			var obj = new Table();
			var data = opts['data'];
			for(key in data){
				var val = data[key];
				if(key == 'order'){
					val = parseInt(val);
				}
				obj.set(key,val);
			}
			obj.save(null, doback(opts.success,opts.error));
		},
		update : function(opts){
			var Table = Bmob.Object.extend(opts.table);
			//根据主键
			var query = new Bmob.Query(Table);
			query.get(opts.id,{
				success : function(obj){
					var data = opts['data'];
					for(key in data){
						var val = data[key];
						if(key == 'order'){
							val = parseInt(val);
						}
						obj.set(key,val);
					}
                    obj.save(null, doback(opts.success));
				},
				error : errorCallback
			});
		},
		get : function(opts){
			var Table = Bmob.Object.extend(opts.table);
			var query = new Bmob.Query(Table);
			query.get(opts.id,doback(opts.success,opts.error))
		},
		increment : function(opts){
			var Table = Bmob.Object.extend(opts.table);
			var query = new Bmob.Query(Table);
			query.get(opts.id,{
				success : function(obj){
					obj.increment(opts.field);
					obj.save();
				},
				error : errorCallback
			});
		},
		list : function(opts){
			var Table = Bmob.Object.extend(opts.table);
			var query = new Bmob.Query(Table);
			console.log(query);
			//一次性列出
			query.limit(10000);
			//拿到所有的相同的字段
			var equals = opts.equals;
			for(var key in equals){
				query.equalTo(key, equals[key]);
			}

			//拿到所有的不相等的字段
			var notEquals = opts.notEquals;
			for(var key in notEquals){
				query.notEqualTo(key, notEquals[key]);
			}

			//greaterThan
			var greater = opts.greater;
			for(var key in greater){
				query.greaterThan(key, greater[key]);
			}

			//lessThan
			var lesser = opts.lesser;
			for(var key in lesser){
				query.lessThan(key, lesser[key]);
			}

			//sort
			var sort = opts.sort || 'xx';
			if(sort.charAt(0) == '-'){
				query.descending(sort.slice(1));
			}
			else if(sort.charAt(0) == '+'){
				query.ascending(sort.slice(1));
			}
			query.find(doback(opts.success));
		},
		query : function(){

		},
		delete : function(){

		},
		cancel : function(){

		}
	}

});