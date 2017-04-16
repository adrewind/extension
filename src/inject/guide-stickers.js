
// TODO: Write tests for it
export default class ADRGuideViewer {

    constructor() {
        this.image = null;
        this.container = ADRGuideViewer.findControls();
        this.element = ADRGuideViewer.createElement();
        this.container.appendChild(this.element);
        this.container.addEventListener('click', () => this.hide());

        this.images = {
            'guide-hello': { squeezeBottom: 16 },
            'guide-ad-menu': { height: 141, width: 219, shiftBottom: 0, shiftRight: 0 },
            'guide-playhead': { height: 179, width: 463, shiftBottom: -148, shiftRight: -35 },
            'guide-removal': { height: 303, width: 387, shiftBottom: -249, shiftRight: -34 },
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
        this.element.appendChild(imgTag);
    }

    showScreen(name, locale) {
        const imageURL = chrome.extension.getURL(`images/${name}-${locale}.svg`);
        const { shiftBottom = 0, shiftRight = 0 } = this.images[name];

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
        image.style.height = `${height}px`;

        this.width = width;
        this.height = height;
        this.shiftBottom = shiftBottom;
        this.shiftRight = shiftRight;

        this.replaceImage(image);
    }

    stickTo(element) {
        const anchor = element.getBoundingClientRect();
        const container = this.element.getBoundingClientRect();

        const top = (anchor.top - container.top) + this.shiftBottom + (anchor.height / 2);
        const left = (anchor.left - container.left) + this.shiftRight + (anchor.width / 2);

        this.image.style.top = `${top}px`;
        this.image.style.left = `${left}px`;
    }
}

