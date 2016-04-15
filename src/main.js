require('./ui-select');
require('./thrones');
require('./pop-msg');
require('../node_modules/art-template/dist/template');
$(function () {

    var action = {
        doCreateApply: function () {

        },
        switchPage   : function () {
            var modal = $('#modal')
            modal.hasClass('in-view')
                ? modal.removeClass('in-view').addClass('out-view')
                : modal.removeClass('out-view').addClass('in-view');
        }
    };

//----------------------------------------------------------------------------------------------------------------------------------------------------------
    $('#submitApply')
        .on('click', function (e) {
            e = window.event || e;
            e.stopPropagation();
            log($.generatePostData('addForm'));
            var postData          = {};
            postData              = $.generatePostData('addForm');
            postData['model']     = 'apply_type';
            postData['operation'] = 'add';
            $.jax({
                url : '/data',
                type: 'get',
                data: postData
            })
        })
    $('#pageSwitcher')
        .on('click', function () {
            action.switchPage();
        })
});

$(function () {
    var action = {
        getDepartment: function () {
            if ($('#dept.ui-select').length) {
                $.jax({
                    url : '/data/department/all',
                    type: 'get'
                }).done(function (res) {
                    var rst = [];
                    res.data.map(function (dp) {
                        rst.push({text: dp.name, value: dp.id});
                    });
                    $('#dept.ui-select').selectInit({
                        dataList: rst
                    })
                })
            }
        },
    };
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    action.getDepartment();
    $('#signUp')
        .on('click', function (e) {
            var postData           = $.generatePostData('signUpForm');
            postData['unique_msg'] = '存在相同用户名';
            $.jax({
                url   : '/data/user/add',
                type  : 'post',
                data  : postData,
                errmsg: 'aaaa'
            }).done(function (res) {

            })
        })
});

function log(p) {
    console.log(p)
}
