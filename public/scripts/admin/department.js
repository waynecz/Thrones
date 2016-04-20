require(['dialog','frame','message']);

define('Department',['jquery','util','comjax','mselect2','pager'],function($,util,comjax,mselect2){

    var Department = {
        init : function(){
            this.initPager();
            this.initLeader();
            this.bindAddEvent();
        },
        initPager : function(){
            window.pager = new Pager("#mypage",Department.search);
        },
        initLeader : function(){
            //获取角色信息
            comjax.getUsers(function(data){
                Department.users = data;
                mselect2.renderWithData("#leader,#update_leader",data);
            });
        },
        search : function(){
            comjax.searchPage(Department,'department',null,true,function(){
                Department.bindUpdateInfo();
                comjax.bindDeleteEvent(".item_delete_info",'department',Department);
            });
        },

        /*******事件绑定区********/
        bindAddEvent : function(){
            $("#btn_add").click(function(){
                $("#win_add").dialog({
                    width: 500,
                    fnSure: function(d) {
                        var param = util.form2param("#form_add_info");
                        util.jax({
                            'url' : '/admin/department/add',
                            'type' : 'post',
                            'data' : param,
                            'cb' : function(){
                                $.showSuccessMessage("添加成功");
                                d.clear();
                                mselect2.clear("#leader");
                                Department.search(searchParam.page);
                                d.close();
                            }
                        })
                    }
                });
            });
        },

        bindUpdateInfo : function (){

            $(".item_update_info").each(function(){
                $(this).unbind("click");
                $(this).click(function(){
                    var departmentId = $(this).data('id');
                    //初始化对话框内容
                    var department = Department.getByDepartmentId(departmentId);
                    console.log(department);
                    if(department == null){
                        console.error('非法请求')
                        return;
                    }
                    $("#update_name").val(department.name);
                    var old_leader = department.user_id
                    $("#update_leader").select2("val",old_leader);
                    var oldInfo = $("#form_update_info").serialize();
                    $("#win_update").dialog({
                        width: 400,
                        fnSure: function(d) {
                            var param = util.form2param("#form_update_info");
                            if(oldInfo == $("#form_update_info").serialize()){
                                d.close();
                                return;
                            }
                            param.id = departmentId;
                            param.old_leader = old_leader;
                            util.jax({
                                'url' : '/admin/department/update',
                                'type' : 'post',
                                'data' : param,
                                'cb' : function(){
                                    $.showSuccessMessage("更新成功");
                                    Department.search();
                                    d.close();
                                }
                            })
                        }
                    });   
                });
            });
        },

        /**   获取数据 **/
        getByDepartmentId : function(id){
            for(var i in Department.pageData){
                var department = Department.pageData[i];
                if(department.id == id){
                    return department;
                }
            }
            return null;
        }
    }
    return Department;
});


require(['Department'],function(Department){
    Department.init();
});