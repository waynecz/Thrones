//文件处理类
var fs = require('fs');
var path = require('path');
var util = require('util');
var File = {
	in : function(content,flag){
		this.writeToFile("app.log",content,flag);
	},
	on : function(content,flag){
		this.appendToFile("app.log",content,flag);
	},
	exist : function(file){
		return fs.existsSync(file);
	},
	readFile : function(file){
		return fs.readFileSync(file,{encoding:"utf-8"})
	},
	writeInFile : function(content,flag){
		this.writeToFile("app.log",content,flag);
	},
	writeToFile : function(sourceFile,content,flag){
		fs.writeFileSync(sourceFile,util.format(content));
		if(flag){
			console.log("内容写入成功");
		}
	},
	appendToFile : function(sourceFile,content,flag){
		fs.appendFileSync(sourceFile,"\n\n***************    " +this.getTime()+"   **************\n\n");
		fs.appendFileSync(sourceFile,util.format(content));
		if(flag){
			console.log("内容追加成功");
		}
	},
	//复制文件
	copyFile : function(sourceFile,targetFile,log){
		File.makeDirs(path.dirname(targetFile),function(){
			fs.writeFileSync(targetFile,fs.readFileSync(sourceFile));
			if(log){
	  			console.log(sourceFile + '->' + targetFile + '复制成功');
	  		}
		});
	},
	//文件复制到目录
	copyFileToDir :function(sourceFile,targetDir,targetName,log){
		//获取文件名
		var name = '';
		if(targetName != undefined){
			var sourceExt = path.extname(sourceFile);
			var targetExt = path.extname(targetName);
			//得到后缀一样的文件
			name = path.basename(targetName,targetExt) + sourceExt;
		}
		else{
			name = path.basename(sourceFile);
		}
		this.makeDirs(targetDir,function(){
			File.copyFile(sourceFile,path.join(targetDir,name),log);
		});
	},
	//目录复制
	copyDir : function(sourceDir,targetDir,log){
		var sourceDirFiles = this.getDirs(sourceDir);
		sourceDirFiles.forEach(function(item){
			//获取相对路径
			var relativePath = path.relative(sourceDir,item);
			var targetAbsolutePath = path.join(targetDir,relativePath);
			File.copyFile(item,targetAbsolutePath,log);
		});
		console.log("done");
	},
	makeDirs : function(filepath,callback){
		fs.exists(filepath,function(exists){
			if(exists){
				callback();
			}
			else{
				File.makeDirs(path.dirname(filepath),function(){
					fs.mkdir(filepath,callback);
				});
			}
		});
	},
	getDirs : function(dirpath,result){
		if(result == undefined){
			result = [];
		}
		var dirList = fs.readdirSync(dirpath);
		dirList.forEach(function(item){
			var cfile = path.join(dirpath,item);
			if(fs.statSync(cfile).isDirectory()){
		      	File.getDirs(cfile,result);
		    }else{
		      	result.push(cfile);
		    }
		});
		return result;
	},
	getTime:function (d){
		d = d || new Date();
		return d.getHours() + ":" + this.getTwo(d.getMinutes()) + ":" + this.getTwo(d.getSeconds());
	},
	getTwo:function(m){
		return m < 10 ? ("0" + m) : m;
	}
}


module.exports = File;