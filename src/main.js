require('./ui-select');
require('./thrones');
require('./pop-msg');
require('../node_modules/art-template/dist/template');
// 提交控制

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

//**************************************************************************************************************************************************************************

//注册登录页私有
$(function () {
    var Wayne = {
        getDepartment: function () {
            if ($('#dept.ui-select').length) {
                $.jax({
                    url : '/data/department/all'
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
        switchSign   : function (targetBtn, targetFormId) {
            targetBtn.siblings('button').removeClass('active ready');
            targetBtn.addClass('active');
            Wayne.resetForm(targetFormId);
            $(targetFormId).siblings('.login-form').addClass('shadow');
            $(targetFormId).removeClass('shadow');
        },
        checkBeforePost: function (targetFormId) {
            var fields = $('.form-unit', targetFormId),
                total = fields.length,
                count = total,
                tipMsg = '';
            fields.each(function (i, e) {
                var ele = $(e),
                    select = ele.find('.ui-select'),
                    text = ele.find('.input'),
                    content = '';

                if (select.length) {
                    content = select.selectValue();
                } else if (text.length) {
                    content = text.val();
                }
                
                if (content == '') {
                    count --;
                    ele.addClass('warn');
                } else {
                    ele.removeClass('warn');
                }

            });
            return (count == total);
        },
        resetForm: function (targetFormId) {
            var tgt = $(targetFormId);
            tgt.find('.form-unit').removeClass('warn');
            tgt.find('.input').val('');
            tgt.find('.ui-select').each(function (i, e) {
                $(e).selectIndex(-1);
            });
        },
        doSignUp: function () {
            var flag = Wayne.checkBeforePost('#add');
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
                url: '/data/user/add',
                data: postData,
                ctrl: 'signup',
                button: $('#doSignUp')
            }).done(function (res) {
                $.msg.pop('注册成功!', 'success');
                Wayne.switchSign($('#dosSignIn'), '#login');
            })
        },
        doSignIn: function () {
            var flag = Wayne.checkBeforePost('#login');
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
                url: '/data/user/login',
                data: postData,
                ctrl: 'signin',
                button: $('#doSignIn')
            }).done(function (res) {
                
            })
        }
    };
//-------------------------------------------------------------------------------------------------------------------------------------------------
    Wayne.getDepartment();

    $('#buttonWraper')
        .on('click', '#dosSignIn, #doSignUp',function () {
            var me        = $(this),
                operation = me.attr('data-operation');
            if ( me.hasClass('disabled') ) {
                return false;
            }
            if ( me.hasClass('active'))  {
                operation == 'add' ? Wayne.doSignUp() : Wayne.doSignIn();
            } else {
                Wayne.switchSign(me, '#'+operation)
            }
        })
});

function log(p) {
    console.log(p)
}
