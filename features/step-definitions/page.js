const { defineSupportCode } = require('cucumber');


defineSupportCode((functions) => {
    const given = functions.Given;
    const when = functions.When;
    // const then = functions.Then;

    given('I on the {stringInDoubleQuotes} page', function _given(page) {
        return this.driver.get(page);
    });

    when('I reload the page', function _when() {
        return this.driver.navigate().refresh();
    });
});
