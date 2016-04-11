module.exports = function(template){

	template.helper('q',function(val){
		return "'" + (val || "") + "'";
	});

	template.helper('p',function(val){
		return "'%" + (val || "") + "'";
	});

	template.helper('dateFormat',function(val,format){
		if(typeof val == "undefined"){
			val = new Date();
		}
		if(typeof format == "undefined" || format == "datetime"){
			format = "yyyy-MM-dd HH:mm:ss";
		}
		else if(formate == "date"){
			format = "yyyy-MM-dd";
		}

	    var result = format.replace(/(yyyy)|(MM)|(dd)|(HH)|(mm)|(ss)/g,function(match,index,origin){
			switch(match){
				case 'yyyy':
					return val.getFullYear();
				case 'MM':
					return getTwo(val.getMonth());
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


		return "'" + (result || "") + "'";
	});

	function getTwo(n){
		return n<10 ? "0"+n : n;
	}
}