const { until } = require('selenium-webdriver');
const { defineSupportCode } = require('cucumber');
const { shouldSeeElement, shouldNotSeeElement } = require('./common');

const { WAIT_LOCATED, WAIT_DISPLAY, WAIT_FOR_PLUGIN } = require('../support/constants');


defineSupportCode((functions) => {
    // const given = functions.Given;
    const when = functions.When;
    const then = functions.Then;

    when('I click {stringInDoubleQuotes} element', function _when(selector) {
        const query = { css: selector };
        const element = this.driver.findElement(query);
        return element.click();
    });

    then('I click AD button', async function _when() {
        const query = { css: '.adr-mark-ad-button' };
        const present = until.elementLocated(query);
        const element = await this.driver.wait(present, WAIT_LOCATED);

        const actions = this.driver.actions();
        const move = actions.mouseMove(element);
        await move.perform();

        // TODO: make plugin faster, get rid of it
        const visible = until.elementIsVisible(element);
        await this.driver.wait(visible, WAIT_DISPLAY);

        await element.click();
    });

    then('I should see {stringInDoubleQuotes} element', function _then(selector) {
        const query = { css: selector };
        return shouldSeeElement(this.driver, query);
    });

    then('I should not see {stringInDoubleQuotes} element', function _then(selector) {
        const query = { css: selector };
        return shouldNotSeeElement(this.driver, query);
    });

    then('I should see AD button', function _then() {
        const query = { css: '.adr-mark-ad-button' };
        return shouldSeeElement(this.driver, query, WAIT_FOR_PLUGIN);
    });
});
