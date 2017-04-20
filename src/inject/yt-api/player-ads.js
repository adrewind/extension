import { ELEMENT_LOCATE_FREQ } from '../../config';


export default class PlayerAds {

    constructor() {
        this.root = document;
    }

    findADContainer() {
        return this.root.getElementsByClassName('ad-container')[0] || null;
    }

    isShowing() {
        const container = this.findADContainer();
        if (!container) {
            return false;
        }

        const content = container.children;
        if (!content || !content.length) {
            return false;
        }

        return content[0].classList.contains('videoAdUi');
    }

    untilEnds() {
        return new Promise((resolve) => {
            let interval;

            const wait = () => {
                if (this.isShowing()) {
                    return;
                }
                resolve();
                clearInterval(interval);
            };

            interval = setInterval(wait, ELEMENT_LOCATE_FREQ);
        });
    }

}
