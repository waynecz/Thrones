$(function () {
    $('button')
        .on('click', function () {
            $.get('/tst');
        }).css('color', "red" )
});
