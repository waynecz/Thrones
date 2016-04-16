define(['template'],function(template){

    template.helper('dateFormat',function(val,pattern){

    });


    template.config('openTag','[[');
    template.config('closeTag',']]');

    return {
        T : function(id,data){
            return template(id,data);
        }
    }




});