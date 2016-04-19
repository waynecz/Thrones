
var ajax = require('../../modules/ajax');
var Promise = require('bluebird');
exports.add = function(req,res){

    req.models.apply.add(req.body)
        .then(addComment)
        .then(function(){
         return ajax.success(res,"发布成功");
    });

    function addComment(applyId){
        req.body.apply_id = applyId;
        req.models.comment.add(req.body);
    }
}

exports.leaderCheck = function(req,res){
    var state = req.body.state;
    if(state == -1){
        //仅做评论
        req.models.comment.add(req,body,res);
    }
    else{
        //修改状态
        Promise.all([
            req.models.apply.leaderReview(req,body),
            req.models.comment.add(req,body)
        ]).then(function(){
            ajax.success(res,"审核成功");
        });
    }
}

exports.safeCheck = function(req,res){
    var state = req.body.state;
    if(state == '-'){
        //仅做评论
        req.models.comment.add(req,body,res);
    }
    else{
        //修改状态
        Promise.all([
            req.models.apply.safeReview(req,body),
            req.models.comment.add(req,body)
        ]).then(function(){
            ajax.success(res,"审核成功");
        });
    }
}

exports.opCheck = function(req,res){
    var state = req.body.state;
    if(state == -1){
        //仅做评论
        req.models.comment.add(req,body,res);
    }
    else{
        //修改状态
        Promise.all([
            req.models.apply.finalReview(req,body),
            req.models.comment.add(req,body)
        ]).then(function(){
            ajax.success(res,"审核成功");
        });
    }
}