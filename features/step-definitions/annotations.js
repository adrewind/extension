const { defineSupportCode } = require('cucumber');
const { shouldSeeElement } = require('./common');
const { expect } = require('chai');


defineSupportCode((functions) => {
  const given = functions.Given;
  const when = functions.When;
  const then = functions.Then;

  async function getAnnotationsToggle(driver) {
    const gear = { css: '.ytp-settings-button' };
    const toggle = { css: '[role="menuitemcheckbox"]:nth-child(2)' };

    const gearEl = await driver.findElement(gear);
    await gearEl.click();

    const toggleEl = await driver.findElement(toggle);
    return toggleEl;
  }

  when('I enable annotations', async function _when() {
    const toggle = await getAnnotationsToggle(this.driver);
    const enabled = await toggle.getAttribute('aria-checked');

    if (enabled === 'false') {
        await toggle.click();
    }
  });

  when('I disable annotations', async function _when() {
    const toggle = await getAnnotationsToggle(this.driver);
    const enabled = await toggle.getAttribute('aria-checked');

    if (enabled === 'true') {
        await toggle.click();
    }
  });

  then('Annotations must be enabled', async function _when() {
    const toggle = await getAnnotationsToggle(this.driver);
    const enabled = await toggle.getAttribute('aria-checked');

    expect(enabled).to.equal('true');
  });

  then('Annotations must be disabled', async function _when() {
    const toggle = await getAnnotationsToggle(this.driver);
    const enabled = await toggle.getAttribute('aria-checked');

    expect(enabled).to.equal('false');
  });

});
