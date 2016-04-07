var orm      = require('orm');
var settings = require('./jdbc');

var connection = null;

function setup(db, cb) {
  require('./info')(orm, db);
  return cb(null, db);
}

//cb is callback function
module.exports = function (cb) {
  if (connection) return cb(null, connection);

  orm.connect(settings.database, function (err, db) {
    if (err) return cb(err);
    connection = db;
    db.settings.set('instance.returnAllErrors', true);
    setup(db, cb);
  });
};
