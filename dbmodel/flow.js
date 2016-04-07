var orm = require('orm');
var querystring = require('querystring');
module.exports = function (orm, db) {
  var Flow = db.define('flow', {
        id : Number,
        flowno : String,
        sender_id : Number,
        receiver_id : Number,
        money : Number,
        status : Number,
        create_time : Date
  },
  {
    collection: "flow",
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
       //  return {
    			// id : this.id,
    			// username : this.username,
       //    password : this.password,
    			// money : this.money,
    			// create_time : this.create_time.toString()        
       //  }
      }
    }
  });

  Flow.search = function(keyword,callback){
    this.find({'flowno':orm.like('%'+keyword+'%')},{limit:1000},callback);
  }
  // Blog.prototype.search = function(keyword){
  //    console.log(keyword);
  // }

  //Comment.hasOne('message', db.models.message, { required: true, reverse: 'comments', autoFetch: true });
};
