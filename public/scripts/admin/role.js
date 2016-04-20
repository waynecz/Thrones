require(['dialog','frame','message']);

define('Role',['jquery','util','comjax','pager'],function($,util,comjax,mselect2){

  
    var Role = {
        init : function(){
            this.initPager();
            this.bindAddEvent();
        },
        initPager : function(){
            window.pager = new Pager("#mypage",Role.search);
        },
        search : function(){
            comjax.searchPage(Role,'role',null,true,function(){
                Role.bindUpdateInfo();
                comjax.bindDeleteEvent(".item_delete_info",'role',Role);
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
                            'url' : '/data/role/add',
                            'type' : 'post',
                            'data' : param,
                            'cb' : function(){
                                $.showSuccessMessage("添加成功");
                                d.clear();
                                Role.search();
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
                    var roleId = $(this).data('id');
                    //初始化对话框内容
                    var role = Role.getByRoleId(roleId);
                    console.log(role);
                    if(role == null){
                        console.error('非法请求')
                        return;
                    }
                    $("#update_name").val(role.name);
                    var old_leader = role.user_id
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
                            param.id = roleId;
                            param.old_leader = old_leader;
                            util.jax({
                                'url' : '/admin/role/update',
                                'type' : 'post',
                                'data' : param,
                                'cb' : function(){
                                    $.showSuccessMessage("更新成功");
                                    Role.search();
                                    d.close();
                                }
                            })
                        }
                    });   
                });
            });
        },

        /**   获取数据 **/
        getByRoleId : function(id){
            for(var i in Role.pageData){
                var role = Role.pageData[i];
                if(role.id == id){
                    return role;
                }
            }
            return null;
        }
    }
    return Role;
});


require(['Role'],function(Role){
    Role.init();
});