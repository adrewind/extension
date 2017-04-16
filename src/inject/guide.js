
// TODO: Write tests for it
class ADRGuideViewer {

    constructor() {
        this.image = null;
        this.container = ADRGuideViewer.findControls();
        this.element = ADRGuideViewer.createElement();
        this.container.appendChild(this.element);

        this.images = {
            'guide-hello': { squeezeBottom: 16 },
            'guide-ad-menu': { height: 141, width: 219, shiftBottom: -70, shiftRight: 11 },
            'guide-playhead': { height: 179, width: 463, shiftBottom: 25.5, shiftRight: -45 },
            'guide-removal': { height: 303, width: 387, shiftBottom: -250, shiftRight: 45 },
        };
    }

    show() {
        this.element.style.display = '';
    }

    hide() {
        this.element.style.display = 'none';
    }

    static findControls() {
        return document.getElementsByClassName('html5-video-player')[0] || null;
    }

    static createElement() {
        const container = document.createElement('div');
        container.classList.add('adr-guide-container');

        return container;
    }

    replaceImage(imgTag) {
        if (this.image) {
            this.image.remove();
        }
        this.show();
        this.image = imgTag;
        this.image.addEventListener('click', () => this.hide());
        this.element.appendChild(imgTag);
    }

    showScreen(name, locale) {
        const imageURL = chrome.extension.getURL(`images/${name}-${locale}.svg`);
        const { shiftBottom = 0, shiftRight = 0 } = this.images[name];
        // const { height, width, shiftBottom = 0, shiftRight = 0 } = this.images[name];

        const image = document.createElement('img');
        image.classList.add('screen-image');
        image.src = imageURL;

        image.style.width = `calc(100% + ${shiftRight}px)`;
        image.style.height = `calc(100% - ${shiftBottom}px)`;

        this.replaceImage(image);
    }

    showHint(name, locale) {
        const imageURL = chrome.extension.getURL(`images/${name}-${locale}.svg`);
        const { height, width, shiftBottom = 0, shiftRight = 0 } = this.images[name];

        const image = document.createElement('img');
        image.classList.add('tip-image');
        image.src = imageURL;

        image.style.bottom = 0;
        image.style.right = 0;
        image.style.height = `${height}px`;

        this.width = width;
        this.height = height;
        this.shiftBottom = shiftBottom;
        this.shiftRight = shiftRight;

        this.replaceImage(image);
    }

    stickTo(element) {
        const container = element.getBoundingClientRect();
        // const image = this.image.getBoundingClientRect();

        const imageCenter = {
            x: container.right - (this.width / 2),
            y: container.bottom - (this.height / 2),
        };

        const bottom = (container.bottom - imageCenter.y) + this.shiftBottom;
        const right = (container.right - imageCenter.x) + this.shiftRight;

        this.image.style.bottom = `${bottom}px`;
        this.image.style.right = `${right}px`;
    }
}


class ADRGuide {

    constructor(player) {
        this.storage = chrome.storage.local;
        this.locale = ADRGuide.getLocale();
        this.video = player.video;
        this.viewer = new ADRGuideViewer();

        this.viewer.hide();
        this.findElements();

        this.storage.get('###guide', (found) => {
            if ('###guide' in found) {
                return;
            }
            this.showHello();
        });
        // this.showPlayheadHelp();
    }

    static getLocale() {
        const accepted = ['ru', 'en'];
        const actual = navigator.language;

        if (accepted.includes(actual)) {
            return actual;
        }
        return 'en';
    }

    findElements() {
        this.menu = document.getElementsByClassName('adr-ad-sel-menu')[0];
        this.helpText = document.getElementsByClassName('adr-ad-help-text')[0];
        this.adButton = document.getElementsByClassName('adr-mark-ad-button')[0];
    }

    showHello() {
        this.viewer.showScreen('guide-hello', this.locale);

        const showpulse = () => {
            this.showButtonPulse();
            this.viewer.element.removeEventListener('click', showpulse);
        };
        this.viewer.element.addEventListener('click', showpulse);
    }

    showButtonPulse() {
        this.adButton.classList.add('adr-pulse');

        const nopulse = () => {
            this.adButton.classList.remove('adr-pulse');
            this.adButton.removeEventListener('adr-click', nopulse);

            this.highlightBar(); // TODO: Find better place for it
        };
        this.adButton.addEventListener('click', nopulse);
    }

    highlightBar() {
        // FIXME: why it doesn't work?
        this.helpText.classList.add('highlight');
        this.helpText.classList.add('inactive');

        setTimeout(() => this.helpText.classList.remove('inactive'), 60);
        setTimeout(() => this.helpText.classList.add('inactive'), 2500);

        this.storage.set({ '###guide': 1 });
    }

    showPlayheadHelp() {
        const showSecond = () => {
            const playhead = document.getElementsByClassName('adr-playhead-right')[0];
            if (!playhead) {
                return;
            }
            this.viewer.showHint('guide-removal', this.locale);
            this.viewer.stickTo(playhead);

            this.viewer.element.removeEventListener('click', showSecond);
        };

        const showFirst = () => {
            const playhead = document.getElementsByClassName('adr-playhead-right')[0];
            if (!playhead) {
                return;
            }
            this.viewer.showHint('guide-playhead', this.locale);
            this.viewer.stickTo(playhead);
            this.video.pause();

            this.viewer.element.addEventListener('click', showSecond);
        };

        const wait = () => {
            setTimeout(showFirst, 2700);
            this.helpText.removeEventListener('click', wait);
        };

        this.helpText.addEventListener('click', wait);
    }

}


// TODO: use it in future to close ad before opening fragments bar
// TODO: also this selector must be more specific
// document.getElementsByClassName('close-button')[0].click()

export default async function showGuide(player) {
    // const hash = window.location.hash;
    //
    // if (hash.match(/adr-no-guide/ig)) {
    //     return;
    // }
    chrome.adrGuide = new ADRGuide(player);

    // guide.showHint('guide-hello', 'en');
    // guide.stickTo(adButton);

    // guide.showScreen('guide-hello', 'ru');
}
