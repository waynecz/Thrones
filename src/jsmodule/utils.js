Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S" : this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

window.Getime = function (time, isMillisecond) {
    var isMillisecond = isMillisecond || false;
    if (!isMillisecond && time && Object.prototype.toString.call(time) !== '[object Boolean]') {
        if (new Date(time) == 'Invalid Date') {
            console.log('您这并不是个日期啊,给大爷您返个现在的时间')
            return new Date()
        } else {
            return new Date(time)
        }
    } else if (!isMillisecond && Object.prototype.toString.call(time) === '[object Boolean]') {
        return new Date().getTime()
    } else if (time && Object.prototype.toString.call(time) !== '[object Boolean]' && Object.prototype.toString.call(isMillisecond) === '[object Boolean]') {
        return new Date(time).getTime()
    } else {
        return new Date()
    }

};


window.log = function (p) {
    console.log(p)
};