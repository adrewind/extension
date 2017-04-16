const { defineSupportCode } = require('cucumber');
const { openExtensionPage } = require('../support/extension');


defineSupportCode((functions) => {
    const given = functions.Given;
    // const when = functions.When;
    // const then = functions.Then;

    given('Local storage state is {stringInDoubleQuotes}', async function _given(data) {
        const object = JSON.parse(data.replace(/'/g, '"'));

        await openExtensionPage(this.driver);
        await this.driver.executeScript('chrome.storage.local.set(arguments[0], () => null)', object);
    });
});
