require('chromedriver');
const seleniumWebdriver = require('selenium-webdriver');
const { defineSupportCode } = require('cucumber');

const chrome = require('selenium-webdriver/chrome');


function CustomWorld() {
    this.driver = ((new seleniumWebdriver.Builder())
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options()
            .addExtensions('build/latest.zip')
            .addArguments('--mute-audio'))
        .build());
}

defineSupportCode(({ setWorldConstructor, setDefaultTimeout, After }) => {
    setDefaultTimeout(30 * 1000);
    setWorldConstructor(CustomWorld);

    After(function quit() { return this.driver.quit(); });
});
