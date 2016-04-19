/**
 * Created by Administrator on 14-3-6.
 * Modify by Waynecz on 16-3-12.
 */
(function ($) {
    // 消息提示拓展
    var escapeString = function (str) {
        return str.indexOf('<script>') > -1 ? $('<div>').text(str).html() : str;
    };
    $.extend({
        msg: {
            pop: function (msg, type, speed, time) {
                var types = {
                    'success': 'success',
                    'info'   : 'info',
                    'warning': 'warning',
                    'danger' : 'danger'
                };
                var flag  = typeof msg === 'string' || typeof msg === 'number';
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
                msg             = escapeString(msg);
                var popTemplate = '<div class="pop-msg ' + type + '"><span class="pop-msg-text">' + msg + '</span></div>';
                var popEle      = $(popTemplate);


                $(popEle).one("click", function () {
                    popEle.fadeOut(700, function () {
                        popEle.remove();
                    });
                });

                var container = document.getElementById('msg-container');
                if (container === null) {
                    // create notification container
                    container    = document.createElement('div');
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
                setTimeout(function () {
                    popEle.animate({marginTop: '-52px', opacity: 0}, 700, function () {
                        popEle.remove();
                    })


                }, biasTime);
            }
        }
    });
})(jQuery);