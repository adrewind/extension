// This script creates zip archive with extension
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const config = require('./config');
const postcssBuild = require('./postcss');
const webpackBuild = require('./webpack');


class ExtensionBuilder {

    constructor(outdir, outfile, srcpath = '.') {
        this.outdir = outdir;
        this.outfile = outfile;
        this.srcpath = srcpath;
        this.archive = archiver('zip');

        this.whiteList = /^(_locales|bundle|icons|images|manifest\.json)$/g;
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
                 .filter(localpath => localpath.match(this.whiteList));
    }

}


(async function build() {
    await webpackBuild();
    await postcssBuild();
    fs.writeFileSync(config.bundle.bgHTML, fs.readFileSync(config.entry.bgHTML));

    // TODO: Read version from manifest
    const builder = new ExtensionBuilder('build', 'extension-0.0.4.zip');
    // const builder = new ExtensionBuilder('build/extension.zip');
    // builder.addResource('icons');
    builder.build();
}());
