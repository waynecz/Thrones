require('./ui-select');
require('./thrones');
require('./pop-msg');
// 提交控制

$(function () {
    var action = {
        // 获取申请类型并联动申请对象
        getType        : function () {
            if ($('#auth.ui-select').length) {
                $.jax({
                    url: '/data/apply_type/listByPid',
                    data: {pid: 0}
                }).done(function (res) {
                    $('#auth.ui-select').selectInit({
                        dataList: res.data,
                        callback: function (index, selectObj) {
                            var postData = {};
                            postData.pid = selectObj.value;
                            $.jax({
                                url: '/data/apply_type/listByPid',
                                data: postData
                            }).done(function (res) {
                                $('#auth_detail.ui-select').selectInit({
                                    dataList: res.data
                                });
                            })
                        }
                    })
                })
            }
        },
        doApplyAdd     : function () {
            var postData = $.generatePostData('#addForm');
            $.jax({
                url : '/data/apply/addApply',
                data: postData
            }).done(function (res) {

            })
        },
        switchPage     : function () {
            var modal = $('#modal')
            if (modal.hasClass('in-view')) {
                modal.removeClass('in-view').addClass('out-view');
                $('#pageSwitcher').attr('data-button', '+');
                $('#doAddApply').removeClass('active');
            } else {
                modal.removeClass('out-view').addClass('in-view');
                $('#pageSwitcher').attr('data-button', '-');
                $('#doAddApply').addClass('active');
            }
        }
    };

//----------------------------------------------------------------------------------------------------------------------------------------------------------
    action.getType();

    // 提交申请
    $('#modal')
        .on('click', '#doAddApply', function (e) {
            e = window.event || e;
            e.stopPropagation();
            action.doApplyAdd();
        });
    // 新增申请和列表页切换
    $('.page-switcher-wraper')
        .on('click', '#pageSwitcher', function () {
            action.switchPage();
        })
});

//**************************************************************************************************************************************************************************

//注册登录页私有
$(function () {
    var Wayne = {
        switchSign: function (targetBtn, targetFormId) {
            targetBtn.siblings('button').removeClass('active ready');
            targetBtn.addClass('active');
            $.resetForm(targetFormId);
            $(targetFormId).siblings('.login-form').addClass('shadow');
            $(targetFormId).removeClass('shadow');
        },
        doSignUp  : function () {
            var flag = $.checkBeforePost('#add');
            if (xhrCtrl['signup']) {
                $.msg.pop('正在提交.', 'warning');
                return false;
            }
            if (!flag) {
                $.msg.pop('填写错误', 'warning');
                return false;
            }
            var postData = $.generatePostData('#add');

            $.jax({
                url   : '/data/user/add',
                data  : postData,
                ctrl  : 'signup',
                button: $('#doSignUp')
            }).done(function (res) {
                $.msg.pop('注册成功!', 'success');
                Wayne.switchSign($('#dosSignIn'), '#login');
            })
        },
        doSignIn  : function () {
            var flag = $.checkBeforePost('#login');
            if (xhrCtrl['signin']) {
                $.msg.pop('正在提交.', 'warning');
                return false;
            }
            if (!flag) {
                $.msg.pop('字段不能为空', 'warning');
                return false;
            }
            var postData = $.generatePostData('#login');

            $.jax({
                url   : '/data/user/login',
                data  : postData,
                ctrl  : 'signin',
                button: $('#doSignIn')
            }).done(function (res) {
                window.location.href = '/';
            })
        }
    };
//-------------------------------------------------------------------------------------------------------------------------------------------------
    // 获取部门信息
    $.getDepartment();
    // 注册登录
    $('#buttonWraper')
        .on('click', '#dosSignIn, #doSignUp', function () {
            var me        = $(this),
                operation = me.attr('data-operation');
            if (me.hasClass('disabled')) {
                return false;
            }
            if (me.hasClass('active')) {
                operation == 'add' ? Wayne.doSignUp() : Wayne.doSignIn();
            } else {
                Wayne.switchSign(me, '#' + operation)
            }
        })
});

function log(p) {
    console.log(p)
}
