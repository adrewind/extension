
export default class PlayerEvents {

    constructor(videoEl) {
        if (!videoEl) {
            throw new Error('invalid video tag');
        }
        this.videoEl = videoEl;
        this.playerContainer = document.getElementById('movie_player');
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

    controlsHidden(callback) {
        if (!this.playerContainer) {
            return null;
        }
        const observer = new MutationObserver((mutations) => {
            const element = mutations[0].target;
            const hidden = element.classList.contains('ytp-autohide');
            if (hidden) { callback(); }
        });
        const config = {
            attributes: true,
            attributeFilter: ['class'],
        };
        observer.observe(this.playerContainer, config);

        return observer;
    }

}
