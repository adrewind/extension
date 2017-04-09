require('chromedriver');
const seleniumWebdriver = require('selenium-webdriver');
const { defineSupportCode } = require('cucumber');

const chrome = require('selenium-webdriver/chrome');


function CustomWorld() {
  this.driver = ((new seleniumWebdriver.Builder())
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options()
      .addExtensions('build/latest.zip'))
    .build());
}

defineSupportCode(({ setWorldConstructor, setDefaultTimeout, After }) => {
  setDefaultTimeout(30 * 1000);
  setWorldConstructor(CustomWorld);

  After(function () { return this.driver.quit(); });
});
