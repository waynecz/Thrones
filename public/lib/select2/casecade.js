//JavaScript Document
//李敏强  js级联下拉
(function($){
    $.fn.casecadeSelect = function(opts){
        var _default = $.extend({
            length : 3,//表示有几级下拉框
            idFlag : "id",
            nameFlag : "name",
            pidFlag : "pid",
            objs : [],
            data : null,   //目前data采用嵌套的json数组格式
            selectedItems : [],//默认情况下被选中的idFlag值
            callback : null
        },opts?opts:{});
       
        var idFlag = _default.idFlag;
        var nameFlag = _default.nameFlag;
        var pidFlag = _default.pidFlag;
        var callback = _default.callback;
        var objs = _default.objs;
        var length = _default.length;
        var allData =  toJson(_default.data);  
        var selectedItems = _default.selectedItems;
        var isFirstInitial = true;
        
        //动态创建select实例
        //第一个实例
        var _instance0 = this;
        //实例化select
        for(var i=1;i<length;i++){
            eval("var _instance"+i+"=$('" + objs[i-1] + "')");
        }           
        
        this.bindEvent = function(){
            _instance0.change(function(){
                showSelect(1);
            });
            _instance1.change(function(){
                showSelect(2);
            });
            showSelect(0);
        }

        this.init = function(items){
            isFirstInitial = true;
            selectedItems = items || selectedItems;
            showSelect(0);
        }
        this.bindEvent();
        this.getDatas = function(level){
            var level = level || 0;
            var context = eval("_instance"+level);
            var id = context.select2("val");
            var text = context.find("option:selected").text(); 
            return [id,text];
        }
        //传递参数，并将其显示在下拉框中
        //selectData下拉数据集
        //level表示第几个下拉框，从0开始
        //item默认选中item
        function showSelectData(selectData,level,item){
            var context = eval("_instance"+level);
           // context.html("");
            var opts = context.find("option");
            var flag = false;
            if(opts.length>=1 && opts.eq(0).val()==0){
                context.html(opts.eq(0));
                flag = true;
            }
            else{
                context.html("");
            }
            for(j in selectData){
                var o = selectData[j];
                context.append("<option value='"+o[idFlag]+"'>"+o[nameFlag]+"</option>");
            }
            alert(isFirstInitial);
            if(isFirstInitial && arguments.length>=3 && item!=undefined){
                showValue(context,item);
            }
            else{
                showValue(context);
            }
            if(length==level+1){
                callback && callback();
                isFirstInitial = false;
            }
        }

        function showValue(context,value){
            value = value || context.find("option:eq(0)").val();
            context.select2("val",value);
        }

        function showSelect(level){
            var selectData = getDataByLevel(level);
            showSelectData(selectData,level,selectedItems[level]);
        }

        //level表示第几个下拉框，从0开始
        function getDataByLevel(level){
            if(level==0){
               return getDataByPid(0);
            }
            else{
                var pcontext = eval("_instance"+(level-1));
                var pid = pcontext.val();
                if(pid==0){
                    return [];
                }
                return getDataByPid(pid);
            }
        }

        function getDataByPid(pid){
            var result = [];
            for(var i in allData){
                var o = allData[i];
                if(o[pidFlag] == pid){
                    result.push(o);
                }
            }
            return result;
        }
        
        function toJson(data){
            if(typeof data == "string"){
                return JSON.parse(data);
            }
            else{
                return data;       
            }
        }

        return this;
    }
})(jQuery);
