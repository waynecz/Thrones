var orm = require('orm');
var querystring = require('querystring');
module.exports = function (orm, db) {
  var Info = db.define('info', {
        id : Number,
        uuid : String,
        real_size : String,
        real_dragon : String,
        real_single : String,
        num : String,
        gmt_check : Date
  },
  {
    collection: "t_info",
    hooks: {
      beforeValidation: function () {
        this.gmt_check = new Date();
      }
    },
    validations: {
      //body   : orm.enforce.ranges.length(1, 1024)
    },
    methods: {
      serialize: function () {
        return {
    			id : this.id,
    			uuid : this.uuid,
          realSize : this.real_size,
    			realDragon : this.real_dragon,
          realSingle : this.real_single,
          num : this.num,
    			gmtCheck : this.gmt_check.toString()        
        }
      }
    }
  });

  // Blog.prototype.search = function(keyword){
  //    console.log(keyword);
  // }

  //Comment.hasOne('message', db.models.message, { required: true, reverse: 'comments', autoFetch: true });
};
