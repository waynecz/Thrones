define(['jquery','select2'],function($){
    return {
        render:function(id){
            $(id).select2({
                placeholder : $(id).attr("placeholder") || '请选择',
                allowClear: false,
                minimumResultsForSearch: 10,
            })
        },
        renderWithData: function(id,data){
            $(id).select2({
                placeholder : $(id).attr("placeholder") || '请选择',
                allowClear: false,
                minimumResultsForSearch: 10,
                data : data
            })
        },
        renderAndBind : function(id,cb,defaultData){
            var select = $(id);
            select.select2({
                placeholder : $(id).attr("placeholder") || '请选择',
                allowClear: false,
                minimumResultsForSearch: 10,
            });
            select.select2("val",defaultData || "");
            select.on('change',function(){
                cb && cb(select[0].value);
            });
        },
        renderDataAndBind : function(id,data,cb,defaultData){
            var select = $(id);
            select.select2({
                placeholder : $(id).attr("placeholder") || '请选择',
                allowClear: false,
                minimumResultsForSearch: 10,
                data : data
            });
            select.select2("val",defaultData || "");
            select.on('change',function(){
                cb && cb(select[0].value);
            });
        },
        clear : function(id){
            $(id).select2("val","");
        }
    }
});