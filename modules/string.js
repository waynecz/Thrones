String.prototype.contain = function(substring) {
    return this.indexOf(substring) > -1;
};
//首字母小写
String.prototype.lowerFirstString = function(){
    return this.slice(0,1).toLowerCase() + this.slice(1);
}
//首字母大写
String.prototype.capitalString = function() {
    return this.slice(0, 1).toUpperCase() + this.slice(1);
}
String.prototype.camelString = function(tag) {
    tag = tag || '_';
    var ms = this.split(tag);
    var result = '';
    for (var i in ms) {
        var item = ms[i];
        if (i > 0) {
            item = item.capitalString();
        }
        require("../modules/print").ps(item);
        result += item;
    }
    require("../modules/print").ps(result);
    return result;
}

//首字母大写，且驼峰形式 
String.prototype.capitalCamelString = function(tag) {
    return this.camelString(tag).capitalString();
}

String.prototype.contain = function(substr) {
    return this.indexOf(substr) > -1;
}
String.prototype.contains = function(substr,splitTag) {
	if(substr && substr.contain(splitTag || ',')){
		ms = substr.split(splitTag || ',');
        for (var i in ms) {
            if (this.contain(ms[i])) {
                return true;
            }
        }
        return false;
	}
    return this.contain(substr);
}

String.prototype.containIgnoreCase = function(substr) {
    return this.toLowerCase().indexOf(substr.toLowerCase()) > -1;
}

String.prototype.containsIgnoreCase = function(substr,splitTag) {
	if(substr && substr.contain(splitTag || ',')){
		ms = substr.split(splitTag || ',');
		var flag = false;
        for (var i in ms) {
            if (this.containIgnoreCase(ms[i])) {
                return true;
            }
        }
        return false;
	}
    return this.containIgnoreCase(substr);
}


String.prototype.startsWith = function() {
    for(var i in arguments){
        if(this.indexOf(arguments[i]) == 0){
            return true;
        }
    }
    return false;
}

String.prototype.endsWith = function(substr) {
    var index = this.indexOf(substr);
    return index > -1 && index == (s1.length - s2.length);
}
String.prototype.slicePrefix = function(prefix) {
    if (this.startsWith(prefix)) {
        return this.slice(prefix.length);
    }
    return this.toString();
}

String.prototype.format = function(){
    var args = arguments;
    var i = -1;
    return this.replace(/\?|(\{\})/g,function(match,index,oldstr){
        i++;
        return args[i] || '?';
    });
}

String.prototype.formatAll = function(replaceStr){
    return this.replace(/\?|(\{\})/g,function(match,index,oldstr){
        return replaceStr || '?';
    });
}

String.prototype.replaceAll = function(reg,replaceStr){
    return this.replace(reg,function(match,index,oldstr){
        return replaceStr || '?';
    });
}


String.prototype.repeat = function(n){
    var i = 1;
    var str = this.toString();
    while(i<n){
        str += str;
        i++;
    }
    return str;
}


//保留小数   (类似toFixed(n))
String.prototype.makeNum = function(n,absolute){
    n = n || 0;
    absolute = absolute || 0;
    var str = this.toString();


    var nums = str.split(".");
    //无小数
    if(nums.length == 1){
        if(absolute || n == 0){
            return nums[0]+'';
        }
        else{
            return nums[0] + '.' + '0'.repeat(n);
        }
    }
    //有小数
    else{
        var n1 = nums[0];
        var n2 = nums[1];
        var sn2 = n2 + '';
        if(n==0){
            //取下一位的四舍五入
            var k1 = sn2.slice(0,1) * 1 > 4 ? 1 : 0;
            n1 += k1;
            return n1 + '';
        }
        if(sn2.length > n){
            var k1 = sn2.slice(n,n+1) * 1 > 4 ? 1 : 0;
            var mk = sn2.slice(0,n) * 1 + k1;
            return n1 + '.' + mk;
        }
        else if(sn2.length == n){
            return str;
        }
        else{
            if(absolute){
                return str;
            }
            else{
                var gap = n - sn2.length;
                return str + '0'.repeat(gap);
            }
        }
    }
}

String.random = function(n){
    var cas = [];
    for(var i=48;i<58;i++){
        cas.push(String.fromCharCode(i));
    }
    for(var i=65;i<91;i++){
        cas.push(String.fromCharCode(i));
    }
    for(var i=97;i<123;i++){
        cas.push(String.fromCharCode(i));
    }
    var result = [];
    for(var i=0;i<n;i++){
        result.push(cas[Math.floor(Math.random() * (cas.length - 1))]);
    }
    return result.join("");
}