require(['dialog','frame','message']);

define('User',['jquery','util','comjax','mtemplate','mselect2','pager'],function($,util,comjax,mtemplate,mselect2){

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
                mselect2.renderDataAndBind("#department,#user_department",data,function(val){
                    searchParam.department_id = val;
                    User.search();
                });
            });
        },
        initRoleSelect : function(){
            //获取角色信息
            comjax.getRoles(function(data){
                User.roles = data;
                mselect2.renderDataAndBind("#role,#user_role",data,function(val){
                    searchParam.role = val;
                    User.search();
                });
            });
        },
        initSortSelect : function(){
            mselect2.renderAndBind("#sort",function(val){
                searchParam.sort = val;
                User.search();
            });
        },
        search : function(page){
            searchParam.name = $("#search_name").val();
            searchParam.page = page || 1;
            comjax.searchPage(User,'user',searchParam,true,function(){
                User.bindUpdateInfo()
                User.bindUpdatePassword()
            });
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