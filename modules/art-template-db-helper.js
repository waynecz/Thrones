

module.exports = function(template){

	template.helper('q',function(val){
		return "'" + (val || "") + "'";
	});

    template.helper('eq',function(val,col){
       return " " + col + " = '" + val + "' ";
    });

	template.helper('p',function(val){
		return "'%" + (val || "") + "'";
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
        return "," + col + " = '" + val + "' ";
    });


    template.helper('and',function(val,col,tag,pattern) {
        pattern = pattern || 'digit';
        if(val == null) {
             return '';
        }
        val = val.trim();
        if(val == ''){
            return '';
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
            val = "%" + val + "%";
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

    template.helper('orderby',function(val){
        if(val == null || val == ''){
            return '';
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
        return col + " " + tag  + " '" + val + "' ";
    }
	template.helper('d',function(val,format){

		if(typeof val == "undefined"){
			val = new Date();
            console.log(val)
            console.log(val.getTime())
		}
		if(typeof format == "undefined" || format == "datetime"){
			format = "yyyy-MM-dd HH:mm:ss";
		}
		else if(formate == "date"){
			format = "yyyy-MM-dd";
		}

	    var result = getFormatDate(val,format);
		return "'" + (result || "") + "'";
	});



	function getTwo(n){
		return n<10 ? "0"+n : n;
	}


    function getFormatDate(d,pattern){
        var val = d || new Date();
        pattern = pattern || 'yyyy-MM-dd HH:mm:ss';
        return pattern.replace(/(yyyy)|(MM)|(dd)|(HH)|(mm)|(ss)/g,function(match){
            switch(match){
                case 'yyyy':
                    return val.getFullYear();
                case 'MM':
                    return getTwo(val.getMonth() + 1);
                case 'dd':
                    return getTwo(val.getDate());
                case 'HH':
                    return getTwo(val.getHours());
                case 'mm':
                    return getTwo(val.getMinutes());
                case 'ss':
                    return getTwo(val.getSeconds());
                default:
                    return '';
            }
        });
    }
}