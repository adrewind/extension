const { defineSupportCode } = require('cucumber');


defineSupportCode((functions) => {
    const given = functions.Given;
    // const when = functions.When;
    // const then = functions.Then;

    given('I wait {stringInDoubleQuotes} seconds', (seconds, cb) => {
        setTimeout(cb, seconds * 1000);
    });
});
