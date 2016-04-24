require('./../jsmodule/ui-select');
require('./../jsmodule/thrones');
require('./../jsmodule/pop-msg');
require('./../jsmodule/global');

$(function () {
    var action = {
        // 获取申请类型并联动申请对象
        getType   : function () {
            if ($('#auth.ui-select').length) {
                $.jax({
                    url : '/data/apply_type/listByPid',
                    data: {pid: 0}
                }).done(function (res) {
                    $('#auth.ui-select').selectInit({
                        dataList: res.data,
                        callback: function (index, selectObj) {
                            var postData = {};
                            postData.pid = selectObj.value;
                            $.jax({
                                url : '/data/apply_type/listByPid',
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
        getMyList: function () {
            $.getList({url: '/data/apply/pageQuery'}, {
                user_id: $('#user').attr('data-id')
            });
        },
        doApplyAdd: function () {
            if (xhrCtrl['addApply']) {
                $.msg.pop('正在提交,请稍等..')
                return false
            }
            var flag = $.checkBeforePost('#addForm');
            if (!flag) {
                $.msg.pop('存在填写错误', 'warning');
                return false;
            }
            var postData = $.generatePostData('#addForm');
            $.jax({
                url : '/apply',
                data: postData,
                ctrl: 'addApply',
                button: $('#pageSwitcher')
            }).done(function (res) {
                action.getR01List()
                $.resetForm('#modal');
                action.switchPage();
                $.msg.pop('申请成功');
            })
        },
        switchPage: function () {
            var modal = $('#modal');
            $.resetForm('#modal');
            if (modal.hasClass('in-view')) {
                modal.removeClass('in-view').addClass('out-view');
                $('#pageSwitcher').attr('data-button', '+');
            } else {
                modal.removeClass('out-view').addClass('in-view');
                $('#pageSwitcher').attr('data-button', '-');
            }
            $('#doAddApply').toggleClass('active');
        },
        showComment   : function (target) {
            // target.toggleClass('show-comment')
            target.get(0).classList.toggle('show-comment');
            if (!target.hasClass('show-comment')) {
                target.find('.comment-wraper').hide();
            } else {
                target.find('.comment-wraper').show();
                $.calCommentDisplayTime();
            }
        }
    };

//----------------------------------------------------------------------------------------------------------------------------------------------------------
    action.getType();
    action.getMyList();
    // 提交申请
    $('#modal')
        .on('click', '#doAddApply', function (e) {
            e = window.event || e;
            e.stopPropagation();
            action.doApplyAdd();
        });
    // 新增申请和列表页切换
    $('.page-switcher-wraper')
        .on('click', '#pageSwitcher:not(.disabled)', function () {
            action.switchPage();
        });
    // 评论相关事件
    $('#contentWrap')
        .on('click', '[data-operation=doComment]', function (e) {
            e = e || window.event;
            e.stopPropagation();
            $.doCommentOrCheck($(this));
        })
        .on('click', '.data-content', function () {
            action.showComment($(this))
        })
        .on('click', '.comment-inputer, .comment-detail', function (e) {
            e = e || window.event;
            e.stopPropagation();
        })
});
