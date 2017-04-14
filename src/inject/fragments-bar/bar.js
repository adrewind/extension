import FragmentSelection from './fragment';
import { NoElementError } from '../common';


export default class FragmentSelectionBar {

    constructor(player) {
        if (!player.video) {
            throw new NoElementError('video tag is not found');
        }
        if (!player.controlsContainer) {
            throw new NoElementError('youtube controls is not found');
        }

        this.player = player;
        this.video = player.video;
        this.container = player.controlsContainer;
        this.annotations = player.annotations;
        this.annotations.findToggle();

        this.keepInterval = null;
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
        // this.keepShown();
        this.element.style.display = '';
        this.annotations.hide();
    }

    hide() {
        // this.canBeHidden();
        this.element.style.display = 'none';
        this.annotations.show();
    }

    // Prevents hiding controls by Player due to inactivity
    keepShown() {
        this.keepInterval = setInterval(() => {
            const event = createMouseEvent();
            this.element.dispatchEvent(event);
        }, 500);
    }

    canBeHidden() {
        clearInterval(this.keepInterval);
        this.keepInterval = null;
    }

    isShown() {
        return this.element.style.display !== 'none';
    }

    createElement() {
        const menu = document.createElement('div');
        menu.classList.add('adr-ad-sel-menu');

        const help = document.createElement('div');
        help.classList.add('adr-ad-help-text');
        help.innerText = chrome.i18n.getMessage('button_add_new_fragment');
        this.helpText = help;

        menu.appendChild(help);

        return menu;
    }

    onChange(callback) {
        this.onchanged = callback;
    }

    addFragment() {
        const sel = new FragmentSelection(this.player);
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
        this.helpText.innerText = chrome.i18n.getMessage('button_stop_recording');
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
            this.helpText.innerText = chrome.i18n.getMessage('button_add_new_fragment');
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
        this.player.events.playerResize(() => this.redrawAllFragments());
    }

    redrawAllFragments() {
        this.fragments.forEach(fragment => fragment.redraw());
    }

    removeAllFragments() {
        this.fragments.forEach(f => f.destroy());
        this.fragments = [];
    }

    loadFragments(rawFragments) {
        rawFragments.forEach((f) => {
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

function createMouseEvent(type = 'mousemove') {
    const screenX = 50;
    const screenY = 50;
    const clientY = 50;
    const clientX = 50 + (Math.random() * 10);
    const [ctrlKey, altKey, shiftKey, metaKey] = [false, false, false, false];

    const mouseMoveEvent = document.createEvent('MouseEvents');
    mouseMoveEvent.initMouseEvent(
       type,
       true, // canBubble
       false, // cancelable
       window, // event's AbstractView : should be window
       1, // detail : Event's mouse click count
       screenX, screenY,
       clientX, clientY,
       ctrlKey, altKey, shiftKey, metaKey,
       0, // button : 0 = click, 1 = middle button, 2 = right button
       null // relatedTarget : Only used with some event types (e.g. mouseover and mouseout). In other cases, pass null.
    );
    return mouseMoveEvent;
}
