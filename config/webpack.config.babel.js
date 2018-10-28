
import webpack from 'webpack'
import path from 'path'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import VueLoaderPlugin from 'vue-loader/lib/plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

export default ({mode}) => {
    console.log(' -> MODE::', mode)
    
    const isDev = mode === 'development',
        isProd = !isDev;
    
    let extractCSS = new ExtractTextPlugin({
        disable: false,
        allChunks: true,
        filename: 'static/style/css-[name].css?v=[chunkhash]',
    })
    
    let extractLESS = new ExtractTextPlugin({
        filename: '[name].css?v=[chunkhash]',
        disable: false,
    });
    
    return {
        mode,
        entry: {
            index: './client/src/index.js',
        },
        output: {
            publicPath: '/',
            filename: '[name].js?v=[hash]',
            path: `${__dirname}/../client/dist`,
            chunkFilename: 'static/[name].js?v=[hash]',
            // namedChunkFilename: "static/js/[name]-[chunkhash].js",
            chunkCallbackName: '/static/',
        },
        devtool: isDev? 'cheap-inline-module-source-map': false,
        module: {
            rules: [{
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { 'modules': false }],
                            // ['es2015', { 'modules': false }],
                            // 'stage-0',
                        ]
                    }
                }],
                exclude: /node_modules/
            }, {
                test: /\.css$/,
                use: extractCSS.extract([ 'css-loader?minimize',/* 'css-loader?minimize'*//*, 'postcss-loader'*/ ]),
            }, {
                test: /\.less$/,
                use: extractLESS.extract({
                    use: [/*{
                        loader: 'vue-style-loader',
                    },*/ {
                        loader: 'css-loader',
                    }, {
                        loader: 'less-loader', 
                        options: {
                            paths: [
                                path.resolve(__dirname, '..', 'client', 'src', 'less'),
                                path.resolve(__dirname, '..', 'node_modules'),
                            ],
                        },
                    }],
                    fallback: 'style-loader'
                })
            }, {
                test: /\.(svg|eot|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'file-loader?name=static/fonts/[name].[ext]',
            }, {
                test: /\.pug$/,
                // use: [{
                //     loader: 'pug-plain-loader',
                // }],
                oneOf: [
                      // this applies to <template lang="pug"> in Vue components
                      {
                        resourceQuery: /^\?vue/,
                        use: ['pug-plain-loader']
                      },
                      // this applies to pug imports inside JavaScript
                      {
                        use: ['raw-loader', 'pug-plain-loader']
                      }
                ],
            }, {
                test: /\.vue$/,
                use: [{
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            js: 'babel-loader'
                        },
                        babel: {
                            babelrc: false,
                            presets: ['@babel/preset-env', { 'modules': false }],
                            plugins: ['@babel/plugin-transform-destructuring', ['@babel/plugin-proposal-object-rest-spread', { 'useBuiltIns': true }]],
                        },
                    },
                }/*, 'babel-loader'*/],
            }],
        },
        resolve: {
            // extensions: [/*'.ts', '.tsx', */'.js'/*, '.jsx'*/],
            // extensions: ['.vue', '.js'],
            extensions: ['*', '.js', '.vue', '.json'],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                // docRoot: __dirname + '/../../document root',
                // app: `${__dirname}/app`,
            },
            // modules: [
            //     'node_modules',
            //     path.resolve(__dirname, 'src'),
            // ],
        },
        plugins: [
            new webpack.DefinePlugin({
                isDev,
                isProd,
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            extractLESS,
            extractCSS,
            new VueLoaderPlugin(),
            new HTMLWebpackPlugin({
                path: `${__dirname}/../client/dist`,
                // filename: 'index.html',
                template: 'client/src/index.pug',
            }),
            new CopyWebpackPlugin([{
                to: `${__dirname}/../client/dist`,
                from: `${__dirname}/../client/static`,
            }]),
        ],
    }
}