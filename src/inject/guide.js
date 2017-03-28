
class ADRGuide {

    constructor() {
        const controls = this.findHUI();
        this.container = controls;

        this.element = this.createElement();
        this.container.appendChild(this.element);

        this.images = {
            'guide-ad-menu': { height: 141, width: 219, shiftBottom: -70, shiftRight: 11 },
        }
    }

    findHUI() {
        return document.getElementsByClassName('html5-video-player')[0] || null;
    }

    createElement() {
        const container = document.createElement('div');
        container.classList.add('adr-guide-container');

        return container;
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
        this.image = image;
        this.shiftBottom = shiftBottom;
        this.shiftRight = shiftRight;
        this.element.appendChild(image);
    }

    stickTo(element) {
        const container = element.getBoundingClientRect();
        const image = this.image.getBoundingClientRect();

        const imageCenter = {
            x: container.right - (this.width / 2),
            y: container.bottom - (this.height / 2),
        };

        const bottom = container.bottom - imageCenter.y + this.shiftBottom;
        const right = container.right - imageCenter.x + this.shiftRight;

        this.image.style.bottom = `${bottom}px`;
        this.image.style.right = `${right}px`;
    }
}


// TODO: use it in future to close ad before opening fragments bar
// document.getElementsByClassName('close-button')[0].click()

/*
adrObserver.waitForVideo().then(() => {
    const adButton = document.getElementsByClassName('adr-mark-ad-button')[0];
    const guide = new ADRGuide();

    guide.showHint('guide-ad-menu', 'en');
    guide.stickTo(adButton);
});
*/
