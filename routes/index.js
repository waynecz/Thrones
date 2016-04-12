var express = require('express');
var router = express.Router();
var ajax = require('../modules/ajax')
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

function cb(req,res){
    var method = req.method;
    var param = req.query;
    if(!param.model && method == "POST"){
        param = req.body;
    }
	//获取table
	var _table = param.model;
	var _method = param.operation;
	var model = (req.models)[_table];
    if(!model){
        return ajax.failure(res,"非法model");
    }
    if(!model[_method]){
        return ajax.failure(res,"非法operation");
    }
	model[_method](param,res);
}
router.post("/data",cb);
router.get("/data",cb);


module.exports = router;


		