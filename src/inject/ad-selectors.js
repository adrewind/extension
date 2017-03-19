
function ensurePercent(value) {
    return Math.max(0, Math.min(1, value));
}


class FragmentSelection {

    constructor(video, timeline) {
        this.start = 0;
        this.end = 0;
        this.video = video;
        this.timeline = timeline;
        this.element = this.createElement();
        this.dead = false;

        this.handleDrag();
        this.handlePlayheadMove();
    }

    createElement() {
        const selection = document.createElement("div");
        selection.classList.add("adr-ad-selection");

        const background = document.createElement("div");
        const leftPlayhead = document.createElement("div");
        const rightPlayhead = document.createElement("div");

        background.classList.add("adr-sel-bg");
        leftPlayhead.classList.add("adr-playhead-left");
        rightPlayhead.classList.add("adr-playhead-right");

        selection.appendChild(leftPlayhead);
        selection.appendChild(rightPlayhead);
        selection.appendChild(background);

        this.background = background;
        this.leftPlayhead = leftPlayhead;
        this.rightPlayhead = rightPlayhead;
        selection.style.opacity = '0';

        return selection;
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
            console.log(alive ? "ALIVE":"DEAD");

            if (alive) {
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

    handlePlayheadMove() {
        let isLeft = false;
        let startX = 0;
        let startY = 0;
        const vacuum = 60; // px
        const body = document.getElementsByTagName('body')[0];

        const mousedown = (e) => {
            e.preventDefault();
            this.video.pause();

            startX = e.clientX;
            startY = e.clientY;
            isLeft = e.target.classList.contains('adr-playhead-left');

            const time = isLeft ? this.start : this.end;
            this.video.currentTime = time;
            this.element.style.transition = '';

            body.addEventListener("mouseup", mouseup);
            body.addEventListener("mousemove", mousemove);
        }

        const mouseup = (e) => {
            e.preventDefault();

            body.removeEventListener("mouseup", mouseup);
            body.removeEventListener("mousemove", mousemove);
        }

        const mousemove = (e) => {
            e.preventDefault();

            const rect = this.timeline.getBoundingClientRect();
            const left = rect.left;
            const width = rect.width;
            const duration = this.video.duration;

            const diff = e.clientX - left;
            const position = duration * ensurePercent(diff / width);

            if (isLeft) {
                this.start = position;
            } else {
                this.end = position;
            }

            this.video.currentTime = position;
            this.redraw();
        }

        this.leftPlayhead.addEventListener("mousedown", mousedown);
        this.rightPlayhead.addEventListener("mousedown", mousedown);
    }

    followPlayback() {
        this.start = this.video.currentTime;
        this.end = this.video.currentTime;

        this.video.play();
        this.redraw();
        this.element.style.opacity = '1';
        this.element.style.transition = '700ms ease opacity'


        const timeupdate = () => {
            this.end = this.video.currentTime;
            this.redraw();
        }
        const pause = () => {
            this.video.removeEventListener("ended", pause);
            this.video.removeEventListener("pause", pause);
            this.video.removeEventListener("timeupdate", timeupdate);
        }

        this.video.addEventListener("ended", pause);
        this.video.addEventListener("pause", pause);
        this.video.addEventListener("timeupdate", timeupdate);
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
        this.element = this.createElement();
        this.container = this.findContainer();
        this.video = this.findVideoTag();

        this.hide();
        this.container.appendChild(this.element);

        this.observePlayerMutations();


        let follow = null;


        this.helpText.addEventListener('click', () => {
            console.log("CLICK BAR");

            if(follow) {
                this.video.pause();
                follow = null;
            } else {
                follow = this.addFragment();
                follow.followPlayback();
            }
        });
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

    findVideoTag() {
        return document.getElementsByTagName("video")[0];
    }

    findContainer() {
        return document.getElementsByClassName("ytp-chrome-bottom")[0];
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
        const sel = new FragmentSelection(this.video, this.container);
        this.fragments.push(sel);
        this.element.appendChild(sel.element);
        sel.redraw();

        return sel;
    }

    observePlayerMutations() {
        const observer = new MutationObserver(() => this.handlePossibleResize());

        const config = { attributes: true, attributeFilter: ["style"] };

        observer.observe(this.video, config);

        return observer;
    }

    handlePossibleResize() {
        this.fragments.forEach((fragment) => fragment.redraw());
    }

}
