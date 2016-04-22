require(['dialog','frame','message']);

define('Leader',['jquery','util','comjax','mtemplate','mselect2','pager'],function($,util,comjax,mtemplate,mselect2){

    var cid = $("#pid").val();
    var searchParam = {
        page : 1,
        pageSize : 10,
        pid : cid
    }

    var Leader = {
        init : function(){
            this.initPager();
            this.bindSearchEvent();
            this.bindAddEvent();
            this.initUserSelect();
        },
        initPager : function(){
            window.pager = new Pager("#mypage",{
                fnJump : function(page){
                    Leader.search(page);
                }
            });
        },
        initUserSelect : function(){
            var departmentId = $("#department_id").val();
            comjax.getUsersByDepartment(departmentId,cid,function(data){
                mselect2.renderWithData("#user",data);
            });
        },
        search : function(page){
            searchParam.name = $("#search_name").val();
            searchParam.page = page || 1;
            comjax.searchPage(Leader,'user',searchParam,true,function(){
                Leader.bindRemoveEvent();
            });
        },
        /*******事件绑定区********/
        bindSearchEvent : function(){
            $("#search_name").on('change',function(){
                Leader.search();
            });

            $("#btn_search").click(function(){
                Leader.search();
            });
        },
        bindAddEvent : function(){

            $("#btn_add").click(function(){
                $("#win_add").dialog({
                    width: 400,
                    fnSure: function(d) {
                        var id = $("#user").val();
                        if(id == ""){
                            $.showErrorMessage("请选择一个用户");
                            return;
                        }
                        var param = {
                            pid : cid,
                            id : id
                        }
                        util.jax({
                            'url' : '/data/user/updatePid',
                            'type' : 'post',
                            'data' : param,
                            'cb' : function(){
                                $.showSuccessMessage("添加成功");
                                Leader.search();
                                mselect2.empty("#user");
                                Leader.initUserSelect();
                                d.close();
                            }
                        })
                    }
                });
            });
        },
        /**   删除下属 **/
        bindRemoveEvent : function(){
            $(".item_delete_info").each(function(){
                $(this).unbind("click");
                $(this).click(function(){
                    var id= $(this).data("id");
                    $.showConfirm("确定要移除该用户吗?",function(){
                        var param = {
                            pid : 0,
                            id : id
                        }
                        util.jax({
                            'url' : '/data/user/updatePid',
                            'type' : 'post',
                            'data' : param,
                            'cb' : function(){
                                $.showSuccessMessage("移除成功");
                                Leader.search();
                                mselect2.empty("#user");
                                Leader.initUserSelect();
                            }
                        });
                    });
                });
            });
        }

    }
    return Leader;
});


require(['Leader'],function(Leader){
    Leader.init();
});