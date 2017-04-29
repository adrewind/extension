
const toggles = new WeakMap();


export default class PlayerAnnotations {

    constructor() {
        this.ignore = false;
    }

    get toggle() {
        if (toggles[this]) {
            return toggles[this];
        }
        toggles[this] = PlayerAnnotations.findToggle();
        return toggles[this];
    }

    static findToggle() {
        const gear = document.getElementsByClassName('ytp-settings-button')[0];
        if (!gear) {
            return null;
        }
        gear.click();
        gear.click();
        return document.querySelector('[role="menuitemcheckbox"]:nth-child(2)');
    }

    isShown() {
        if (!this.toggle) { return null; }
        return this.toggle.getAttribute('aria-checked') === 'true';
    }

    show() {
        if (!this.toggle) { return; }
        if (!this.isShown() && !this.ignore) {
            this.toggle.click();
        }
    }

    hide() {
        if (!this.toggle) { return; }
        if (this.isShown()) {
            this.toggle.click();
            this.ignore = false;
        } else {
            this.ignore = true;
        }
    }

}
