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
        getR01List: function () {
            $.getList({
                url: '/data/apply/pageQuery'
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
            postData['user_id'] = 2;
            $.jax({
                url : '/data/apply/addApply',
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
    action.getR01List();
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
        })
});

function log(p) {
    console.log(p)
}
