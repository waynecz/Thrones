require('./../jsmodule/ui-select');
require('./../jsmodule/thrones');
require('./../jsmodule/pop-msg');

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
                url   : '/signup',
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
                url   : '/signin',
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
        });
    $('#add')
        .on('keydown', 'input', function (e) {
            e = e || window.event;
            if (e.keyCode == 13)  $('#dosSignUp').trigger('click');
        });
    $('#login')
        .on('keydown', 'input', function (e) {
            e = e || window.event;
            if (e.keyCode == 13)  $('#dosSignIn').trigger('click');
        })
});