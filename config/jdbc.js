 module.exports = {
     prop : {
         local : {
             host : "127.0.0.1",
             user : "root",
             password : "123456",
             database : "auth"
         },
         company : {
             host : "192.168.6.70",
             user : "shine",
             password : "shine1234",
             database : "test"
         },
         server : {
         	host : "192.168.6.70",
            user : "shine",
            password : "shine1234",
            database : "test"
         }
     },
 	debug : true,
 	showTemplateSql : true,
 	showSql : true,
 	develop : "local",
 	connection : function(){
 		return (this.prop)[this.develop];
 	}
 }