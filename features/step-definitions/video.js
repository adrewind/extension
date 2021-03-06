const chai = require('chai');
const { until } = require('selenium-webdriver');
const { defineSupportCode } = require('cucumber');
const { shouldSeeElement } = require('./common');
const { WAIT_LOCATED, WAIT_VIDEO_LOAD,
        YT_UNSKIPABLE_WAIT, YT_SKIP_WAIT } = require('../support/constants');

chai.should();


defineSupportCode((functions) => {
    const given = functions.Given;
    const when = functions.When;
    const then = functions.Then;

    given('I am watch {stringInDoubleQuotes} video', function _given(videoID) {
        const url = `https://www.youtube.com/watch?v=${videoID}`;
        return this.driver.get(url);
    });

    given('I skip In-Stream ad if it needed', async function _given() {
        const query = { css: '.ad-container > .videoAdUi' };
        const condition = until.elementLocated(query);
        let container;

        try {
            container = await this.driver.wait(condition, WAIT_LOCATED);
        } catch (e) {
            return;
        }

        const querySkip = { css: '.videoAdUiSkipButton' };
        try {
            const skipButton = await shouldSeeElement(this.driver, querySkip,
                                                      YT_SKIP_WAIT, YT_SKIP_WAIT);
            await skipButton.click();
        } catch (e) {
            const queryNoskipAd = until.stalenessOf(container);
            await this.driver.wait(queryNoskipAd, YT_UNSKIPABLE_WAIT);
        }
    });

    when('I move mouse out of player', async function _when() {
        const query = { css: '#container,#watch-header' };
        const condition = until.elementLocated(query);
        const element = await this.driver.wait(condition, WAIT_LOCATED);

        const actions = this.driver.actions();
        const move = actions.mouseMove(element);
        await move.perform();
    });

    when('I pause the video', async function _when() {
        const query = { css: '.html5-main-video' };
        const condition = until.elementLocated(query);
        const element = await this.driver.wait(condition, WAIT_VIDEO_LOAD);

        await this.driver.executeScript('arguments[0].pause()', element);
    });

    when('I click on first suggested video', async function _when() {
        // We use two selectors to cover old and new version
        const query = { css: '.yt-lockup .yt-thumb,ytd-grid-video-renderer .ytd-thumbnail' };
        const condition = until.elementLocated(query);
        const thumbnail = await this.driver.wait(condition, WAIT_LOCATED);

        await thumbnail.click();
    });

    then('Current time in player shall be updating', async function _then() {
        const query = { css: '.ytp-time-current' };
        const condition = until.elementLocated(query);
        const element = await this.driver.wait(condition, WAIT_LOCATED);

        const before = element.getText();
        await this.driver.sleep(2000);
        const after = element.getText();

        after.should.be.not.equal(before);
    });
});
