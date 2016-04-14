var path         = require('path');
var autoprefixer = require('autoprefixer');
var webpack      = require('webpack');

//一些文件夹的路径
var ROOT_PATH  = path.resolve(__dirname);
var SRC_PATH   = path.resolve(ROOT_PATH, 'src');
var MODULE_PATH = path.resolve(ROOT_PATH, './node_modules');

module.exports = {
    context: path.join(__dirname, 'public'),
    entry  : [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        '../src'
        ],
    output : {
        path      : '/',
        filename  : 'bundle.js',
        publicPath: '/javascripts'
    },
    module : {
        loaders: [
            {
                test   : /\.scss$/,
                loaders: ['style', 'css', 'postcss', 'sass'],
                include: SRC_PATH
            }
        ]
    },
    postcss: function () {
        return [autoprefixer];
    },
    resolve: {
      alias: {
          jquery: "../node_modules/jquery/dist/jquery.min"
      }  
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
};