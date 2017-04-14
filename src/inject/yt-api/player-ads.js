
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

}
