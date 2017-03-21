
class ADJumper {

    constructor() {
        this.skip = [];
        this.active = true;

        this.body = adrElements.body;
        this.video = adrElements.video;

        this.handleEvents();
    }

    enable() {
        this.active = true;
    }

    disable() {
        this.active = false;
    }

    seekTo(position) {
        this.video.currentTime = position;
    }

    skipFragmet(from, to) {
        this.skip.push([from, to]);
    }

    updateFragments(skip) {
        this.skip = skip;
    }

    findFragmentAt(time) {
        // TODO: use more efficient algorithm
        const found = this.skip.filter(([ start, end ]) => start <= time && time <= end);
        return found[0] || null;
    }

    handleEvents() {
        this.video.addEventListener('timeupdate', () => this.onTimeUpdate());
        this.handleBackAndForward();
    }

    onTimeUpdate() {
        if (!this.active) {
            return;
        }

        const reserve = 0.25; // seconds
        const current = this.video.currentTime;

        // TODO: use more efficient algorithm
        for (let i = 0; i < this.skip.length; i += 1) {
            const [start, end] = this.skip[i];

            if (start > current || current > end - reserve) {
                continue;
            }

            this.seekTo(end);
            break;
        }
    }

    handleBackAndForward() {
        const ARROW_LEFT = 37;
        const ARROW_RIGHT = 39;

        const tracking = [ARROW_LEFT, ARROW_RIGHT];

        // TODO: refactor, add J and L keys

        this.body.addEventListener('keyup', (e) => {

            if (!tracking.includes(e.keyCode)) {
                return;
            }

            const time = this.video.currentTime;
            const skip = this.findFragmentAt(time);

            if (!skip) {
                return;
            }

            const [ start, end ] = skip;

            if (e.keyCode === ARROW_LEFT) {
                this.video.currentTime = start - 5;
            }

            if (e.keyCode === ARROW_RIGHT) {
                this.video.currentTime = end;
            }
        });
    }
}
