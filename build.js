// This script creates zip archive with extension
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');


class ExtensionBuilder {

    constructor(outdir, outfile, srcpath = '.') {
        this.outdir = outdir;
        this.outfile = outfile;
        this.srcpath = srcpath;
        this.archive = archiver('zip');

        this.blacklist = /^(node_modules|build|features|tests|package\.json|build\.js)$/g;
    }

    build() {
        const resources = this.discoverResources();
        resources.forEach((r) => this.addResource(r));

        this.setOutput();
        this.archive.finalize();
    }

    setOutput() {
        const latest = fs.createWriteStream(path.join(this.outdir, "latest.zip"));
        const output = fs.createWriteStream(path.join(this.outdir, this.outfile));

        this.archive.on('error', function(err) {
            throw err;
        });

        this.archive.pipe(output);
        this.archive.pipe(latest);
    }

    addResource(path) {
        const isFile = fs.lstatSync(path).isFile();
        if (isFile) {
            this.archive.file(path);
        } else {
            this.archive.directory(path);
        }
    }

    discoverResources() {
        return fs.readdirSync(this.srcpath)
                 .filter(path => !path.startsWith('.'))
                 .filter(path => !path.match(this.blacklist));
    }

}


// TODO: Read version from manifest
const builder = new ExtensionBuilder('build', 'extension-0.0.3.zip');
// const builder = new ExtensionBuilder('build/extension.zip');
builder.addResource('icons');
builder.build();
