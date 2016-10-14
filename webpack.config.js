var path       = require("path");
module.exports = {
    entry:   {
        pikaday: "pikaday"
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
        presets: ["es2015"]
    },
    resolve: {
        extensions:         ['', '.js'],
        modulesDirectories: ['src', 'node_modules']
    },
    output:  {
        path:          "./dist",
        filename:      "[name].js",
        library:       ["[name]"],
        libraryTarget: "umd"
    }
};
