import { VIDEO_CHECK_FREQ } from './config';


// FIXME: decompose this module, it is too messy
class ADRElements {

    constructor() {
        this.findBody();
        this.findVideoTag();
        this.findControlsContainer();
        this.findRightControls();
        this.findADContainer();
        this.addIDScript();
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

    findADContainer() {
        this.videoContainer = document.getElementsByClassName('ad-container')[0] || null;
        return this.videoContainer;
    }

    findAnnotationsToggle() {
        const gear = document.getElementsByClassName('ytp-settings-button')[0];
        if (!gear) {
            return null;
        }
        gear.click();
        gear.click();
        return document.querySelector('[role="menuitemcheckbox"]:nth-child(2)');
    }

    adIsShowing() {
        // TODO: fix this function, .ad-showing class doesn't removes
        // after banner above timline is closed
        const container = this.findADContainer();

        if (!container) {
            return false;
        }

        const content = container.children;

        if (!content || !content.length) {
            return false;
        }

        // TODO: test this solution
        return content[0].classList.contains('videoAdUi');
        // return container.classList.contains('ad-showing');
    }

    getVideoURL() {
        const link = this.getVideoLink();
        const href = link && link.href;
        return href || document.URL;
    }

    getVideoLink() {
        return document.querySelector('[data-sessionlink="feature=player-title"][href]');
    }

    getUserID() {
        const div = document.getElementById('adr-youtube-channel-id');

        if (!div || !div.dataset || !div.dataset.channel) {
            return null;
        }

        return div.dataset.channel;
    }

    addIDScript() {
        const script = document.createElement('script');
        script.innerHTML = `(function() {
            function getUserID() {
                let params;
                let ghelp;
                let chanid;

                try {
                    params = window.ytInitialData.responseContext.serviceTrackingParams;
                    ghelp = params.filter(i => i.service === "GUIDED_HELP")[0];
                    chanid = ghelp.params.filter(i => i.key === "creator_channel_id")[0];
                } catch (e) {
                    return null;
                }

                return chanid.value || null;
            }
            const body = document.getElementsByTagName('body')[0];
            const div = document.createElement('div');

            div.id = 'adr-youtube-channel-id';
            div.dataset.channel = getUserID();

            body.appendChild(div);
        })();`;
        document.head.appendChild(script);
    }
}
export const adrElements = new ADRElements();


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
        callback();

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
        return new Promise((resolve) => {
            const wait = setInterval(() => {
                const found = adrElements.findVideoTag();
                if (!found) { return; }

                resolve();
                clearInterval(wait);
            }, VIDEO_CHECK_FREQ);
        });
    }
}
export const adrObserver = new ADRObserver();


export class NoElementError extends Error {}
