

require(['jquery','util','comjax','mtemplate','pager','select2'],function($,util,comjax,mtemplate){


	var searchParam = {
		page : 1,
		pageSize : 10
	}

	$("#sort").select2({
	  	placeholder: "请选择排序",
	  	allowClear: false,
	  	minimumResultsForSearch: 8
	});


	var pager = new Pager("#mypage",{
		fnJump : function(page,mpager){
            search(page,function(data){
            	if(data.total == 0){
                    renderData([]);
            		mpager.showNullMsg();
            	}
                else{
                    renderData(data.data);
                    mpager.setTotal(data.total);
                    mpager.setPageSize(data.pageSize);
                    mpager.goPage(page);
                }
            });
        }
	});


    //获取部门信息
	comjax.getDepartments(function(data){
		$("#department").select2({
		  	placeholder: "请选择部门",
		  	allowClear: false,
		  	minimumResultsForSearch: 8,
		  	data : data
		});
	});

    //获取角色信息
    comjax.getRoles(function(data){
        $("#role").select2({
            placeholder: "请选择角色",
            allowClear: false,
            minimumResultsForSearch: 8,
            data : data
        });
    });

    


    function search(page,fn){
    	if(typeof page == "number"){
    		searchParam.page = page;
    	}
    	else{
    		fn = page;
    	}
		//分页查询
	    util.jax({
	        'url' : '/data/user/pageQuery',
	        'type' : 'post',
	        'data' : searchParam,
	        'cb' : fn
	    });
    }

    function renderData(data){
        if(data.length == 0){
            $("#table_list").hide();
            return;
        }
       
        var html =  mtemplate.T("temp_user_list",{"users":data});
        $("#lists").html(html);
        $("#table_list").show();
    }


});