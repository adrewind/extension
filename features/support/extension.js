const { until } = require('selenium-webdriver');
const { WAIT_LOCATED } = require('../support/constants');


async function openExtensionPage(driver) {
    await driver.get('chrome://extensions-frame/');

    const conditionDev = until.elementLocated({ css: '#toggle-dev-on' });
    const button = await driver.wait(conditionDev, WAIT_LOCATED);
    await button.click();

    const conditionExt = until.elementLocated({ css: '.extension-id' });
    const extension = await driver.wait(conditionExt, WAIT_LOCATED);
    const extensionId = await extension.getAttribute('innerText');

    const backgroundPageURL = `chrome-extension://${extensionId}/bundle/background.html`;
    await driver.get(backgroundPageURL);
}

module.exports = { openExtensionPage };
