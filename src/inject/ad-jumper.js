import { body, NoElementError } from './common';


export default class ADJumper {

    constructor(video) {
        if (!video) {
            throw new NoElementError('video tag is not found');
        }

        this.skip = [];
        this.active = true;

        this.body = body;
        this.video = video;

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

    reset() {
        this.skip = [];
    }

    updateFragments(skip) {
        this.skip = skip;
    }

    findFragmentAt(time) {
        // TODO: use more efficient algorithm
        const found = this.skip.filter(([start, end]) => start <= time && time < end);
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

        // TODO: do something with late detection of fragment start
        const reserve = 0.08; // seconds (~two frames)
        const current = this.video.currentTime;

        // TODO: use more efficient algorithm
        const found = this.findFragmentAt(current);
        const end = found && found[1];

        if (current + reserve < end) {
            this.seekTo(end);
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

            const [start, end] = skip;

            if (e.keyCode === ARROW_LEFT) {
                this.video.currentTime = start - 5;
            }

            if (e.keyCode === ARROW_RIGHT) {
                this.video.currentTime = end;
            }
        });
    }
}
