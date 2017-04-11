const { defineSupportCode } = require('cucumber');
const { shouldSeeElement } = require('./common');
const { expect } = require('chai');


defineSupportCode((functions) => {
  const given = functions.Given;
  const when = functions.When;
  const then = functions.Then;

  given('I on the {stringInDoubleQuotes} page', function _given(page) {
    return this.driver.get(page + '#adr-no-guide');
  });

});
