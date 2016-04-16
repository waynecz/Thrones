var colors = require('colors');

colors.setTheme({
	silly: 'rainbow',  
    input: 'grey',  
    verbose: 'cyan',  
    prompt: 'red',  
    info: 'green',  
    data: 'blue',  
    help: 'cyan',  
    warn: 'yellow',  
    debug: 'magenta',  
    error: 'red'  
})


module.exports = {
	error : function(data){
		console.log(this.getString(data).cyan);
	},
	warn : function(data){
		console.log(this.getString(data).yellow);
	},
	info : function(data){
		console.log(this.getString(data).blue);
	},
	ps : function(data,tag){
        tag = tag || '*';
        var i = 0;
        while(i<3){
            tag += tag+'';
            i++;
        }
		this.warn(tag);
		this.warn(data);
		this.warn(tag);
	},
	getString : function(data){
		if(data instanceof(Error)){
			data = data.message;
		}
		if(typeof data == "object"){
			data = JSON.stringify(data);
		}
		if(typeof data == "number"){
			data += "";
		}

		return data;
	}
}