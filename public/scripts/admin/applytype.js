require(['dialog','frame','message']);

define('ApplyType',['jquery','util','comjax','mselect2','pager'],function($,util,comjax,mselect2){

    var ApplyType = {
        init : function(){
            this.initPager();
            this.bindAddEvent();
            this.bindUpdateInfo();
            this.initSelect();
        },
        initPager : function(){
            window.pager = new Pager("#mypage",ApplyType.search);
        },
        search : function(){
            comjax.searchPage(ApplyType,'apply_type',null,true,function(){
                ApplyType.bindUpdateInfo();
                comjax.bindDeleteEvent(".item_delete_info",'apply_type',ApplyType);
            });
        },
        initSelect : function(){
            comjax.getApplyTypeFirst(function(data){
                 mselect2.renderWithData("#pid,#update_pid",data);
            });
        },
        /*******事件绑定区********/
        bindAddEvent : function(){
            $("#btn_add").click(function(){
                $("#win_add").dialog({
                    width: 500,
                    fnSure: function(d) {
                        var param = util.form2param("#form_add_info");

                        if(param.pid>0){
                            param.type = 1;
                        }
                        else{
                            param.pid = 0;
                            param.type = 0;

                        }
                        util.jax({
                            'url' : '/data/apply_type/add',
                            'type' : 'post',
                            'data' : param,
                            'cb' : function() {
                                $.showSuccessMessage("添加成功");
                                d.clear();
                                mselect2.clear("#pid");
                                ApplyType.search();
                                d.close();
                                if (param.pid == 0){
                                    ApplyType.initSelect();
                                }
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
                    var index = $(this).data('index');
                    var data = ApplyType.getData(index);
                    console.log(data);
                    if(data == null){
                        $.showErrorMessage('非法请求');
                        return;
                    }
                    $("#update_name").val(data.name);
                    $("#update_pid").select2("val",data.pid);
                    var oldInfo = $("#form_update_info").serialize();
                    $("#win_update").dialog({
                        width: 400,
                        fnSure: function(d) {
                            var param = util.form2param("#form_update_info");
                            if(oldInfo == $("#form_update_info").serialize()){
                                d.close();
                                return;
                            }
                            param.id = data.id;
                            util.jax({
                                'url' : '/data/apply_type/update',
                                'type' : 'post',
                                'data' : param,
                                'cb' : function(){
                                    $.showSuccessMessage("更新成功");
                                    ApplyType.search();
                                    d.close();
                                }
                            })
                        }
                    });   
                });
            });
        },
        /**   获取数据 **/
        getByApplyTypeId : function(id){
            for(var i in ApplyType.pageData){
                var department = ApplyType.pageData[i];
                if(department.id == id){
                    return department;
                }
            }
            return null;
        },
        getData : function(index){
            return this.pageData.length > index ? this.pageData[index] : null;
        }
    }
    return ApplyType;
});


require(['ApplyType'],function(ApplyType){
    ApplyType.init();
});