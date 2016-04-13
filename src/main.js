require('./ui-select');
require('./thrones');
require('./pop-msg');
$(function () {
    $('#submitApply')
        .on('click', function (e) {
            e = window.event || e;
            e.stopPropagation();
            log($.generatePostData('addForm'));
            postData = $.generatePostData('addForm')
            postData['model'] = 'apply_type';
            postData['operation'] = 'add';
            $.jax({
                url: '/data',
                type: 'get',
                data: postData
            })
        })
});

function log (p) {
    console.log(p)
}
