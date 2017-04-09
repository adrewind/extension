
class Annotations {

    constructor() {
        this.ignore = false;
        this.toggle = adrElements.findAnnotationsToggle();
    }

    isShown() {
        return this.toggle.getAttribute('aria-checked') === 'true';
    }

    show() {
        if (!this.isShown() && !this.ignore) {
            this.toggle.click();
        }
    }

    hide() {
        if (this.isShown()) {
            this.toggle.click();
            this.ignore = false;
        } else {
            this.ignore = true;
        }
    }

}
