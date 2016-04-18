//这里将列出所有select2需要用的数据

define(['jquery','util'],function($,util){

	return {
		getDepartments : function(cb){
			util.jax({
				url : '/data/department/byselect2',
				type : 'post',
				cb : cb
			})
		},
		getRoles : function(cb){
			util.jax({
				url : '/data/role/byselect2',
				type : 'post',
				cb : cb
			})
		},
        getUsers : function(cb){
            util.jax({
                url : '/data/user/all',
                type : 'post',
                cb : cb
            })
        }
	}

});