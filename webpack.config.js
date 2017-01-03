var path = require('path');
var webpack = require('webpack');
var SpritesmithPlugin = require('webpack-spritesmith');
var CopyPlugin = require('copy-webpack-plugin');
var nodeEnv = process.env.NODE_ENV;
var production = nodeEnv && nodeEnv.indexOf('prod') > -1;
var ImageminPlugin = require('imagemin-webpack-plugin').default;

var config = {
    resolve: {
        modulesDirectories: ['node_modules', 'bower_components']
    },
    debug: true,
    devtool: 'source-map',
    entry: ['./src/entry.js'],
    output: {
        path: './dist',
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {test: /\.png$/, loader: 'file?name=images/sprite.png'},

            {test: /\.(woff|woff2)$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
            {test: /\.ttf$/, loader: "file-loader"},
            {test: /\.eot$/, loader: "file-loader"},
            {test: /\.svg$/, loader: "file-loader"}
        ],
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main'])
        ),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(__dirname, 'src/images'),
                glob: '*.png'
            },
            target: {
                image: path.resolve(__dirname, 'src/images/build/sprite.png'),
                css: path.resolve(__dirname, 'src/less/build/sprite.less')
            },
            apiOptions: {
                cssImageRef: '~sprite.png'
            }
        }),
        new CopyPlugin([
            {from: './src/index.html'},
            {from: './src/images/logo_gray-blue_80px.svg', to: 'images/logo_gray-blue_80px.svg'},
        ]),
        new ImageminPlugin({
            disable: process.env.NODE_ENV !== 'prod',
            pngquant: {
                quality: '95-100'
            }
        }),
    ],
    devServer: {
        contentBase: './src'
    }
};

if (production) {
    config.module.loaders.push({
        test: /\.less$/,
        loader: "style-loader!css-loader!csso-loader!autoprefixer-loader?browsers=last 2 version!less-loader"
    });
} else {
    config.module.loaders.push({test: /\.less$/, loader: "style-loader!css-loader!less-loader"});
}

module.exports = config;