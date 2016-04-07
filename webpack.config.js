var path       = require('path');
var $          = require('jquery')
//定义了一些文件夹的路径
var ROOT_PATH  = path.resolve(__dirname);
var SRC_PATH   = path.resolve(ROOT_PATH, 'src');
var BUILD_PATH = path.resolve(ROOT_PATH, 'public/javascripts');

module.exports = {
    entry  : SRC_PATH,
    output : {
        path    : BUILD_PATH,
        filename: 'bundle.js'
    },
    module : {
        loaders: [
            {
                test   : /\.scss$/,
                loaders : ['style', 'css', 'postcss', 'sass'],
                include: SRC_PATH
            }
        ]
    }
};