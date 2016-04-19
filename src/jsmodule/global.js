$(function () {
    var path = window.location.pathname;
    $('#nav a').each(function (i, e) {
        var ele = $(e);
        if (ele.attr('href') == path) {
            ele.addClass('active');
        }
    })
});