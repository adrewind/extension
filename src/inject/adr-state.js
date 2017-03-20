

class ADRElements {

    constructor() {
        this.findBody();
        this.findVideoTag();
        this.findControlsContainer();
        this.findRightControls();
    }

    findBody() {
        this.body = document.getElementsByTagName('body')[0];
    }

    findVideoTag() {
        this.video = document.getElementsByTagName('video')[0];
    }

    findControlsContainer() {
        this.controlsContainer = document.getElementsByClassName('ytp-chrome-bottom')[0];
    }

    findRightControls() {
        this.rightControls = document.getElementsByClassName('ytp-right-controls')[0];
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
        const observer = new MutationObserver(callback);
        const config = {
            attributes: true,
            attributeFilter: ['src'],
        };
        observer.observe(adrElements.video, config);

        return observer;
    }
}


const adrElements = new ADRElements();
const adrObserver = new ADRObserver();
