var webpack = require('webpack');

module.exports = {
    entry : './app/index.js',
    output : {
        path : 'dist',
        filename : 'pin.js'
    },
    module : {
        loaders: [
            { test: /\.hbs$/, loader: "handlebars-loader" },
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    },
    plugins : [
        new webpack.optimize.UglifyJsPlugin()
    ]
};