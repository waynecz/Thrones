var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

	res.render('index', { title: 'Express' });
});


router.get('/data',function(req,res){
	var param = req.query;

	//获取table
	var table = req.query.model;
	var method = req.query.operation;
	var param = req.query.param;

	var model = (req.models)[table];
	model[method](param,res);
});

module.exports = router;
