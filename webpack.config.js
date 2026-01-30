const path = require('path');
const fs = require('fs');

module.exports = {
    mode: 'development',
    entry: './src/client/clientEntryPoint.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                includePaths: [path.resolve(__dirname, 'dist/assets')]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'node_modules/lance-gg/'),
                    fs.realpathSync('./node_modules/lance-gg/')
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            // Asset modules for webpack 5 (replaces file-loader, url-loader, raw-loader)
            {
                test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|otf|mp3|wav)$/,
                type: 'asset/resource'
            },
            {
                test: /\.json$/,
                type: 'json'
            }
        ]
    },
    resolve: {
        fallback: {
            // Polyfills for node.js core modules used by lance-gg and pixi.js
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "url": require.resolve("url/"),
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer/"),
            "util": require.resolve("util/"),
            "process": require.resolve("process/browser"),
            "fs": false,
            "path": false,
            "crypto": false,
            "net": false,
            "tls": false,
            "zlib": false
        }
    }
};
