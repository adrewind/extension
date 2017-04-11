const { defineSupportCode } = require('cucumber');
const { until } = require('selenium-webdriver');
const { WAIT_LOCATED, YT_SKIP_WAIT } = require('../support/constants');


defineSupportCode((functions) => {
  const given = functions.Given;
  const when = functions.When;
  const then = functions.Then;

  given('I am watch {stringInDoubleQuotes} video', function _given(videoID) {
    const url = `https://www.youtube.com/watch?v=${videoID}#adr-no-guide`;
    return this.driver.get(url);
  });

  when('I pause the video', async function _when() {
    const query = { 'css': '.html5-main-video' };
    const condition = until.elementLocated(query);
    const element = await this.driver.wait(condition, WAIT_LOCATED);

    await this.driver.executeScript("arguments[0].pause()", element);
  });

  given('I skip In-Stream ad if it needed', async function _given() {
    const query = { 'css': '.ad-container' };
    const condition = until.elementLocated(query);
    let container;

    try {
      container = await this.driver.wait(condition, WAIT_LOCATED);
    } catch (e) {
      return;
    }

    const classList = await container.getAttribute('class');
    const adIsShowing = classList.includes('videoAdUi');

    if (!adIsShowing) {
      return;
    }

    const querySkip = { 'css': '.videoAdUiSkipButton' };
    const conditionSkip = until.elementLocated(querySkip);
    const skipButton = await this.driver.wait(conditionSkip, YT_SKIP_WAIT);

    await skipButton.click();
  });

  when('I click on first suggested video', async function _when() {
    // We use two selectors to cover old and new version
    const query = { 'css': '.yt-lockup .yt-thumb,ytd-grid-video-renderer .ytd-thumbnail' };
    const condition = until.elementLocated(query);
    const thumbnail = await this.driver.wait(condition, WAIT_LOCATED);

    await thumbnail.click();
  });
});
