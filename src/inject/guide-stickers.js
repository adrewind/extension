
// TODO: Write tests for it
export default class ADRGuideViewer {

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

