var express = require('express');
var router = express.Router();
var ajax = require('../modules/ajax')
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

function cb(req,res){
	//获取table
	var _table = req.params.model;
	var _method = req.params.operation;

	var model = (req.models)[_table];
    if(!model){
        return ajax.failure(res,"非法model");
    }
    if(!model[_method]){
        return ajax.failure(res,"非法operation");
    }
    var param = req.query;
    if(req.method == "POST"){
        param = req.body;
    }
	model[_method](param,res);
}
router.post("/data/:model/:operation",cb);
router.get("/data/:model/:operation",cb);


module.exports = router;


		