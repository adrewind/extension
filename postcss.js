const fs = require('fs-promise');
const postcss = require('postcss');
const imports = require('postcss-import');
const config = require('./config');


async function postcssBuilder() {
    const data = await fs.readFile(config.entry.injectCSS);

    const result = await postcss([imports])
        .process(data, {
            from: config.entry.injectCSS,
            to: config.bundle.injectCSS,
        });

    await fs.writeFile(config.bundle.injectCSS, result.css);
    console.log('\npostcss build was successful');
}

module.exports = postcssBuilder;
