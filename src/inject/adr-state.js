

class ADRElements {

    constructor() {
        function findBody() {
            return document.getElementsByTagName('body')[0];
        }

        function findVideoTag() {
            return document.getElementsByTagName('video')[0];
        }

        function findControlsContainer() {
            return document.getElementsByClassName('ytp-chrome-bottom')[0];
        }

        this.body = findBody();
        this.video = findVideoTag();
        this.controlsContainer = findControlsContainer();
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
