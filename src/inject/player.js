
class ADJumper {

    constructor() {
        this.skip = [];
        this.active = true;
        this.findVideoTag();
        this.handleEvents();
    }

    enable() {
        this.active = true;
    }

    disable() {
        this.active = false;
    }

    findVideoTag() {
        this.video = document.getElementsByTagName('video')[0];
    }

    seekTo(position) {
        // console.log('SEEKING to ' + position)
        this.video.currentTime = position;
    }

    skipFragmet(from, to) {
        this.skip.push([from, to]);
    }

    handleEvents() {
        this.video.addEventListener('timeupdate', () => this.onTimeUpdate());
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

    updateFragments(skip) {
        this.skip = skip;
    }
}
