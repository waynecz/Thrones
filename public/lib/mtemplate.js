

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

    template.helper('applyState',function(val){
        var map = {
            "S0" : "待领导审批",
            "S1" : "待安全审批",
            "S2" : "待运维审核",
            "S3" : "审核通过",
            "S4" : "审核通过",
            "S-1" : "领导拒绝",
            "S-2" : "安全拒绝",
            "S-3" : "运维拒绝"
        }
        return map["S"+val] || '-';
    });

    template.helper('checkTime',function(model){
        switch (model.state){
            case 0:
                return '-';
            case 1:
            case -1:
                return model.gmt_pid;
            case 2:
            case -2:
                return model.gmt_safe;
            case 3:
            case -3:
                return model.gmt_end;
            default:
                return '-';
        }
    });


    template.helper('app')

    template.config('openTag','[[');
    template.config('closeTag',']]');

    return {
        T : function(id,data){
            return template(id,data);
        }
    }


});