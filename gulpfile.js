var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var path = require('path');
var bs = require('browser-sync').create();
var ROOT = path.resolve(__dirname);
var APP = path.resolve(ROOT, 'app.js');
var ROUTERS = path.resolve(ROOT, 'routes');
var VIEW =  path.resolve(ROOT, 'views');

// our browser-sync config + nodemon chain
gulp.task('browser-sync', ['nodemon'], function() {
    bs.init(null, {
        proxy: "http://localhost:3000",
        port: 4000
    });
});

// the real stuff
gulp.task('default', ['browser-sync'], function () {
    // gulp.watch('./views/**/*.html', bs.reload);
    gulp.watch(['./routes/**/*.js','./modules/*','./database/*', './app.js', './bin/www','./views/**/*.html'], ['bs-delay']);
});

// give nodemon time to restart
gulp.task('bs-delay', function () {
    setTimeout(function () {
        bs.reload();
        console.log('重启完毕!');
    }, 2000);
});

gulp.task('nodemon', function (cb) {
    var started = false;
    nodemon({
        script: './bin/www',
        ext: "js html",
        env: { 'NODE_ENV': 'development' },
        watch: [
            ROUTERS,
            APP,
            VIEW
        ]
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    })
});
