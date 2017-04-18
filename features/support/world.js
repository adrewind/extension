require('chromedriver');
const npmPackage = require('../../package.json');
const seleniumWebdriver = require('selenium-webdriver');
const { defineSupportCode } = require('cucumber');

const chrome = require('selenium-webdriver/chrome');


function LocalWorld() {
    this.driver = ((new seleniumWebdriver.Builder())
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options()
            .addExtensions('build/latest.zip')
            .addArguments('--mute-audio'))
        .build());
}

function SauceWorld() {
    const builder = new seleniumWebdriver.Builder();

    const sauce = 'http://ondemand.saucelabs.com:80/wd/hub';
    const caps = {
        // Caution! Use lower-cased name only, because webdriver won't recognize it
        browserName: 'chrome',
        version: '55.0',
        platform: 'Windows 10',
        name: `${npmPackage.name} ${npmPackage.version} test`,
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
    };

    const opts = new chrome.Options()
        .addExtensions('build/latest.zip')
        .addArguments('--mute-audio');

    this.driver = builder
        .usingServer(sauce)
        .withCapabilities(caps)
        .setChromeOptions(opts)
        .build();
}

defineSupportCode(({ setWorldConstructor, setDefaultTimeout, After }) => {
    setDefaultTimeout(30 * 1000);

    if (process.env.SAUCE_USERNAME) {
        setWorldConstructor(SauceWorld);
    } else {
        setWorldConstructor(LocalWorld);
    }

    After(function quit() { return this.driver.quit(); });
});
