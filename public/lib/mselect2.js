define(['jquery','select2'],function($){
    return {
        render:function(id){
            $(id).select2({
                allowClear: false,
                minimumResultsForSearch: 10,
            })
        },
        renderWithData: function(id,data){
            $(id).select2({
                allowClear: false,
                minimumResultsForSearch: 10,
                data : data
            })
        },
        val : function(id,val){
            if(val){
                $(id).select2("val",val);
            }
            else{
                return $(id).val();
            }
        },
        change : function(id,cb){
            var select = $(id);
            select.on('change',function(){
                cb && cb(select[0].value);
            });
        },
        renderAndBind : function(id,cb,placeholder){
            var select = $(id);
            select.select2({
                placeholder : $(id).attr("placeholder") || placeholder || '请选择',
                allowClear: false,
                minimumResultsForSearch: 10,
            });
            select.select2("val","");
            select.on('change',function(){
                cb && cb(select[0].value);
            });
        },
        renderDataAndBind : function(id,data,cb){
            var select = $(id);
            select.select2({
                allowClear: false,
                minimumResultsForSearch: 10,
                data : data
            });
            select.on('change',function(){
                cb && cb(select[0].value);
            });
        },
        clear : function(id){
            $(id).select2("val","");
        }

    }
});