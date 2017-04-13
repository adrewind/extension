const { until } = require('selenium-webdriver');
const { WAIT_LOCATED, WAIT_DISPLAY } = require('../support/constants');


async function shouldSeeElement(driver, query,
                                waitLocated = WAIT_LOCATED,
                                waitDisplay = WAIT_DISPLAY) {
  const condition = until.elementLocated(query);
  await driver.wait(condition, waitLocated);

  const element = await driver.findElement(query);
  const condition2 = until.elementIsVisible(element);

  await driver.wait(condition2, waitDisplay);
}

module.exports = { shouldSeeElement };
