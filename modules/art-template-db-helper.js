require('./string');
var dateutil = require('./date');
module.exports = function(template){

	template.helper('q',function(val){
        if(val == 0 || val == '0'){
            return "'0'";
        }
		return "'" + escape(val || "") + "'";
	});

    template.helper('eq',function(val,col){
        var rst = val;
        if(val == 0 || val == '0'){
            rst = "0";
        }
       return " " + col + " = '" + escape(rst || "") + "' ";
    });

	template.helper('p',function(val){
		return "'%" + escape(val || "") + "%'";
	});

    template.helper('m',function(data,index){
        if(data.length > (index+1)){
            return ',';
        }
        return '';
    });

    template.helper('t',function(val,col){
        return " " +col + " = '" + getFormatDate() + "' ";
    });

    template.helper('set',function(val,col){
        if(val == null){
            return '';
        }
        return "," + col + " = '" + escape(val) + "' ";
    });

    template.helper('in',function(val,col){
        if(val == null || val == '' || val == '-'){
            return '';
        }
        return ' and ' + col + ' in (' + escape(val) + ') '
    });

    template.helper('and',function(val,col,tag,pattern) {
        pattern = pattern || 'digit';
        if(val == null) {
             return '';
        };
        if(typeof val == "string"){
            val = val.trim();
        }
        if(val == '' || val == '-'){
            return ''
        }
        switch (pattern){
            case 'digit' :
                if(val == 0 || val == -1 || val == "0" || val == "-1"){
                    return '';
                }
                break;
        }
        tag = tag || 'eq';

        var tags = {
            eq : '=',
            neq : '!=',
            lt : '<',
            lte : '<=',
            gt : '>',
            gte : '>=',
            like : 'like'
        }
        if(tag == 'like'){
            val = "%" + escape(val) + "%";
        }
        var realTag = tags[tag];
        if(realTag){
            //同一个值被多个字段引用
            var cols = col.split(",");
            if(cols.length == 1){
                return " and " + getSql(col,realTag,val);
            }
            else{
                var sqls = [];
                for(var i =0;i<cols.length;i++){
                    sqls.push(getSql(cols[i],realTag,val));
                }
                return " and (" + sqls.join(" or ") + " )";
            }
        }
        else{
            return '';
        }
    });

    template.helper('orderby',function(val,defaultVal){
        if(val == null || val == ''){
            return ' order by ' + (defaultVal || 'id asc') + ' ';
        }
        return ' order by ' + val + ' ';
    });

    template.helper('limit', function(offset,pageSize){
        if(pageSize > 0){
            return ' limit ' + offset + ',' + pageSize;
        }
        return '';
    });

    function getSql(col,tag,val){
        return col + " " + tag  + " '" + escape(val) + "' ";
    }
	template.helper('d',function(val,format){

		if(typeof val == "undefined"){
			val = new Date();
		}
		if(typeof format == "undefined" || format == "datetime"){
			format = "yyyy-MM-dd HH:mm:ss";
		}
		else if(format == "date"){
			format = "yyyy-MM-dd";
		}

	    var result = dateutil.format(val,format);
		return "'" + (result || "") + "'";
	});

    function escape(val){
        val = val + '';
        return val.replace(/'/g,"\\'");
    }
}