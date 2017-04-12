import { adrElements } from '../adr-state';


export default class Annotations {

    constructor() {
        this.ignore = false;
        this.toggle = adrElements.findAnnotationsToggle();
    }

    isShown() {
        if (!this.toggle) { return null; }
        return this.toggle.getAttribute('aria-checked') === 'true';
    }

    show() {
        if (!this.toggle) { return null; }
        if (!this.isShown() && !this.ignore) {
            this.toggle.click();
        }
    }

    hide() {
        if (!this.toggle) { return null; }
        if (this.isShown()) {
            this.toggle.click();
            this.ignore = false;
        } else {
            this.ignore = true;
        }
    }

}
