var orm = require('orm');

module.exports = function(orm,db){
  var Department = db.define('department',{
      id : Number,
      name : String
  },{
    collection:"department",
    methods : {
      serialize : function(){
        return {
          id : this.id,
          name : this.name
        }
      }
    }
  });

  
};

