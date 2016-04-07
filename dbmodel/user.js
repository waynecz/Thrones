var orm = require('orm');
var querystring = require('querystring');
module.exports = function (orm, db) {
  var User = db.define('user', {
        id : Number,
        username : String,
        password : String,
        name : String,
        mobile : String,
        dept : String,
        pid : Number,
        gmt_create : Date
  },
  {
    collection: "user",
    hooks: {
      beforeValidation: function () {
        this.gmt_create = new Date();
      }
    },
    validations: {
      //body   : orm.enforce.ranges.length(1, 1024)
    },
    methods: {
      serialize: function () {
        return {
    			id : this.id,
    			username : this.username,
          password : this.password,
          name : this.name,
          mobile : this.mobile,
          password : this.password,
          dept : this.dept,
    			pid : this.pid,
    			gmt_create : this.gmt_create.toString()        
        }
      }
    }
  });

  User.search = function(keyword,callback){
    this.find({'username':orm.like('%'+keyword+'%')},{limit:1000},callback);
  }


  User.login = function(username,password,callback){
      this.one({"username":username,"password":password},callback);
  }
  // Blog.prototype.search = function(keyword){
  //    console.log(keyword);
  // }

  //Comment.hasOne('message', db.models.message, { required: true, reverse: 'comments', autoFetch: true });
};
