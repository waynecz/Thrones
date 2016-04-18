require(['message']);

define('Apply',['jquery','util','comjax','mselect2'],function($,util,comjax,mselect2){

    var SearchParam = {
        page : 1,
        pageSize : 10
    }

    var Apply = {
        init : function(){
            this.initStateSelect();
        },
        initStateSelect : function(){
            mselect2.renderAndBind("#state",function(val){
                SearchParam.state = val;
                Apply.search();
            });

        },
        search : function(){

        }
    }

    return Apply;

});


require(['Apply'],function(Apply){
    Apply.init();
});