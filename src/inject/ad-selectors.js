
class Playhead {

    constructor(side, callback) {
        this.side = side;
        this.body = adrElements.body;
        this.container = adrElements.controlsContainer;
        this.onchange = callback;

        this.leftWall = 0;
        this.rightWall = 1;

        this.element = this.createElement();
        this.handleMove();
    }

    createElement() {
        const element = document.createElement('div');
        element.classList.add(`adr-playhead-${this.side}`);
        return element;
    }

    handleMove() {
        function applyConstraints(value, min, max) {
            return Math.max(min, Math.min(max, value));
        }

        const mousemove = (e) => {
            e.preventDefault();

            const rect = this.container.getBoundingClientRect();
            const diff = e.clientX - rect.left;
            const percent = diff / rect.width;
            const value = applyConstraints(percent, this.leftWall, this.rightWall);

            this.onchange(value);
        };

        const mouseup = (e) => {
            e.preventDefault();

            this.body.removeEventListener('mouseup', mouseup);
            this.body.removeEventListener('mousemove', mousemove);
        };

        this.element.addEventListener('mousedown', (e) => {
            e.preventDefault();

            this.body.addEventListener('mouseup', mouseup);
            this.body.addEventListener('mousemove', mousemove);
        });
    }

    setConstrains(left, right) {
        this.leftWall = Math.max(0, left);
        this.rightWall = Math.min(1, right);
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
        const selection = document.createElement('div');
        const background = document.createElement('div');

        selection.classList.add('adr-ad-selection');
        background.classList.add('adr-sel-bg');

        this.leftPlayhead = new Playhead('left', p => this.setStartPercent(p));
        this.rightPlayhead = new Playhead('right', p => this.setEndPercent(p));

        selection.appendChild(background);
        selection.appendChild(this.leftPlayhead.element);
        selection.appendChild(this.rightPlayhead.element);

        this.background = background;

        return selection;
    }

    setStartPercent(percent) {
        const position = this.video.duration * percent;
        this.start = position;
        this.redraw();
        this.video.currentTime = position;
    }


    setEndPercent(percent) {
        const duration = this.video.duration;
        const position = Math.max(this.start, duration * percent);
        this.end = position;
        this.redraw();
        this.video.currentTime = position;
    }

    setStartPosition(time) {
        this.start = time;
    }

    setEndPosition(time) {
        this.end = time;
    }

    // Deletion gesture
    handleDrag() {
        let pos = 0;
        const body = document.getElementsByTagName('body')[0];

        const mousemove = (e) => {
            e.preventDefault();

            const distance = Math.min(e.clientY - pos, 0);
            const opacity = 1 + (distance / 100);

            this.element.style.top = `${distance}px`;
            this.element.style.opacity = opacity;
        };

        const mouseup = (e) => {
            e.preventDefault();

            body.removeEventListener('mouseup', mouseup);
            body.removeEventListener('mousemove', mousemove);

            const alive = this.element.style.opacity > 0.1;
            if (!alive) {
                return this.destroy();
            }

            this.element.style.top = '0px';
            this.element.style.opacity = '1';
            this.element.style.transition = '700ms ease';
            setTimeout(() => {
                this.element.style.transition = '';
            }, 800);
        };

        this.background.addEventListener('mousedown', (e) => {
            pos = e.clientY;
            e.preventDefault();

            this.element.style.transition = '';
            body.addEventListener('mouseup', mouseup);
            body.addEventListener('mousemove', mousemove);
        });
    }

    redraw() {
        const duration = this.video.duration;
        const timelineWidth = this.timeline.clientWidth;

        // TODO: hide if duration is unavialable

        const start = (this.start / duration) * timelineWidth;
        const end = (this.end / duration) * timelineWidth;

        this.element.style.transform = `translateX(${start}px)`;
        this.element.style.width = `${end - start}px`;
    }

    destroy() {
        this.dead = true;
        this.element.remove();
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
        const hidden = this.element.style.display === 'none';
        if (hidden) {
            this.show();
        } else {
            this.hide();
        }
        return !hidden;
    }

    createElement() {
        const menu = document.createElement('div');
        menu.classList.add('adr-ad-sel-menu');

        const help = document.createElement('div');
        help.classList.add('adr-ad-help-text');
        help.innerText = 'Жми сюда когда начнется реклама';
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
        const alive = this.fragments.filter(f => !f.dead);
        const found = alive.filter(({ start, end }) => start <= time && time <= end);

        return found[0] || null;
    }

    followPlayback(fragment) {
        fragment.setStartPosition(this.video.currentTime);
        fragment.setEndPosition(this.video.currentTime);

        this.video.play();
        fragment.redraw();
        this.helpText.innerText = 'Нажми сюда чтобы остановить запись';
        this.recording = true;

        const timeupdate = () => {
            fragment.setEndPosition(this.video.currentTime);
            fragment.redraw();
        };

        const pause = () => {
            this.video.removeEventListener('ended', pause);
            this.video.removeEventListener('pause', pause);
            this.video.removeEventListener('timeupdate', timeupdate);
            this.helpText.innerText = 'Жми сюда когда начнется реклама';
            this.recording = false;
        };

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

    handlePlayerResize() {
        adrObserver.onPlayerResize(() => this.redrawAllFragments());
    }

    removeAllFragments() {
        this.fragments.forEach(f => f.destroy());
        this.fragments = [];
    }

    loadNewFragments(rawFragments) {
        this.removeAllFragments();
        rawFragments.forEach(f => {
            const [start, end] = f;
            const fragment = this.addFragment();

            fragment.setStartPosition(start);
            fragment.setEndPosition(end);
            fragment.redraw();
        });
    }

    redrawAllFragments() {
        this.fragments.forEach(fragment => fragment.redraw());
    }

    exportFragments() {
        const alive = this.fragments.filter(f => !f.dead);
        const frags = alive.map(({ start, end }) => [start, end]);

        return frags.sort((a, b) => a.start - b.start);
    }
}
