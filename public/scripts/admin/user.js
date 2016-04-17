require(['dialog','frame','message']);

define('User',['jquery','util','comjax','mtemplate','pager','select2'],function($,util,comjax,mtemplate){

    var searchParam = {
        page : 1,
        pageSize : 10
    }

    var User = {
        init : function(){
            this.initPager();
            this.initDepartmentSelect();
            this.initRoleSelect();
            this.initSortSelect();
            this.bindSearchEvent();
        },
        initPager : function(){
            window.pager = new Pager("#mypage",{
                fnJump : function(page){
                    User.search(page);
                }
            });
        },
        initDepartmentSelect : function(){
            //获取部门信息
            comjax.getDepartments(function(data){
                User.departments = data;
                var departmentSelect2 = $("#department");

                $("#department,#user_department").select2({
                    placeholder: "请选择部门",
                    allowClear: false,
                    minimumResultsForSearch: 8,
                    data : data
                });

                departmentSelect2.on("change",function(){
                    searchParam.department_id = departmentSelect2[0].value;
                    User.search();
                });
            });
        },
        initRoleSelect : function(){
            //获取角色信息
            comjax.getRoles(function(data){
                User.roles = data;
                var roleSelect2 = $("#role");
                $("#role,#user_role").select2({
                    placeholder: "请选择角色",
                    allowClear: false,
                    minimumResultsForSearch: 8,
                    data : User.roles
                });

                roleSelect2.on('change',function(){
                    searchParam.role = roleSelect2[0].value;
                    User.search();
                });

            });
        },
        initSortSelect : function(){
            var sortSelect2 = $("#sort");
            sortSelect2.select2({
                placeholder: "请选择排序",
                allowClear: false,
                minimumResultsForSearch: 8
            });
            sortSelect2.on('change',function(){
                searchParam.sort = sortSelect2[0].value;
                User.search();
            });
        },
        search : function(page){
            searchParam.name = $("#search_name").val();
            searchParam.page = page || 1;
            //分页查询
            util.jax({
                'url' : '/data/user/pageQuery',
                'type' : 'post',
                'data' : searchParam,
                'cb' : function(data){
                    var page = data.page;
                    if(data.total == 0){
                        User.renderPageData([]);
                        pager.showNullMsg();
                    }
                    else{
                        User.pageData = data.data;
                        User.renderPageData(data.data);
                        pager.setTotal(data.total);
                        pager.setPageSize(data.pageSize);
                        pager.goPage(page);
                    }
                }
            });
        },
        renderPageData : function(data){
            if(data == null || data.length == 0){
                $("#table_list").hide();
                return;
            }
            var html =  mtemplate.T("temp_user_list",{"users":data});
            $("#lists").html(html);
            this.bindUpdateInfo()
            this.bindUpdatePassword()
            $("#table_list").show();
        },


        /*******事件绑定区********/
        bindSearchEvent : function(){
            $("#search_name").on('change',function(){
                User.search();
            });

            $("#btn_search").click(function(){
                User.search();
            });
        },

        bindUpdateInfo : function (){

            $(".item_update_info").each(function(index){
                $(this).click(function(){
                    var userId = $(this).data('id');
                    //初始化对话框内容
                    var user = User.getByUserId(userId);
                    console.log(user);
                    if(user == null){
                        console.error('非法请求')
                        return;
                    }
                    
                    $("#user_username").val(user.username);
                    $("#user_name").val(user.name);
                    $("#user_department").select2("val",user.department_id);
                    $("#user_role").select2("val",user.role);


                    var oldInfo = $("#form_update_info").serialize();
                    $("#win_update_info").dialog({
                        width: 500,
                        fnSure: function(d) {
                            var param = util.form2param("#form_update_info");
                            if(oldInfo == $("#form_update_info").serialize()){
                                d.close();
                                return;
                            }
                            param.id = userId;
                            util.jax({
                                'url' : '/data/user/update',
                                'type' : 'post',
                                'data' : param,
                                'cb' : function(){
                                    $.showSuccessMessage("更新成功");
                                    User.search(searchParam.page);
                                    d.close();
                                }
                            })
                        }
                    });   
                });
            });
        },
        bindUpdatePassword : function (){
            $(".item_update_password").each(function(index){
                $(this).click(function(){
                    var userId = $(this).data('id');
                    //初始化对话框内容
                    var user = User.getByUserId(userId);
                    console.log(user);
                    if(user == null){
                        console.error('非法请求')
                        return;
                    }

                    $("#password_user").text(user.name);
                    $("#win_update_password").dialog({
                        width: 500,
                        fnSure: function(d) {
                            var param = {};
                            param.id = userId;
                            param.key = $("#key").val();
                            param.username = user.username;
                            param.password = $("#new_password").val();
                            if(param.password.trim() == ''){
                                $.showErrorMessage("新密码不能为空");
                                return;
                            }
                            if(param.key.trim() == ''){
                                $.showErrorMessage("管理员秘钥不能为空");
                                return;
                            }
                            util.jax({
                                'url' : '/admin/user/password',
                                'type' : 'post',
                                'data' : param,
                                'cb' : function(){
                                    d.clear();
                                    $.showSuccessMessage("密码修改成功");
                                    d.close();
                                }
                            })
                        }
                    });
                });
            });
        },

        /**   获取数据 **/
        getByUserId : function(id){
            for(var i in User.pageData){
                var user = User.pageData[i];
                if(user.id == id){
                    return user;
                }
            }
            return null;
        }
    }
    return User;
});


require(['User'],function(User){
    User.init();
});