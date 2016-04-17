

define(['template'],function(template){

    template.helper('dateFormat',function(val,pattern){
        if(val == null || val == ''){
            return '-'
        }
        if(val.indexOf('0000-00-00') == 0){
            return '-';
        }
        pattern = pattern || 'datetime';
        switch (pattern){
            case 'datetime' :
                return val;
            case 'date':
                return val.slice(0,10);
            case 'spectial':
                return showTime(val);
            default :
                return val;
        }
    });


    template.config('openTag','[[');
    template.config('closeTag',']]');

    return {
        T : function(id,data){
            return template(id,data);
        }
    }




});