

class ADRElements {

    constructor() {
        this.body = this.findBody();
        this.video = this.findVideoTag();
        this.controlsContainer = this.findControlsContainer();
    }


    findBody() {
        return document.getElementsByTagName('body')[0];
    }

    findVideoTag() {
        return document.getElementsByTagName("video")[0];
    }

    findControlsContainer() {
        return document.getElementsByClassName("ytp-chrome-bottom")[0];
    }
}


class ADRObserver {

    // constructor() {}

    onPlayerResize(callback) {
        const observer = new MutationObserver(callback);
        const config = {
            attributes: true,
            attributeFilter: ["style"]
        };
        observer.observe(adrElements.video, config);

        return observer;
    }

    onVideoTimeupdate(callback) {

    }
}


const adrElements = new ADRElements();
const adrObserver = new ADRObserver();
