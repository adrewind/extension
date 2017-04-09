const { defineSupportCode } = require('cucumber');


defineSupportCode((functions) => {
  const given = functions.Given;
  const when = functions.When;
  const then = functions.Then;

  given('I am watch {stringInDoubleQuotes} video', function _given(videoID) {
    const url = `https://www.youtube.com/watch?v=${videoID}#adr-no-guide`;
    return this.driver.get(url);
  });
});
