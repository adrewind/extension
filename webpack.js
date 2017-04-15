const gutil = require('gutil');
const webpack = require('webpack');
const config = require('./config');


const webpackConfig = {
    entry: {
        inject: config.entry.injectJS,
        background: config.entry.bgJS,
    },
    output: {
        path: config.bundleDir,
        filename: '[name].js',
    },
    devtool: '#inline-source-map',
    plugins: [
        // Add global variables to
        new webpack.DefinePlugin(config.globals),
    ],
};


class WebpackBuilder {

    constructor() {
        this.log = text => gutil.log('[webpack:build]', text);
        this.error = err => new gutil.PluginError('webpack:build', err);
    }

    build() {
        return new Promise(resolve =>
            webpack(webpackConfig, (err, stats) => {
                if (err) {
                    throw this.error(err);
                }
                this.printStats(stats);
                return resolve();
            })
        );
    }

    static formatStats(stats) {
        return stats.toString({
            chunks: false, // Makes the build much quieter
            colors: true,
        });
    }

    printStats(stats) {
        const formatted = WebpackBuilder.formatStats(stats);
        return this.log(formatted);
    }

}

function webpackBuild() {
    const builder = new WebpackBuilder();
    return builder.build();
}

module.exports = webpackBuild;
