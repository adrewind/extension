const { until } = require('selenium-webdriver');
const { WAIT_LOCATED, WAIT_DISPLAY } = require('../support/constants');


function shouldSeeElement(driver, query) {
  const locating = until.elementLocated(query);

  return driver
    .wait(locating, WAIT_LOCATED)
    .then(() => driver.findElement(query))
    .then(el => driver.wait(until.elementIsVisible(el), WAIT_DISPLAY))
    // .then(el => el.isDisplayed())
    // .then(displayed => expect(displayed).to.be.true)
    ;
}

module.exports = { shouldSeeElement };