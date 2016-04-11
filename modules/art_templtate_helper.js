module.exports = function(template){

	//date表示传递来的变量，formate表示用户传递来的参数
	template.helper('dateFormat', function (date, format) {

		return format.replace(/(yyyy)|(MM)|(dd)|(HH)|(mm)|(ss)/g,function(match,index,origin){
			switch(match){
				case 'yyyy':
					return date.getFullYear();
				case 'MM':
					return getTwo(date.getMonth());
				case 'dd':
					return getTwo(date.getDate());
				case 'HH':
					return getTwo(date.getHours());
				case 'mm':
					return getTwo(date.getMinutes());
				case 'ss':
					return getTwo(date.getSeconds());
				default:
					return '';
			}
		});

		function getTwo(m){
			return m<10?"0"+m:m;
		}
	});

	//获取like查询
	template.helper('tolike',function(arg,hasPercent){
		if(typeof hasPercent == undefined){
			hasPercent = true;
		}
		return "'" + hasPercent ? '%' + '' + arg + hasPercent ? '%' : '' + "'";  
	});

}