
export default class PlayerAnnotations {

    constructor() {
        this.ignore = false;
        this.toggle = null;
    }

    /*
     * Caution. Do not use it while ads is showing, because youtube shows different controls.
     */
    findToggle() {
        const gear = document.getElementsByClassName('ytp-settings-button')[0];
        if (!gear) {
            return null;
        }
        gear.click();
        gear.click();
        this.toggle = document.querySelector('[role="menuitemcheckbox"]:nth-child(2)');
        return this.toggle;
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
