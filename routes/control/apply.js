
var ajax = require('../../modules/ajax');
var Promise = require('bluebird');
var dateutil = require('../../modules/date');
var print = require('../../modules/print');
var session = require('../../modules/cookie');
exports.add = function(req,res){
    req.models.apply.addApply(req.body)
        .then(addComment)
        .then(function(){
         return ajax.success(res,"发布成功");
    });

    function addComment(applyId){
        req.body.apply_id = applyId;
        req.body.apply_state = 0;
        return req.models.comment.add(req.body);
    }
}

exports.check = function(req,res){
    //检查权限
    //获取状态,默认是当前,如果指定状态,则以最新为准
    var state = req.body.state;
    if(state != '0' || state != '1' || state != '-'){
        return ajax.failure(res,'非法请求');
    }
    var curState = req.body.curState;
    var applyId = req.body.apply_id;

    req.moodels.apply.get({'id':applyId})
        .then(function(data){
            if(data == null){
                return ajax.failure(res,'非法请求,申请不存在');
            }
            var realState = data.state;
            if(curState != realState){
                return ajax.failure(res,'该申请已被审批了,刷新试试');
            }
            //判断当前用户的权限
            var loginUser = session.loginUser(req);
            var role = loginUser.role;
            req.body.user_id = loginUser.id;
            if(role == 'R01'){
                //判断用户是否该申请人的领导
                req.models.user.isLeader({
                    'user_id' : data.user_id,
                    'pid' : loginUser.id
                }).then(function(total){
                    if(total == 0){
                        return ajax.failure(res,'权限不足');
                    }
                    req.body.pid = loginUser.id;
                    leaderCheck(req,res);
                });
            }
            if(role == 'R02'){
                req.body.sid = loginUser.id;
                safeCheck(req,res);
            }
            else if(role == 'RO3'){
                req.body.oid = loginUser.id;
                opCheck(req,res);
            }
            else{
                return ajax.failure(res,'您没权限操作');
            }
        });
    //修改状态
    Promise.all([
        req.models.apply.leaderReview(req,body),
        req.models.comment.add(req,body)
    ]).then(function(){
        ajax.success(res,"审核成功");
    });
}

function leaderCheck(req,res){
    var state = req.body.state;
    req.body.apply_state = state;
    if(state == '-') {
        //不做状态变更
        return req.models.comment.add(req, body, res);
    }
    if(state == 0){
        req.body.state = -1;
    }

    //修改状态
    Promise.all([
        req.models.apply.leaderReview(req,body),
        req.models.comment.add(req,body)
    ]).then(function(){
        ajax.success(res,"审核成功");
    });
}

function safeCheck(req){
    var state = req.body.state;
    req.body.apply_state = state;
    if(state == '-') {
        //不做状态变更
        return req.models.comment.add(req, body, res);
    }
    if(state == 0){
        req.body.state = -2;
    }
    else{
        req.body.state = 2;
    }

    //修改状态
    Promise.all([
        req.models.apply.safeReview(req,body),
        req.models.comment.add(req,body)
    ]).then(function(){
        ajax.success(res,"审核成功");
    });

}

function opCheck(req){

    var state = req.body.state;
    req.body.apply_state = state;
    if(state == '-') {
        //不做状态变更
        return req.models.comment.add(req, body, res);
    }
    if(state == 0){
        req.body.state = -3;
    }
    else{
        req.body.state = 3;
    }

    //修改状态
    Promise.all([
        req.models.apply.finalReview(req,body),
        req.models.comment.add(req,body)
    ]).then(function(){
        ajax.success(res,"审核成功");
    });

}

exports.statistic = function(req,res){
    //统计近七日申请及审核情况
    var gmt_apply_begin = dateutil.gapDay('now',-6);
    var gmt_apply_end = dateutil.gapDay('now',1);

    print.ps(gmt_apply_begin);
    print.ps(gmt_apply_end);
    var param = {
        'gmt_apply_begin' : gmt_apply_begin,
        'gmt_apply_end' : gmt_apply_end
    }

    req.models.apply.statistic(param)
        .then(function(data){
            var result = {};
            for(var i in data){
                var apply = data[i];
                var gmt_apply = todate(apply.gmt_apply);
                if(gmt_apply != '-'){
                    push(result,gmt_apply,'apply');
                }
                var gmt_pid = todate(apply.gmt_pid);
                if(gmt_pid != '-'){
                    push(result,gmt_pid,'leader');
                }
                var gmt_safe = todate(apply.gmt_safe);
                if(gmt_safe != '-'){
                    push(result,gmt_safe,'safe');
                }
                var gmt_end = todate(apply.gmt_end);
                if(gmt_end != '-'){
                    push(result,gmt_end,'op');
                }
            }

            var dates = [];
            var applys = [];
            var leaders = [];
            var safes = [];
            var ops = [];
            // for(var date in result) {
            //     dates.push(date);
            // }
            //
            // dates.sort(function(d1,d2){
            //     return d1 > d2;
            // });


            //统计每天的量
            for(var i=-6;i<1;i++){
                var date = dateutil.gapDay('now',i);
                dates.push(date);
                var item = result[date];
                applys.push(item ? (item['apply'] || 0) : 0);
                leaders.push(item ? (item['leader'] || 0) : 0);
                safes.push(item ? (item['safe'] || 0) : 0);
                ops.push(item ? (item['op'] || 0) : 0);
            }

            var finalResult = {
                dates : dates,
                applys : applys,
                leaders : leaders,
                safes : safes,
                ops : ops
            }
            return ajax.success(res,finalResult);
    })


}


function push(obj,key,key2){
    if(!obj[key]){
        obj[key] = {};
    }
    if(!obj[key][key2]){
        obj[key][key2] = 1;
    }
    else{
        obj[key][key2] ++;
    }
}

function todate(date){
    date = date || '-';
    if(date.length == 19){
        return date.slice(0,10);
    }
    else{
        return '-';
    }
}

//[
//     date1 : {
//         apply : 5,
//         leader : 5,
//         safe : 5,
//         op : 4
// },
// date2 : {
//     apply : 5,
//         leader : 5,
//         safe : 5,
//         op : 4
// },
// date2 : {
//     apply : 5,
//         leader : 5,
//         safe : 5,
//         op : 4
// }
// ]
//
//
// dates:[]
// applys:[]
// leaders:[]
// ops[]
