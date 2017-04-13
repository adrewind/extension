const { defineSupportCode } = require('cucumber');
const { shouldSeeElement } = require('./common');

const { WAIT_FOR_PLUGIN } = require('../support/constants');


defineSupportCode((functions) => {
  const given = functions.Given;
  const when = functions.When;
  const then = functions.Then;

  when('I click {stringInDoubleQuotes} element', function _when(selector) {
    const query = { css: selector };
    const element = this.driver.findElement(query);
    return element.click();
  });

  then('I click AD button', async function _when() {
    const query = { css: '.adr-mark-ad-button' };
    // TODO: make plugin faster, get rid of it
    await shouldSeeElement(this.driver, query, WAIT_FOR_PLUGIN);
    const element = this.driver.findElement(query);
    await element.click();
  })

  then('I should see {stringInDoubleQuotes} element', function _then(selector) {
    const query = { css: selector };
    return shouldSeeElement(this.driver, query);
  });

  then('I should see AD button', function _then() {
    const query = { css: '.adr-mark-ad-button' };
    return shouldSeeElement(this.driver, query, WAIT_FOR_PLUGIN);
  })
});
