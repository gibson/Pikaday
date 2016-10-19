var path       = require("path");
module.exports = {
    entry:   {
        Friday: "pikaday"
    },
    module:  {
        loaders: [
            {
                test:    /\.(js)?$/,
                exclude: /node_modules/,
                loader:  'babel?cacheDirectory=true'
            },
            {
                test:   /\.css$/,
                loader: 'style!css?sourceMap'
            },
            {
                test:   /\.scss$/,
                loader: 'style!css?sourceMap!sass?sourceMap'
            },
            {
                test:   /\.(png)$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test:   /\.json$/,
                loader: 'json'
            }
        ]
    },
    babel:   {
        presets: ["es2015", 'stage-2']
    },
    resolve: {
        extensions:         ['', '.js'],
        modulesDirectories: ['src', 'node_modules']
    },
    devtool: 'source-map',
    output:  {
        path:          "./dist",
        filename:      "friday.js",
        library:       ["[name]"],
        libraryTarget: "umd"
    }
};
