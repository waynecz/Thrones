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
		var flag = false;
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
    return this;
}

String.prototype.format = function(){
    var args = arguments;
    var i = 0;
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