var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
   req.models.user.all(res);
});
	

module.exports = router;
