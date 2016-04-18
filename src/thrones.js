/**
 * 仅限于用在Thrones
 * 依赖 pager art-template ui-select
 * 功能: ajax方法改写 获取各种列表 计算提交数据 刷新按钮及多选框状态 重置表单 删除
 */
;window.xhrCtrl = {};
window.template = require('../node_modules/art-template/dist/template');
(function ($) {
    $.extend({
        jax                        : function (options) {
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
        render : function(id,data){
            template.helper('dateFormat',function(val,pattern){
                if(val == null || val == ''){
                    return '-'
                }
                if(val.indexOf('0000-00-00') == 0){
                    return '-';
                }
                pattern = pattern || 'datetime';
                switch (pattern){
                    case 'datetime' :
                        return val;
                    case 'date':
                        return val.slice(0,10);
                    case 'spectial':
                        return showTime(val);
                    default :
                        return val;
                }
            });


            template.config('openTag','[[');
            template.config('closeTag',']]');
            return template(id,data);
        },
        getList                    : function (pageNum, options) {
            if (xhrCtrl.getList) {
                $.msg.pop('再点船就翻了...', 'warning');
                return false;
            }


            var postData = {};
            var pageSize = parseInt($("#changePageSize").selectValue());

            var xdd = {
                operation: undefined
            };
            if (options) {
                var setting = $.extend(xdd, options);
                for (i in options) {
                    postData[i] = options[i];
                }
            }
            $.extend(postData, $.generatePostData($('#conditionForm')));
            postData['curPage']  = pageNum || 1;
            postData['pageSize'] = pageSize || 10;

            var dfd = $.Deferred();

            $.jax({
                data  : postData,
                button: $('#doSearch'),
                ctrl  : 'getList'
            }).done(function (data) {
                if (data.attr.page) {
                    $("#pager").pager({
                        pagenumber         : data.attr.page.currentPage,
                        pagecount          : data.attr.page.totalPage,
                        buttonClickCallback: function (pageclickednumber) {
                            $.getList(pageclickednumber, options);
                        }
                    });
                    $('#totalCountNum').text(data.attr.page.totalCount);
                }
                // 日期格式化
                Handlebars.registerHelper("date", function (value) {
                    if (value == '') {
                        return '-';
                    } else {
                        return new Date(value).format('yyyy-MM-dd hh:mm:ss');
                    }
                });
                // json字符化
                Handlebars.registerHelper("jsonToString", function (value) {
                    if (value == '') {
                        return '-';
                    } else {
                        return JSON.stringify(value);
                    }
                });
                // get细节
                Handlebars.registerHelper("getTitle", function (value) {
                    if (value == '') {
                        return '-';
                    } else {
                        var temRst = JSON.parse(value);
                        return temRst.name || temRst.title || temRst.file_name || '-';
                    }
                });
                Handlebars.registerHelper("getPlatform", function (value) {
                    if (value == '') {
                        return '-';
                    } else {
                        var temRst = JSON.parse(value);
                        return temRst.platform || '-';
                    }
                });
                Handlebars.registerHelper("monitorStstus", function (value) {
                    if (value == 'LOCKED' || value == 'ERROR') {
                        return '开始监控';
                    } else {
                        return '停止监控';
                    }
                });
                // 一些数据映射
                var map = {
                    manual: '手动添加',
                    auto  : '自动导入'
                };
                if ($('#sourceType').length) {
                    var sourceTypesMap = {};
                    var sourceTypes    = $('#sourceType li');
                    sourceTypes.each(function (i, e) {
                        var wayne                                = $(e);
                        sourceTypesMap[wayne.attr('data-value')] = wayne.text();
                    });
                    $.extend(map, sourceTypesMap)
                }
                if ($('#sourceStatus').length) {
                    var sourceStatusMap = {};
                    var sourceStatus    = $('#sourceStatus li');
                    sourceStatus.each(function (i, e) {
                        var wayne                                 = $(e);
                        sourceStatusMap[wayne.attr('data-value')] = wayne.text();
                    });
                    $.extend(map, sourceStatusMap)
                }
                if ($('#handleResult').length) {
                    var handleResultMap = {};
                    var handleResult    = $('#handleResult li');
                    handleResult.each(function (i, e) {
                        var wayne                                 = $(e);
                        handleResultMap[wayne.attr('data-value')] = wayne.text();
                    });
                    $.extend(map, handleResultMap)
                }
                var assetOwnersMap = {};
                if (window.assetMap != undefined || window.assetMap != null) {
                    assetOwnersMap = assetMap;
                }
                // 资产者映射
                Handlebars.registerHelper("getAssetOwner", function (value) {
                    var rst = '';
                    if (value == '' || value == undefined || value == null) {
                        rst = '-';
                        return rst;
                    }
                    var owners = value.split(',');
                    owners.map(function (assetowner) {
                        if (assetOwnersMap[assetowner] == undefined) {
                            rst += '';
                        } else {
                            rst += '<p class="other">' + assetOwnersMap[assetowner] + '</p>'
                        }
                    });
                    rst == '' ? rst = '-' : rst = rst;

                    return rst;
                });
                // 数据为空显示 - 防止塌陷
                Handlebars.registerHelper("notEmpty", function (value) {
                    var rst = value;
                    if (map[rst]) {
                        rst = map[rst];
                    }
                    if (rst == '' || rst == undefined || rst == null) {
                        rst = '-'
                    }
                    return rst;
                });
                // 资产明细为空显示 - 防止塌陷
                Handlebars.registerHelper("assetNotEmpty", function (value) {
                    var rst = value;
                    if (rst == '' || rst == undefined || rst == null || rst == {}) {
                        rst = '-'
                    } else {
                        rst = '';
                    }
                    return rst;
                });

                var source   = $("#list-template").html();
                var template = Handlebars.compile(source);
                var context  = data.attr.resultList;
                var html     = template(context);
                $('#presentation-body').empty().html(html);
                $.refreshCheckAllAndBtnStatus();
                var sideNavHeightSuggestion = $('main').height() > 1200 ? $('main').height() : 1200;
                dfd.resolve();
            });
            return dfd.promise()
        },
        generatePostData           : function (targetId) {
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
                targetAttr    = 'name';
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
        refreshCheckAllAndBtnStatus: function () {
            var checkBoxs = $('[name=uuid]', '#presentation-body');
            var checkAll  = $('#kingslanding');
            if (checkAll.length && checkBoxs.length) {
                var totlaDuck = checkBoxs.length;
                var livedDuck = checkBoxs.filter(':checked').length;
                if (!livedDuck) {
                    $('#updateBtn, #delBtn').addClass('disabled');
                } else if (livedDuck === 1) {
                    $('#updateBtn').removeClass('disabled');
                    $('#delBtn').removeClass('disabled');
                } else {
                    $('#updateBtn').addClass('disabled');
                    $('#delBtn').removeClass('disabled');
                }
                totlaDuck != 0 && livedDuck == totlaDuck ? checkAll.prop('checked', true) : checkAll.prop('checked', false);
            }
        },
        checkBeforePost: function (targetFormId) {
            var fields = $('.form-unit', targetFormId),
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
        resetForm                  : function (targetFormId) {
            var tgt = $(targetFormId);
            tgt.find('.form-unit').removeClass('warn');
            tgt.find('.input').val('');
            tgt.find('.ui-select').each(function (i, e) {
                $(e).selectIndex(-1);
            });
        },
        delete                     : function (operation, options) {
            if (xhrCtrl.delete) {
                $.msg.pop('大爷您慢点点啊..', 'info');
                return false;
            }
            var missionTarget   = $('[name=uuid]:checked'),
                missionTargetId = '',
                i;
            missionTarget.each(function (i, e) {
                (i != missionTarget.length - 1) ?
                    missionTargetId += $(e).attr('data-sid') + ',' :
                    missionTargetId += $(e).attr('data-sid');
            });
            var postData          = {};
            postData['operation'] = operation || 'delete';
            postData['sids']      = missionTargetId;

            if (options) { // 之前采用的addition方式有点渣..
                for (i in options) {
                    postData[i] = options[i];
                }
            }
            var dfd = $.Deferred();
            $.jax({
                data  : postData,
                button: $('#delBtn'),
                ctrl  : 'delete'
            }).done(function (data) {
                var curPage = parseInt($('.pgCurrent', '#pager').text());
                if (options && options.manualGetList) {
                    dfd.resolve(curPage);
                } else {
                    $.getList(curPage);
                    $.msg.pop('删除成功', 'success');
                    $('#TheHatefulEight').popOff();
                }
            });
            return dfd.promise();
        },
        justDoIt                   : function (operation, missionTargetId, options, pendingDataSpecific) {
            if (xhrCtrl.justDoIt) {
                $.msg.pop('大爷您慢点点啊..', 'info');
                return false;
            }

            var postData = {};
            var xdd      = {
                operation: undefined
            };
            if (options) {
                var setting = $.extend(xdd, options);
                if (setting.addition) {
                    setting.addition.map(function (single) {
                        postData[single.key] = single.value;
                    })
                }
            }
            postData['operation'] = operation;
            if (operation == 'delete') {
                postData['sids'] = missionTargetId;
            } else {
                postData['sid'] = missionTargetId;
            }


            $.jax({
                data  : postData,
                button: $('.justDoIt', '#TheHatefulEight'),
                ctrl  : 'justDoIt'
            }).done(function (data) {
                var curPage = parseInt($('.pgCurrent', '#pager').text());
                $.msg.pop('操作成功!!', 'success');
                $('#TheHatefulEight').popOff();
                setTimeout(function () {
                    $.getList(curPage, pendingDataSpecific);
                }, 2000)

            });
        },
        getDepartment  : function () {
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
        
    })
})(jQuery);
