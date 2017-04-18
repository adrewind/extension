
export default class PlayerEvents {

    constructor(videoEl) {
        if (!videoEl) {
            throw new Error('invalid video tag');
        }
        this.videoEl = videoEl;
    }

    srcChanged(callback) {
        callback();

        const observer = new MutationObserver(callback);
        const config = {
            attributes: true,
            attributeFilter: ['src'],
        };
        observer.observe(this.videoEl, config);

        return observer;
    }

    playerResize(callback) {
        const observer = new MutationObserver(callback);
        const config = {
            attributes: true,
            attributeFilter: ['style'],
        };
        observer.observe(this.videoEl, config);

        return observer;
    }

}
