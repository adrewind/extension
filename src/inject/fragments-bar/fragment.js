
class FragmentSelection {

    constructor() {
        this.start = 0;
        this.end = 0;
        this.video = adrElements.video;
        this.timeline = adrElements.controlsContainer;
        this.element = this.createElement();
        this.dead = false;
        this.onchanged = () => null;
        this.onremoved = () => null;

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

        this.leftPlayhead.onchanged = () => this.onchanged();
        this.rightPlayhead.onchanged = () => this.onchanged();
        this.leftPlayhead.ondblclick = () => this.leftFrameByFrame.show();
        this.rightPlayhead.ondblclick = () => this.rightFrameByFrame.show();

        this.leftFrameByFrame = new FrameByFrameControls(this.leftPlayhead.element);
        this.rightFrameByFrame = new FrameByFrameControls(this.rightPlayhead.element);

        this.leftFrameByFrame.onstep = direction => this.onStep('left', direction);
        this.rightFrameByFrame.onstep = direction => this.onStep('right', direction);

        selection.appendChild(background);
        selection.appendChild(this.leftPlayhead.element);
        selection.appendChild(this.rightPlayhead.element);

        return selection;
    }

    setStartPercent(percent) {
        const position = this.video.duration * percent;
        this.setStartTime(position);
    }

    setEndPercent(percent) {
        const duration = this.video.duration;
        const position = Math.max(this.start, duration * percent);
        this.setEndTime(position);
    }

    setStartTime(time) {
        this.start = time;
        this.redraw();
        this.video.currentTime = time;
    }

    setEndTime(time) {
        this.end = time;
        this.redraw();
        this.video.currentTime = time;
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
        const body = adrElements.body;

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

            const alive = this.element.style.opacity > 0.1 || this.element.style.opacity === '';
            if (!alive) {
                this.destroy();
                this.onchanged();
                this.onremoved();
                return;
            }

            this.element.style.top = '0px';
            this.element.style.opacity = '1';
            this.element.style.transition = '700ms ease';
            setTimeout(() => {
                this.element.style.transition = '';
            }, 800);
        };

        this.element.addEventListener('mousedown', (e) => {
            pos = e.clientY;
            e.preventDefault();

            const leftPlayhead = e.target === this.leftPlayhead.element;
            const rightPlayhead = e.target === this.rightPlayhead.element;
            if (leftPlayhead || rightPlayhead) {
                return;
            }

            this.element.style.transition = '';
            body.addEventListener('mouseup', mouseup);
            body.addEventListener('mousemove', mousemove);
        });
    }

    onRemove(callback) {
        this.onremoved = callback;
    }

    onStep(playhead, direction) {
        const frameTime = 1 / 30;
        const sign = direction === 'back' ? -1 : 1;

        if (playhead === 'left') {
            const position = this.start + (frameTime * sign);
            this.setStartTime(position);
        } else {
            const position = this.end + (frameTime * sign);
            this.setEndTime(position);
        }
        // TODO: single point of responsibility
        this.onchanged();
    }

    redraw() {
        const duration = this.video.duration;
        const timelineWidth = this.timeline.clientWidth;

        if (!duration) {
            setTimeout(() => this.redraw(), 500);
        }

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
