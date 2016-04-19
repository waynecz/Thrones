require(['message']);

define('Apply',['jquery','util','comjax','mselect2','pager'],function($,util,comjax,mselect2){

    var searchParam = {
        page : 1,
        pageSize : 10
    }

    var Apply = {
        init : function(){
            this.initPagination();
            this.initStateSelect();
            this.bindSearchEvent();
        },
        initPagination : function(){
            window.pager = new Pager("#mypage",Apply.search);
        },
        initStateSelect : function(){
            mselect2.renderAndBind("#state",function(val){
                searchParam.state = val;
                Apply.search();
            });
                
            comjax.getDepartments(function(data){
                mselect2.renderDataAndBind("#department",data,function(val){
                    searchParam.department_id = val;
                    Apply.search();
                });
            });

            comjax.getUsers(function(data){
                mselect2.renderDataAndBind("#user",data,function(val){
                    searchParam.user_id = val;
                    Apply.search();
                });
            });

            comjax.getApplyTypeSecond(function(data){
                mselect2.renderDataAndBind("#applytype",data,function(val){
                    searchParam.auth_detail = val;
                    Apply.search();
                });
            });
        },
        search : function(page){
            searchParam.key = $("#search_name").val();
            searchParam.page = page || 1;
            comjax.searchPage(Apply,'apply',searchParam);
        },
        bindSearchEvent : function(){
            $("#search_name").on('change',function(){
                Apply.search();
            });

            $("#btn_search").click(function(){
                Apply.search();
            });
        }
    }

    return Apply;

});


require(['Apply'],function(Apply){
    Apply.init();
});