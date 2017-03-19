
class Playhead {

    constructor(side, callback) {
        this.side = side;
        this.body = adrElements.body;
        this.container = adrElements.controlsContainer;
        this.onchange = callback;

        this.element = this.createElement();
        this.handleMove();
    }

    createElement() {
        const element = document.createElement("div");
        element.classList.add(`adr-playhead-${this.side}`);
        return element;
    }

    handleMove() {

        function applyConstraints(value, min, max) {
            return Math.max(min, Math.min(max, value));
        }

        this.element.addEventListener("mousedown", (e) => {
            e.preventDefault();

            this.body.addEventListener("mouseup", mouseup);
            this.body.addEventListener("mousemove", mousemove);
        });

        const mouseup = (e) => {
            e.preventDefault();

            this.body.removeEventListener("mouseup", mouseup);
            this.body.removeEventListener("mousemove", mousemove);
        }

        const mousemove = (e) => {
            e.preventDefault();

            const rect = this.container.getBoundingClientRect();
            const diff = e.clientX - rect.left;
            const percent = diff / rect.width;
            const value = applyConstraints(percent, 0, 1);

            this.onchange(value);
        }
    }

}


class FragmentSelection {

    constructor() {
        this.start = 0;
        this.end = 0;
        this.video = adrElements.video;
        this.timeline = adrElements.controlsContainer;
        this.element = this.createElement();
        this.dead = false;

        this.leftNeightbor = null;
        this.rightNeightbor = null;

        this.handleDrag();
    }

    createElement() {
        const selection = document.createElement("div");
        const background = document.createElement("div");

        selection.classList.add("adr-ad-selection");
        background.classList.add("adr-sel-bg");

        this.leftPlayhead = new Playhead('left', (p) => this.setStartPosition(p));
        this.rightPlayhead = new Playhead('right', (p) => this.setEndPosition(p));

        selection.appendChild(background);
        selection.appendChild(this.leftPlayhead.element);
        selection.appendChild(this.rightPlayhead.element);

        this.background = background;
        selection.style.opacity = '0';

        return selection;
    }

    setStartPosition(percent) {
        const position = this.video.duration * percent;
        this.start = position;
        this.redraw();
        this.video.currentTime = position;
    }


    setEndPosition(percent) {
        const duration = this.video.duration;
        const position = Math.max(this.start, duration * percent);
        this.end = position;
        this.redraw();
        this.video.currentTime = position;
    }

    // Delete gesture
    handleDrag() {
        let pos = 0;
        const body = document.getElementsByTagName('body')[0];

        this.background.addEventListener("mousedown", (e) => {
            pos = e.clientY;
            e.preventDefault();

            this.element.style.transition = '';
            body.addEventListener("mouseup", mouseup);
            body.addEventListener("mousemove", mousemove);
        });

        const mouseup = (e) => {
            e.preventDefault();

            body.removeEventListener("mouseup", mouseup);
            body.removeEventListener("mousemove", mousemove);

            const alive = this.element.style.opacity > 0.1;

            if (alive) {
                setTimeout(() => {
                    this.element.style.transition = '';
                }, 700)
                this.element.style.transition = '700ms ease';
                this.element.style.top = '0px';
                this.element.style.opacity = '1';
            } else {
                this.dead = true;
                this.element.remove();
            }
        };

        const mousemove = (e) => {
            e.preventDefault();

            const distance = Math.min(e.clientY - pos, 0);
            const opacity = 1 + distance / 100;

            this.element.style.top = `${distance}px`;
            this.element.style.opacity = opacity;
        }
    }

    redraw() {
        const duration = this.video.duration;
        const timelineWidth = this.timeline.clientWidth;

        // TODO: hide if duration is unavialable

        const start = this.start / duration * timelineWidth;
        const end = this.end / duration * timelineWidth;

        this.element.style.transform = `translateX(${start}px)`;
        this.element.style.width = `${end - start}px`;
    }
}


class FragmentSelectionBar {

    constructor() {
        this.fragments = [];
        this.recording = false;
        this.element = this.createElement();
        this.container = adrElements.controlsContainer;
        this.video = adrElements.video;

        this.hide();
        this.container.appendChild(this.element);

        this.handleBarClick();
        this.handlePlayerResize();
    }

    show() {
        this.element.style.display = '';
    }

    hide() {
        this.element.style.display = 'none';
    }

    toggle() {
        if (this.element.style.display == 'none') {
            this.show();
        } else {
            this.hide();
        }
    }

    createElement() {
        const menu = document.createElement("div");
        menu.classList.add("adr-ad-sel-menu");

        const help = document.createElement("div");
        help.classList.add("adr-ad-help-text");
        help.innerText = "Жми сюда когда начнется реклама";
        this.helpText = help;

        menu.appendChild(help);

        return menu;
    }

    addFragment() {
        const sel = new FragmentSelection();
        this.fragments.push(sel);
        this.element.appendChild(sel.element);

        return sel;
    }

    findFragmentAt(time) {
        for(let i=0; i < this.fragments.length; ++i) {
            const fragment = this.fragments[i];
            const {start, end} = fragment;

            if (start <= time && time <= end && !fragment.dead) {
                return fragment;
            }
        }
        return null;
    }

    followPlayback(fragment) {
        fragment.start = this.video.currentTime;
        fragment.end = this.video.currentTime;

        this.video.play();
        fragment.redraw();
        fragment.element.style.opacity = 1;
        this.helpText.innerText = "Нажми сюда чтобы остановить запись";
        this.recording = true;

        const timeupdate = () => {
            fragment.end = this.video.currentTime;
            fragment.redraw();
        }
        const pause = () => {
            this.video.removeEventListener("ended", pause);
            this.video.removeEventListener("pause", pause);
            this.video.removeEventListener("timeupdate", timeupdate);
            this.helpText.innerText = "Жми сюда когда начнется реклама";
            this.recording = false;
        }

        this.video.addEventListener("ended", pause);
        this.video.addEventListener("pause", pause);
        this.video.addEventListener("timeupdate", timeupdate);
    }

    handleBarClick() {

        this.helpText.addEventListener('click', (e) => {
            e.preventDefault();

            const found = this.findFragmentAt(this.video.currentTime);
            if(found)
                return;

            if(this.recording)
                return this.video.pause();

            const fragment = this.addFragment();
            this.followPlayback(fragment);
            this.video.play();
        });
    }

    handlePlayerResize() {
        adrObserver.onPlayerResize(() => this.redrawAllFragments());
    }

    redrawAllFragments() {
        this.fragments.forEach((fragment) => fragment.redraw());
    }

}
