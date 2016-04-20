require('./../jsmodule/ui-select');
require('./../jsmodule/thrones');
require('./../jsmodule/pop-msg');
require('./../jsmodule/global');

$(function () {
    var action = {
        // 获取申请类型并联动申请对象
        getPendingList: function () {
            $.getList({url: '/data/apply/pageQuery'}, {state: '1'});
        },
        doCheck       : function () {
            if (xhrCtrl['check']) {
                $.msg.pop('正在提交,请稍等..')
                return false
            }
            var flag = $.checkBeforePost('#addForm');
            if (!flag) {
                $.msg.pop('存在填写错误', 'warning');
                return false;
            }
            var postData        = $.generatePostData('#addForm');
            postData['user_id'] = 2;
            $.jax({
                url   : '/apply',
                data  : postData,
                ctrl  : 'check',
                button: $('#doCheck')
            }).done(function (res) {
                action.getPendingList()
                $.resetForm('#modal');
                action.switchPage();
                $.msg.pop('申请成功');
            })
        },
        showComment: function (target) {
            if ( target.hasClass('show-comment') ) {
                target.removeClass('show-comment');
                target.find('.comment-wraper').hide();
            } else {
                target.addClass('show-comment');
                target.find('.comment-wraper').show();
                $.calCommentDisplayTime();
            }
        }

    };

//----------------------------------------------------------------------------------------------------------------------------------------------------------
    action.getPendingList();


    $('#contentWrap')
        .on('click', '.doComment', function (e) {
            e = e || window.event;
            e.stopPropagation();
            $.doComment($(this));
        })
        .on('click', '.data-content', function () {
            action.showComment($(this));
        })
        .on('click', '.comment-inputer', function (e) {
            e = e || window.event;
            e.stopPropagation();
        })
});

