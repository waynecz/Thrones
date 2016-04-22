
var dateutil = {
    now : function(pattern){
        if(!pattern){
            return new Date();
        }
        else if(pattern("date")){
            return this.format(null,'yyyy-MM-dd');
        }
        else if(pattern == 'datetime'){
            return this.format(null,'yyyy-MM-dd HH:mm:ss');
        }
        return this.format(null,pattern);
    },
    format : function(date,pattern){
        var val = date || new Date();
        if(val == "now"){
            val = new Date();
        }
        else if(typeof val == "number"){
            val = new Date();
            val.setTime(date);
        }
        pattern = pattern || 'yyyy-MM-dd HH:mm:ss';
        return pattern.replace(/(yyyy)|(MM)|(dd)|(HH)|(mm)|(ss)/g,function(match){
            switch(match){
                case 'yyyy':
                    return val.getFullYear();
                case 'MM':
                    return dateutil.getTwo(val.getMonth() + 1);
                case 'dd':
                    return dateutil.getTwo(val.getDate());
                case 'HH':
                    return dateutil.getTwo(val.getHours());
                case 'mm':
                    return dateutil.getTwo(val.getMinutes());
                case 'ss':
                    return dateutil.getTwo(val.getSeconds());
                default:
                    return '';
            }
        });
    },
    formateToDate : function(date){
        return this.format(date,"yyyy-MM-dd");
    },
    gapDay : function(date,day){
        if(day!=0){
            day = day || 1;
        }
        return this.gapTime(date,day,'d','yyyy-MM-dd');

    },
    gapTime : function(date,time,unit,pattern){
        if(date == "now"){
            date = new Date();
        }
        else if(typeof date == "string"){
            date = this.parse(date);
        }
        var mtime = date.getTime();
        var rtime;
        unit = unit || "s";

        switch(unit){
            case 'ms':
                rtime = time;
                break;
            case 's':
                rtime = time * 1000;
                break;
            case 'm':
                rtime = time * 1000 * 60;
                break;
            case 'h':
                rtime = time * 1000 * 60 * 60;
                break;
            case 'd':
                rtime = time * 1000 * 60 * 60 * 24;
                break;
            default:
                console.error("非法参数unit");
        }
        var dtime = mtime + rtime;
        return this.format(dtime,pattern);
    },
    parse : function(dateStr){
        if(/^\d{4}-\d{2}-\d{2}$/.test(dateStr)){
            var year = parseInt(dateStr.slice(0,4));
            var month = parseInt(dateStr.slice(5,7));
            var day = parseInt(dateStr.slice(8,10));
            var time = Date.UTC(year, month-1, day);
            var date = new Date();

            date.setTime(time + date.getTimezoneOffset() * 60 * 1000);
            return date;
        }
        else if(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateStr)){
            var year = parseInt(dateStr.slice(0,4));
            var month = parseInt(dateStr.slice(5,7));
            var day = parseInt(dateStr.slice(8,10));
            var hour = parseInt(dateStr.slice(11,13));
            var minute = parseInt(dateStr.slice(14,16));
            var second = parseInt(dateStr.slice(17,19));
            var date = new Date();
            var time = Date.UTC(year, month-1, day, hour, minute, second);
            date.setTime(time + date.getTimezoneOffset() * 60 * 1000);
            return date;
        }
        else{
            console.error(dateStr);
            console.error("格式必须是yyyy-MM-dd或者yyyy-MM-dd HH:mm:ss中的一种");
        }
    },
    getTwo : function(m){
        return m<10?"0"+m:m;
    },
    getTime : function(date){
        var date = date || new Date();
        return date.getTime();
    },
    bettweenTime : function(t1,t2){
        if(t1 == 'now'){
            t1 = new Date();
        }
        t2 = this.parse(t2);
        return Math.floor(t2.getTime() - t1.getTime());
    }
}


module.exports = dateutil;
