const { defineSupportCode } = require('cucumber');


defineSupportCode((functions) => {
    const given = functions.Given;
    // const when = functions.When;
    // const then = functions.Then;

    given('I on the {stringInDoubleQuotes} channel', function _given(chanID) {
        const url = `https://www.youtube.com/user/${chanID}`;
        return this.driver.get(url);
    });
});
