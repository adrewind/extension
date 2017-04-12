const path = require('path');


module.exports = {
    entry: {
        inject: './src/inject/inject.js',
        background: './src/bg/background.js',
    },
    output: {
        path: path.join(__dirname, "bundle"),
        filename: "[name].js"
    },
    devtool: "#inline-source-map",
};
