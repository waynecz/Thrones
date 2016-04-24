/**
 * 仅限于用在Thrones
 * 依赖 art-template ui-select
 * 功能: ajax方法改写 模版渲染 获取申请列表 计算提交数据 提交前检查 重置表单 计算映射 等...
 */
;
require('./utils');
window.xhrCtrl  = {};
window.template = require('../../node_modules/art-template/dist/template');
(function ($) {
    $.extend({
        jax                  : function (options) {
            var requestUrl = location.pathname,
                lastIndex  = requestUrl.lastIndexOf('.');

            if (lastIndex != -1) {
                requestUrl = requestUrl.substring(0, lastIndex) + '.json';
            } else {
                requestUrl = requestUrl + '.json';
            }

            var xdd = {
                url   : requestUrl,
                data  : {},
                async : true,
                type  : 'post',
                ctrl  : '',
                button: undefined,
                errmsg: '服务器炸了,稍后再试吧 - -||'
            };

            var setting = $.extend(xdd, options);

            if (setting.ctrl) {
                xhrCtrl[setting.ctrl] = true;
            }
            if (setting.button) {
                setting.button.prop('disabled', true).addClass('disabled');
            }
            $('#preloader').fadeIn(150);

            var deferred = $.Deferred();

            $.ajax(setting.url, {
                type    : setting.type,
                dataType: 'json',
                async   : setting.async,
                data    : setting.data
            }).done(function (data) {
                if (data && !data.success) {
                    $.msg.pop(data.message || "发生了奇异的错误", 'warning');
                    deferred.reject();
                } else if (data && data.success) {
                    deferred.resolve(data);
                } else {
                    $.msg.pop("oops! 未收到任何数据");
                    deferred.reject();
                }
            }).fail(function () {
                $.msg.pop(setting.errmsg, 'warning');
                deferred.reject();
            }).always(function () {
                if (setting.ctrl) {
                    xhrCtrl[setting.ctrl] = false;
                }
                if (setting.button) {
                    setting.button.prop('disabled', false).removeClass('disabled');
                }
                $('#preloader').fadeOut(150);
            })
            return deferred.promise();
        },
        render               : function (id, data) {
            template.helper('dateFormat', function (val, pattern) {
                if (val == null || val == '') {
                    return '-'
                }
                if (val.indexOf('0000-00-00') == 0) {
                    return '-';
                }
                pattern = pattern || 'datetime';
                switch (pattern) {
                    case 'datetime' :
                        return val;
                    case 'date':
                        return val.slice(0, 10);
                    case 'spectial':
                        return showTime(val);
                    default :
                        return val;
                }
            });


            template.config('openTag', '[[');
            template.config('closeTag', ']]');
            return template(id, data);
        },
        getList              : function (options, extPostData) {
            if (xhrCtrl.getList) {
                $.msg.pop('别点了!.疼!!', 'warning');
                return false;
            }
            var postData = $.extend({}, extPostData);

            var xdd = {
                operation: undefined
            };
            if (options) {
                var setting = $.extend(xdd, options);
            }
            if (extPostData) {
                for (i in extPostData) {
                    postData[i] = extPostData[i];
                }
            }

            var dfd = $.Deferred();

            $.jax({
                url : setting.url,
                data: postData,
                ctrl: 'getList'
            }).done(function (res) {
                var contentWrap = $('#contentWrap');
                if (res.data.total == 0) {
                    var tipMsgMap = {
                        '/'       : '当前并没有激活的申请',
                        "/pending": '当前不存在需要处理的申请'
                    }
                    contentWrap.find('h2').text(tipMsgMap[window.location.pathname]);
                    return
                }
                // 一些数据映射
                var map = $.generateMap();
                $.templateHelpers(map);

                var data = res.data.data.reverse();
                data.map(function (apply) {
                    if (apply.comments) apply.comments.reverse();
                });
                var rst = $.render('listTemplate', {lists: data});
                contentWrap.empty().html(rst);
                dfd.resolve();
            });
            return dfd.promise()
        },
        generatePostData     : function (targetId) {
            var target        = $(targetId);
            var postData      = {},
                dataContainer = [],
                prefixer      = '',
                targetAttr    = '';

            if (target.hasClass('modal-form') || target.hasClass('login-form')) {
                prefixer      = '';
                targetAttr    = 'id';
                dataContainer = $('.form-unit', target)
            }

            if (target.hasClass('generateFormName')) {
                targetAttr = 'name';
            }

            dataContainer.each(function (i, e) {
                var tony   = $(e);
                var select = tony.find('.ui-select:not(.group)');
                var text   = tony.find('input[type=text]:not(.dataPicker)[placeholder!=请选择]:not(.group), input[type=password]');
                var check  = tony.find('input[type=checkbox]');
                var date   = tony.find('input[type=hidden]');

                if (select.length) {
                    // 下拉框取值
                    postData[keyNameGenerate(select)] = (select.selectValue() == 'all') ? '' : select.selectValue() || '';
                } else if (text.length) {
                    // 文本框取值(包含多选框)
                    postData[keyNameGenerate(text)] = text.val() || '';
                } else if (check.length) {
                    // checkbox取值
                    postData[keyNameGenerate(check)] = check.is(':checked') ? 1 : 0;
                } else if (date.length) {
                    // 时间取值
                    date.each(function (i, e) {
                        postData[keyNameGenerate($(e))] = date.val() || '';
                    })
                } else if (content.length) {
                    // text 内容取值
                    postData[keyNameGenerate(content)] = content.val() || '';
                }

            });

            function keyNameGenerate(target) {
                var key = /^m([A-Z])/.test(target.attr(targetAttr)) || prefixer == 'qm.' ? prefixer : '';
                key += target.attr(targetAttr).replace(/^m([A-Z])/, function ($0, $1) {
                    return $1.toLowerCase()
                });
                return key;
            }

            if (target.hasClass('details-field')) {
                return JSON.stringify(postData);
            } else {
                return postData;
            }
        },
        checkBeforePost      : function (targetFormId) {
            var fields = $('.form-unit:not(.skipCheck)', targetFormId),
                total  = fields.length,
                count  = total,
                tipMsg = '';
            fields.each(function (i, e) {
                var ele     = $(e),
                    select  = ele.find('.ui-select'),
                    text    = ele.find('.input'),
                    content = '';

                if (select.length) {
                    content = select.selectValue();
                } else if (text.length) {
                    content = text.val();
                }

                if (content == '') {
                    count--;
                    ele.addClass('warn');
                } else {
                    ele.removeClass('warn');
                }

            });
            return (count == total);
        },
        resetForm            : function (targetFormId) {
            var tgt = $(targetFormId);
            tgt.find('.form-unit').removeClass('warn');
            tgt.find('.input').val('');
            tgt.find('textarea').val('');
            tgt.find('.ui-select').each(function (i, e) {
                $(e).selectIndex(-1);
            });
        },
        getDepartment        : function () {
            if ($('#department_id.ui-select').length) {
                $.jax({
                    url: '/data/department/all'
                }).done(function (res) {
                    $('#department_id.ui-select').selectInit({
                        dataList: res.data
                    })
                })
            }
        },
        generateMap          : function () {
            var map = {
                '0' : '待审核',
                '1' : '领导通过',
                '2' : '安全通过',
                '3' : '全部通过',
                '-1': '领导拒绝',
                '-2': '安全拒绝',
                '-3': '最后拒绝',
                '4' : '结束',
                '-' : '仅回复',
                '~' : '待审核'
            };

            return map
        },
        templateHelpers      : function (map) {
            // 取得真值
            template.helper('trueVal', function (val) {
                val += '';

                if (val == '' || val == undefined || val == null || val == 'null' || val == 'undefined') {
                    return '-'
                } else if (map[val]) {
                    return map[val]
                } else {
                    return val
                }
            });
            // 扭转数组
            template.helper('reverseArr', function (val) {
                var rst;

                Object.prototype.toString.call(val) === '[object Array]'
                    ? rst = val.reverse()
                    : rst = val || [];

                return rst;
            });
            template.helper('state2color', function (val) {
                var rst = 'info';
                if (val < 0) {
                    rst = 'warning';
                } else if (val > 0) {
                    rst = 'success';
                }
                return rst;
            });
        },
        doCommentOrCheck     : function (sourceBtn) {
            if (xhrCtrl['comment']) {
                $.msg.pop('别点了!.疼!!', 'warning');
                return false
            }
            var commentData = {},
                textarea    = sourceBtn.parent().next('.comment-inputer'),
                remark      = textarea.val() && textarea.val().trim(),
                commentWrap = sourceBtn.parents('.comment-wraper'),
                operation   = sourceBtn.attr('data-operation'),
                url         = '/data/comment/add',
                sucMsg      = '评论成功',
                userId      = $('#user').attr('data-id');
            if (!remark && operation == 'doComment') {
                $.msg.pop('空评论不能提交啊', 'warning');
                return false;
            }
            commentData.remark   = remark;
            commentData.apply_id = commentWrap.attr('data-applyid');
            var postData         = commentData;

            postData['user_id'] = userId;
            if (operation != 'doComment') {
                postData['curState'] = sourceBtn.attr('data-state') - 0;
                postData['state']    = sourceBtn.attr('data-tarstate') - 0;
                url                  = '/applycheck';
                sucMsg               = '审核成功, 三秒后移除该条申请';
            } else {
                postData['apply_state'] = '-';
            }
            var dfd = $.Deferred();
            $.jax({
                url   : url,
                data  : postData,
                ctrl  : 'comment',
                button: $('.doComment')
            }).done(function (res) {
                textarea.val('');
                $.msg.pop(sucMsg, 'success');
                var newComment         = {};
                newComment.remark      = remark;
                newComment.user_name   = $('#user').attr('data-user');
                newComment.time        = new Date().format('yyyy-MM-dd hh:mm:ss');
                newComment['apply_state'] = postData['curState'] || postData['apply_state'] || '';
                var rst                = $.render('commentTemplate', newComment);
                var $rst               = $(rst);
                textarea.after($rst);
                $.calCommentDisplayTime();
                commentWrap.siblings('.data-detail').find('.remarksCount i').text(commentWrap.find('.comment-detail').length);
                if (operation != 'doComment') {
                    dfd.resolve(sourceBtn.parents('.data-content'));
                }
            });
            return dfd.promise();
        },
        calCommentDisplayTime: function () {
            var timeEles = $('.data-content.show-comment .comment-wraper .time', '#contentWrap');

            timeEles.each(function (i, e) {
                var ele  = $(e);
                var text = diffTime(Getime(ele.attr('data-time')));
                ele.text(text);
            });

            function diffTime(time) {
                var now     = Getime(true);
                var numTime = Getime(time, true);
                var diff    = now - numTime;

                if (diff < 0) {
                    log('Excuse me, 你穿越到未来了????')
                    return '不可思议的日期';
                } else if (diff >= 0 && diff < 2 * 1000) {
                    return '刚刚';
                } else if (diff > 2 * 1000 && diff < 60 * 1000) {
                    return Math.ceil(diff / 1000) + '秒前';
                } else if (diff >= 60 * 1000 && diff < 60 * 60 * 1000) {
                    return Math.ceil(diff / (1000 * 60)) + '分钟前';
                } else if (diff >= 60 * 60 * 1000 && diff < 24 * 60 * 60 * 1000) {
                    return Math.ceil(diff / (1000 * 60 * 60)) + '小时前';
                } else if (diff >= 24 * 60 * 60 * 1000 && diff < 30 * 24 * 60 * 60 * 1000) {
                    return new Date(time).format('yy-MM-dd hh:mm')
                } else {
                    return new Date(time).format('yy-MM-dd')
                }
            }
        }
    })
})(jQuery);



