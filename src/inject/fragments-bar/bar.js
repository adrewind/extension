
class FragmentSelectionBar {

    constructor() {
        const video = adrElements.findVideoTag();
        const controls = adrElements.findControlsContainer();

        if (!video) {
            throw new NoElementError('video tag is not found');
        }
        if (!controls) {
            throw new NoElementError('youtube controls is not found');
        }

        this.video = video;
        this.container = controls;
        this.annotations = new Annotations();

        this.fragments = [];
        this.recording = false;
        this.element = this.createElement();
        this.onchanged = () => null;

        this.hide();
        this.container.appendChild(this.element);

        this.handleBarClick();
        this.handlePlayerResize();
    }

    show() {
        this.element.style.display = '';
        this.annotations.hide();
    }

    hide() {
        this.element.style.display = 'none';
        this.annotations.show();
    }

    isShown() {
        return this.element.style.display !== 'none';
    }

    createElement() {
        const menu = document.createElement('div');
        menu.classList.add('adr-ad-sel-menu');

        const help = document.createElement('div');
        help.classList.add('adr-ad-help-text');
        help.innerText = chrome.i18n.getMessage("button_add_new_fragment");
        this.helpText = help;

        menu.appendChild(help);

        return menu;
    }

    onChange(callback) {
        this.onchanged = callback;
    }

    addFragment() {
        const sel = new FragmentSelection();
        this.fragments.push(sel);
        this.element.appendChild(sel.element);

        sel.onchanged = () => this.onchanged();

        return sel;
    }

    findFragmentAt(time) {
        const alive = this.fragments.filter(f => !f.dead);
        const found = alive.filter(({ start, end }) => start <= time && time <= end);

        return found[0] || null;
    }

    followPlayback(fragment) {
        fragment.setStartPosition(this.video.currentTime);
        fragment.setEndPosition(this.video.currentTime);

        this.video.play();
        fragment.redraw();
        this.helpText.innerText = chrome.i18n.getMessage("button_stop_recording");
        this.recording = true;

        const timeupdate = () => {
            fragment.setEndPosition(this.video.currentTime);
            fragment.redraw();
        };

        const pause = () => {
            this.onchanged();
            this.video.removeEventListener('ended', pause);
            this.video.removeEventListener('pause', pause);
            this.video.removeEventListener('timeupdate', timeupdate);
            this.helpText.innerText = chrome.i18n.getMessage("button_add_new_fragment");
            this.recording = false;
        };

        fragment.onRemove(pause);
        this.video.addEventListener('ended', pause);
        this.video.addEventListener('pause', pause);
        this.video.addEventListener('timeupdate', timeupdate);
    }

    handleBarClick() {
        this.helpText.addEventListener('click', (e) => {
            e.preventDefault();

            const found = this.findFragmentAt(this.video.currentTime);
            if (found) {
                return null;
            }

            if (this.recording) {
                return this.video.pause();
            }

            const fragment = this.addFragment();
            this.followPlayback(fragment);
            this.video.play();

            return null;
        });
    }

    // TODO: merge following two functions
    handlePlayerResize() {
        adrObserver.onPlayerResize(() => this.redrawAllFragments());
    }

    redrawAllFragments() {
        this.fragments.forEach(fragment => fragment.redraw());
    }

    removeAllFragments() {
        this.fragments.forEach(f => f.destroy());
        this.fragments = [];
    }

    loadFragments(rawFragments) {
        rawFragments.forEach(f => {
            const [start, end] = f;
            const fragment = this.addFragment();

            fragment.setStartPosition(start);
            fragment.setEndPosition(end);
            fragment.redraw();
        });
    }

    exportFragments() {
        const alive = this.fragments.filter(f => !f.dead);
        const frags = alive.map(({ start, end }) => [start, end]);

        return frags.sort((a, b) => a.start - b.start);
    }

    destroy() {
        this.removeAllFragments();
        this.onchanged = () => null;
        this.element.remove();
    }
}
