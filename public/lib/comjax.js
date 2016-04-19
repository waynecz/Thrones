//这里将列出所有select2需要用的数据

define(['jquery','util','mtemplate'],function($,util,mtemplate){
	var comon = {
		getDepartments : function(cb){
			util.jax({
				url : '/data/department/all',
				type : 'post',
				cb : cb
			})
		},
		getRoles : function(cb){
			util.jax({
				url : '/data/role/all',
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
        },
        getApplyTypeFirst : function(cb){
            util.jax({
                url : '/data/apply_type/listByPid',
                type : 'post',
                data : {'pid':0},
                cb : cb
            })
        },
        getApplyTypeSecond : function(cb){
            util.jax({
                url : '/data/apply_type/listByType',
                type : 'post',
                data : {'type':1},
                cb : cb
            })
        },
        searchPage : function(model,modelName,searchParam,renderDefault,cb){
            renderDefault = renderDefault || 1;
            //分页查询
            util.jax({
                'url' : '/data/'+modelName+'/pageQuery',
                'type' : 'post',
                'data' : searchParam,
                'cb' : function(data){
                    var page = data.page;
                    if(data.total == 0){
                        if(renderDefault){
                            comon.renderPage([]); //自动渲染
                        }
                        else{
                            model.renderPageData([]); //人工渲染
                        }
                        pager.showNullMsg();
                    }
                    else{
                        model.pageData = data.data;
                        if(renderDefault){
                            comon.renderPage(data.data,cb); //自动渲染
                        }
                        else{
                            model.renderPageData(data.data); //人工渲染
                        }
                        pager.setTotal(data.total);
                        pager.setPageSize(data.pageSize);
                        pager.goPage(page);
                    }
                    cb && cb();
                }
            });
        },
        renderPage : function(data,cb){
            if(data == null || data.length == 0){
                $("#table_list").hide();
                return;
            }
            var html =  mtemplate.T("temp_model_list",{"models":data});
            $("#lists").html(html);
            cb && cb();
            $("#table_list").show();
        },
        bindDeleteEvent : function(item,modelName,model){
            $(item).each(function(){
                $(this).unbind("click");
                $(this).click(function(){
                    var id = $(this).data('id');
                    $.showConfirm("确定要删除该记录吗?",function(){
                        util.jax({
                            url : '/data/' + modelName + '/delete',
                            data : {id:id},
                            cb : function(){
                                $.showSuccessMessage("删除成功");
                                if(typeof model == "function"){
                                    model && model();
                                }
                                else{
                                    model.search();
                                }
                            }
                        })
                    });

                });
            });
        }
	}

    return comon;
});