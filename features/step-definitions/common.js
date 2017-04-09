const { until } = require('selenium-webdriver');
const { WAIT_LOCATED, WAIT_DISPLAY } = require('../support/constants');


async function shouldSeeElement(driver, query) {
  const condition = until.elementLocated(query);
  await driver.wait(condition, WAIT_LOCATED);

  const element = await driver.findElement(query);
  const condition2 = until.elementIsVisible(element);

  await driver.wait(condition2, WAIT_DISPLAY);
}

module.exports = { shouldSeeElement };
