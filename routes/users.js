var express = require('express');
var router = express.Router();
var url = require('url');
var qs = require('querystring');
var user = require('../modules/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hello');
});
	


//添加用户
router.get('/add',user.addUser);
router.post('/add',user.addUser);



module.exports = router;
