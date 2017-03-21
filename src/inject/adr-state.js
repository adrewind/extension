
class ADRElements {

    constructor() {
        this.findBody();
        this.findVideoTag();
        this.findControlsContainer();
        this.findRightControls();
    }

    findBody() {
        this.body = document.getElementsByTagName('body')[0] || null;
    }

    findVideoTag() {
        this.video = document.getElementsByTagName('video')[0] || null;
        return this.video;
    }

    findControlsContainer() {
        this.controlsContainer = document.getElementsByClassName('ytp-chrome-bottom')[0] || null;
        return this.controlsContainer;
    }

    findRightControls() {
        this.rightControls = document.getElementsByClassName('ytp-right-controls')[0] || null;
        return this.rightControls;
    }
}


class ADRObserver {

    // constructor() {}

    onPlayerResize(callback) {
        const observer = new MutationObserver(callback);
        const config = {
            attributes: true,
            attributeFilter: ['style'],
        };
        observer.observe(adrElements.video, config);

        return observer;
    }

    onSRCChanged(callback) {
        if (!adrElements.video) {
            this.waitForVideo().then(() => this.onSRCChanged(callback));
            return null;
        }

        const observer = new MutationObserver(callback);
        const config = {
            attributes: true,
            attributeFilter: ['src'],
        };
        observer.observe(adrElements.video, config);

        return observer;
    }

    onPlaying(callback) {
        const playing = !adrElements.video.paused && !adrElements.video.ended;

        if (playing) {
            callback(null);
            return;
        }

        const onplaying = (e) => {
            adrElements.video.removeEventListener('playing', onplaying);
            callback(e);
        };
        adrElements.video.addEventListener('playing', onplaying);
    }

    waitForVideo() {
        const CHECK_FREQ = 2000; // ms

        return new Promise((resolve) => {
            const wait = setInterval(() => {
                const found = adrElements.findVideoTag();
                if (!found) { return; }

                resolve();
                clearInterval(wait);
            }, CHECK_FREQ);
        });
    }
}

class NoElementError extends Error {}


const adrElements = new ADRElements();
const adrObserver = new ADRObserver();
