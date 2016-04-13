/**
 * Created by Administrator on 14-3-6.
 * Modify by Waynecz on 16-3-12.
 */
(function ($) {
    // 拖拽扩展
    $.fn.extend({
        fmdragable: function (trigger) {
            return $(this).each(function (index, domEle) {
                var $this = $(domEle);
                var triggerDom = trigger; //拖拽对象
                if (!trigger) {
                    triggerDom = $this;
                }
                // 鼠标和拖拽dom需要保持的偏移;
                var mouseDom_x = 0,
                    mouseDom_y = 0;
                // 触发拖拽
                function mouseDownAction(e) {
                    e = e || window.event;
                    e.stopPropagation();
                    e.preventDefault();
                    var mouse_x = e.pageX;
                    var mouse_y = e.pageY;
                    var dom_x = $this.prop("offsetLeft");
                    var dom_y = $this.prop("offsetTop");
                    mouseDom_x = mouse_x - dom_x;
                    mouseDom_y = mouse_y - dom_y;
                    $this.addClass("fm-draggable-dragging");
                    $(document).off("mousemove", mouseMoveAction).on("mousemove", mouseMoveAction);
                    $(document).one("mouseup", mouseUpAction);
                }

                // 拖拽
                function mouseMoveAction(e) {
                    e = e || window.event;
                    e.stopPropagation();
                    e.preventDefault();
                    var mouse_x = e.pageX;
                    var mouse_y = e.pageY;
                    $this.css({
                        left: mouse_x - mouseDom_x,
                        top: mouse_y - mouseDom_y
                    });
                }

                // 释放拖拽
                function mouseUpAction(e) {
                    e = e || window.event;
                    e.stopPropagation();
                    e.preventDefault();
                    $(document).off("mousemove", mouseMoveAction);
                    $this.removeClass("fm-draggable-dragging");
                }

                $(triggerDom).off("mousedown", mouseDownAction).on("mousedown", mouseDownAction);
            });
        }
    });

    // 消息提示拓展
    var escapeString = function (str) {
        return str.indexOf('<script>') > -1 ? $('<div>').text(str).html() : str;
    };
    $.extend({
        message: {
            pop: function (msg, type, speed, time) {
                var types = {
                    'success': 'success',
                    'info': 'info',
                    'warning': 'warning',
                    'danger': 'danger'
                };
                var flag = typeof msg === 'string' || typeof msg === 'number';
                if (!types[type]) {
                    type = "";
                }
                if (!flag) {
                    return;
                }
                if (!speed) {
                    speed = 1800;
                }
                if (!time) {
                    time = 900;
                }
                msg = escapeString(msg);
                var popTemplate = '<div class="pop-msg ' + type + '"><span class="pop-msg-text">' + msg + '</span></div>';
                var popEle = $(popTemplate);


                $(popEle).one("click", function () {
                    popEle.fadeOut(700, function () {
                        popEle.remove();
                    });
                });

                var container = document.getElementById('msg-container');
                if (container === null) {
                    // create notification container
                    container = document.createElement('div');
                    container.id = 'msg-container';
                    document.body.appendChild(container);
                }
                $(container).append(popEle);

                var bias = $(".pop-msg").length;
                popEle.fadeIn(300);

                var biasTime = speed;
                if (bias > 1) {
                    for (bias; bias > 1; bias--) {
                        biasTime += Math.max((time - 40 * (bias - 1) * (bias - 1)), 100);
                    }
                }
                ;
                setTimeout(function () {
                    popEle.animate({marginTop: '-52px', opacity: 0}, 700, function () {
                        popEle.remove();
                    })


                }, biasTime);
            },
            alert: function (msg, title, func) { //提示框
                // 当没有msg参数时终止
                if (typeof msg === "undefined") {
                    return;
                }
                // 当页面中没有该对象的时候需要使用的dom模板
                var template = '<div class="pop-alert">' + '<div class="pop-alert-head">' + '<span class="pop-alert-close" title="关闭">×</span>' + '<h3 class="pop-alert-title">' + this.settings.alertTitle + '</h3>' + '</div>' + '<div class="pop-alert-body">' + '<div class="pop-alert-msg">' + '</div>' + '</div>' + '<div class="pop-alert-foot">' + '<span class="pop-alert-btns">' + '<button class="pop-alert-sure pop-alert-btn">' + this.settings.alertBtn + '</button>' + '</span>' + '</div>' + '</div>';
                // dom创建函数
                function createAlert() {
                    var tmp = $(template).hide();
                    tmp.appendTo($("body"));
                    return $(tmp);
                }

                // 支持默认title
                if (typeof title === "function") {
                    func = title;
                }
                // 支持多行msg
                var msgs = [];
                if (typeof msg === "string") {
                    msgs.push(msg);
                } else if ($.isArray(msg)) {
                    msgs = msgs.concat(msg);
                }

                // 获取alert的dom对象
                var _alert = $(".pop-alert").length ? $(".pop-alert:first") : createAlert();
                _alert.find(".pop-alert-title").text((typeof title === "string" ? title : undefined));
                var msgField = _alert.find(".pop-alert-msg").empty();
                $.each(msgs, function (i, m) {
                    m = escapeString(m);
                    msgField.append('<span class="pop-alert-msgLine">' + m + '</span>');
                });
                //关闭
                function close(e) {
                    e = e || window.event;
                    e.stopPropagation();
                    e.preventDefault();
                    _alert.hide();
                    $.modal.off();
                }

                // 初始坐标设置
                var winHeight = $(window).height();
                var winWidth = $(window).width();
                var height = _alert.height();
                var width = _alert.width();
                _alert.css({
                    top: Math.max(winHeight * 0.21 - height * 0.5, 50),
                    left: winWidth * 0.5 - width * 0.5
                });
                // 窗口变化设置
                function resizeAction(e) {
                    e = e || window.event;
                    e.stopPropagation();
                    e.preventDefault();
                    var winHeight = $(window).height();
                    var winWidth = $(window).width();
                    var height = _alert.height();
                    var width = _alert.width();
                    _alert.css({
                        top: Math.max(winHeight * 0.21 - height * 0.5, 50),
                        left: winWidth * 0.5 - width * 0.5
                    });
                }

                $(window).off("resize", resizeAction).on("resize", resizeAction);
                // 事件绑定
                _alert.undelegate();
                _alert.delegate(".pop-alert-sure", "click", function (e) {
                    close(e);
                    $.isFunction(func) ? func(true) : "";
                }).delegate(".pop-alert-cancel", "click", function (e) {
                    close(e);
                    $.isFunction(func) ? func(false) : "";
                }).delegate(".pop-alert-close", "click", function (e) {
                    close(e);
                });
                $.modal.on('marking');
                _alert.css("z-index", parseInt($.modal.zIndex()) + 1);
                var dragTrigger = _alert.find(".pop-alert-head");
                $.fn.fmdragable ? _alert.fmdragable(dragTrigger) : undefined;
                _alert.show();
            },
            dialog: function (msg, title, func, beforeShow) { //对话框
                // 当没有msg参数时终止
                // msg 一般为输入或表单对象
                if (typeof msg === "undefined") {
                    return;
                }
                // 当页面中没有该对象的时候需要使用的dom模板
                var template = '<div class="pop-dialog">' + '<div class="pop-dialog-head">' + '<span class="pop-dialog-close" title="关闭">×</span>' + '<h3 class="pop-dialog-title">' + this.settings.dialogTitle + '</h3>' + '</div>' + '<div class="pop-dialog-body">' + '<div class="pop-dialog-msg">' + '</div>' + '</div>' + '<div class="pop-dialog-foot">' + '<span class="pop-dialog-btns">' + '<button class="btn btn-blue3 pop-dialog-sure pop-dialog-btn">' + this.settings.dialogOk + '</button>' + '<button class="btn btn-white3 pop-dialog-cancel pop-dialog-btn">' + this.settings.dialogCancel + '</button>' + '</span>' + '</div>' + '</div>';
                // dom创建函数
                function createdialog() {
                    var tmp = $(template).hide();
                    tmp.appendTo($("body"));
                    return $(tmp);
                }

                // 支持默认title
                if (typeof title === "function") {
                    func = title;
                }
                // 获取dialog的dom对象
                var dialog = $(".pop-dialog").length ? $(".pop-dialog:first") : createdialog();
                dialog.find(".pop-dialog-title").text((typeof title === "string" ? title : undefined));
                var msgField = dialog.find(".pop-dialog-msg").empty().append(msg);
                //关闭
                function close(e) {
                    e = e || window.event;
                    e.stopPropagation();
                    e.preventDefault();
                    dialog.hide();
                    $.modal.off();
                }

                // 初始坐标设置
                var winHeight = $(window).height();
                var winWidth = $(window).width();
                var height = dialog.height();
                var width = dialog.width();
                dialog.css({
                    top: Math.max(winHeight * 0.21 - height * 0.5, 50),
                    left: winWidth * 0.5 - width * 0.5
                });
                // 窗口变化设置
                function resizeAction(e) {
                    e = e || window.event;
                    e.stopPropagation();
                    e.preventDefault();
                    var winHeight = $(window).height();
                    var winWidth = $(window).width();
                    var height = dialog.height();
                    var width = dialog.width();
                    dialog.css({
                        top: Math.max(winHeight * 0.21 - height * 0.5, 50),
                        left: winWidth * 0.5 - width * 0.5
                    });
                }

                $(window).off("resize", resizeAction).on("resize", resizeAction);
                // 事件绑定
                dialog.undelegate();
                dialog.delegate(".pop-dialog-sure", "click", function (e) {
                    close(e);
                    $.isFunction(func) ? func(true) : "";
                }).delegate(".pop-dialog-cancel", "click", function (e) {
                    close(e);
                    $.isFunction(func) ? func(false) : "";
                }).delegate(".pop-dialog-close", "click", function (e) {
                    close(e);
                    $.isFunction(func) ? func(false) : "";
                });
                $.modal.on('marking');
                dialog.css("z-index", parseInt($.modal.zIndex()) + 1);
                var dragTrigger = dialog.find(".pop-dialog-head");
                $.fn.fmdragable ? dialog.fmdragable(dragTrigger) : undefined;
                if ($.isFunction(beforeShow)) {
                    beforeShow();
                }
                dialog.show();
            },
            confirm: function (msg, title, func) {
                // 当没有msg参数时终止
                if (typeof msg === "undefined") {
                    return;
                }
                // 当页面中没有该对象的时候需要使用的dom模板
                var template = '<div class="pop-confirm">' + '<div class="pop-confirm-head">' + '<span class="pop-confirm-close" title="关闭">×</span>' + '<h3 class="pop-confirm-title">' + this.settings.confirmTitle + '</h3>' + '</div>' + '<div class="pop-confirm-body">' + '<div class="pop-confirm-msg">' + '</div>' + '</div>' + '<div class="pop-confirm-foot">' + '<span class="pop-confirm-btns">' + '<button class="btn btn-blue3 pop-confirm-sure pop-confirm-btn">' + this.settings.confirmOk + '</button>' + '<button class="btn btn-white3 pop-confirm-cancel pop-confirm-btn">' + this.settings.confirmCancel + '</button>' + '</span>' + '</div>' + '</div>';
                // dom创建函数
                function createConfirm() {
                    var tmp = $(template).hide();
                    tmp.appendTo($("body"));
                    return $(tmp);
                }

                // 支持默认title
                if (typeof title === "function") {
                    func = title;
                }
                // 支持多行msg
                var msgs = [];
                if (typeof msg === "string") {
                    msgs.push(msg);
                } else if ($.isArray(msg)) {
                    msgs = msgs.concat(msg);
                }
                // 获取confirm的dom对象
                var confirm = $(".pop-confirm").length ? $(".pop-confirm:first") : createConfirm();
                confirm.find(".pop-confirm-title").text((typeof title === "string" ? title : undefined));
                var msgField = confirm.find(".pop-confirm-msg").empty();
                $.each(msgs, function (i, m) {
                    msgField.append('<span class="pop-confirm-msgLine"></span>');
                    m = escapeString(m);
                    msgField.find(".pop-confirm-msgLine:last").append(m);
                });
                //关闭
                function close(e) {
                    e = e || window.event;
                    e.stopPropagation();
                    e.preventDefault();
                    confirm.hide();
                    $.modal.off();
                }

                // 初始坐标设置
                var winHeight = $(window).height();
                var winWidth = $(window).width();
                var height = confirm.height();
                var width = confirm.width();
                confirm.css({
                    top: Math.max(winHeight * 0.21 - height * 0.5, 50),
                    left: winWidth * 0.5 - width * 0.5
                });
                // 窗口变化设置
                function resizeAction(e) {
                    e = e || window.event;
                    e.stopPropagation();
                    e.preventDefault();
                    var winHeight = $(window).height();
                    var winWidth = $(window).width();
                    var height = confirm.height();
                    var width = confirm.width();
                    confirm.css({
                        top: Math.max(winHeight * 0.21 - height * 0.5, 50),
                        left: winWidth * 0.5 - width * 0.5
                    });
                }

                $(window).off("resize", resizeAction).on("resize", resizeAction);
                // 事件绑定
                confirm.undelegate();
                confirm.delegate(".pop-confirm-sure", "click", function (e) {
                    close(e);
                    $.isFunction(func) ? func(true) : "";
                }).delegate(".pop-confirm-cancel", "click", function (e) {
                    close(e);
                    $.isFunction(func) ? func(false) : "";
                }).delegate(".pop-confirm-close", "click", function (e) {
                    close(e);
                });
                $.modal.on('marking');
                confirm.css("z-index", parseInt($.modal.zIndex()) + 1);
                var dragTrigger = confirm.find(".pop-confirm-head");
                $.fn.fmdragable ? confirm.fmdragable(dragTrigger) : undefined;
                confirm.show();
            },
            settings: {
                confirmTitle: "提示", //"来自" + window.location.host + "的消息",
                confirmOk: "确定",
                confirmCancel: "取消",
                alertTitle: "提示", //"来自" + window.location.host + "的消息",
                alertBtn: "确定",
                dialogTitle: "提示", //"来自" + window.location.host + "的消息",
                dialogOk: "确定",
                dialogCancel: "取消"
            }
        }
    });
})(jQuery);