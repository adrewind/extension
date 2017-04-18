const path = require('path');


const injectSrc = 'src/inject';
const backgroundSrc = 'src/bg';
const bundleDir = path.join(__dirname, 'bundle');


module.exports = {
    bundleDir,
    bundle: {
        injectCSS: `${bundleDir}/inject.css`,
        bgHTML: `${bundleDir}/background.html`,
    },
    entry: {
        bgHTML: `${backgroundSrc}/background.html`,
        bgJS: `./${backgroundSrc}/background.js`,
        injectJS: `./${injectSrc}/inject.js`,
        injectCSS: `${injectSrc}/styles/index.css`,
    },
    globals: {
        environment: process.env.NODE_ENV,
    },
};
