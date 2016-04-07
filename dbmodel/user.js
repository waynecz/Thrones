var orm = require('orm');
var querystring = require('querystring');
module.exports = function (orm, db) {
  var User = db.define('user', {
        id : Number,
        username : String,
        password : String,
        money : Number,
        create_time : Date
  },
  {
    collection: "user",
    hooks: {
      beforeValidation: function () {
        this.create_time = new Date();
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
    			money : this.money,
    			create_time : this.create_time.toString()        
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
