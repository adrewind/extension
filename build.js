// This script creates zip archive with extension
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const webpack = require('webpack');
const gutil = require('gutil');
const webpackConfig = require('./webpack');


class ExtensionBuilder {

    constructor(outdir, outfile, srcpath = '.') {
        this.outdir = outdir;
        this.outfile = outfile;
        this.srcpath = srcpath;
        this.archive = archiver('zip');

        this.blacklist = /^(build|features|node_modules|src|tests|build\.js|config\.js|package\.json|postcss\.js)$/g;
    }

    build() {
        const resources = this.discoverResources();
        resources.forEach(r => this.addResource(r));

        this.setOutput();
        this.archive.finalize();
    }

    setOutput() {
        const latest = fs.createWriteStream(path.join(this.outdir, 'latest.zip'));
        const output = fs.createWriteStream(path.join(this.outdir, this.outfile));

        this.archive.on('error', (err) => {
            throw err;
        });

        this.archive.pipe(output);
        this.archive.pipe(latest);
    }

    addResource(resource) {
        const isFile = fs.lstatSync(resource).isFile();
        if (isFile) {
            this.archive.file(resource);
        } else {
            this.archive.directory(resource);
        }
    }

    discoverResources() {
        return fs.readdirSync(this.srcpath)
                 .filter(localpath => !localpath.startsWith('.'))
                 .filter(localpath => !localpath.match(this.blacklist));
    }

}


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


(async function build() {
    const wpack = new WebpackBuilder();
    await wpack.build();

    // TODO: Read version from manifest
    const builder = new ExtensionBuilder('build', 'extension-0.0.3.zip');
    // const builder = new ExtensionBuilder('build/extension.zip');
    builder.addResource('icons');
    builder.build();
}());
