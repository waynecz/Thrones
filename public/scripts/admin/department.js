require(['dialog','frame','message']);

define('Department',['jquery','util','mtemplate','comjax','pager','select2'],function($,util,mtemplate,comjax){

    var searchParam = {
        page : 1,
        pageSize : 100
    }

    var Department = {
        init : function(){
            this.initPager();
            this.initLeader();
            this.bindAddEvent();
        },
        initPager : function(){
            window.pager = new Pager("#mypage",{
                fnJump : function(page){
                    Department.search(page);
                }
            });
        },
        initLeader : function(){
            //获取角色信息
            comjax.getUsers(function(data){
                Department.users = data;
                var leaderSelect2 = $("#leader");
                $("#leader,#update_leader").select2({
                    placeholder: "请选择负责人",
                    allowClear: false,
                    minimumResultsForSearch: 8,
                    data : data
                });

                leaderSelect2.on('change',function(){

                });
            });
        },
        search : function(page){
            //分页查询
            util.jax({
                'url' : '/data/department/pageQuery',
                'type' : 'post',
                'data' : searchParam,
                'cb' : function(data){
                    var page = data.page;
                    if(data.total == 0){
                        Department.renderPageData([]);
                        pager.showNullMsg();
                    }
                    else{
                        Department.pageData = data.data;
                        console.log(data.data);
                        Department.renderPageData(data.data);
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
            var html =  mtemplate.T("temp_department_list",{"departments":data});
            $("#lists").html(html);
            this.bindUpdateInfo()
            this.bindUpdatePassword()
            $("#table_list").show();
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
                                $("#leader").select2("val","");
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
                                    Department.search(searchParam.page);
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