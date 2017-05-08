
export default class PlayerTimeline {
    constructor(video) {
        this.timer = null;
        this.video = video;
        this.currentEl = document.getElementsByClassName('ytp-time-current')[0];
        this.progressEl = document.getElementsByClassName('ytp-play-progress')[0];

        const freezeUpdate = () => this.timer && clearTimeout(this.timer);
        const unfreezeUpdate = () => this.timer && this.updateTick();

        this.video.addEventListener('pause', freezeUpdate);
        this.video.addEventListener('play', unfreezeUpdate);
    }

    startUpdate() {
        if (this.timer) { return; }
        this.updateTick();
    }

    stopUpdate() {
        clearTimeout(this.timer);
        this.timer = null;
    }

    updateTick() {
        const current = this.video.currentTime;
        const elapsed = (current % 1) * 1000;
        const wait = 1000 - elapsed;

        this.update();
        this.timer = setTimeout(() => this.updateTick(), wait);
    }

    update() {
        this.updateCurrentTime();
        this.updateProgressIndicator();
    }

    static formatTime(totalSeconds) {
        const hours = Math.floor((totalSeconds / (60 ** 2)));
        let minutes = Math.floor((totalSeconds / (60 ** 1)) % 60);
        let seconds = Math.floor((totalSeconds / (60 ** 0)) % 60);

        if (minutes < 10 && hours > 0) {
            minutes = `0${minutes}`;
        }
        if (seconds < 10) {
            seconds = `0${seconds}`;
        }
        if (hours === 0) {
            return `${minutes}:${seconds}`;
        }
        return `${hours}:${minutes}:${seconds}`;
    }

    updateProgressIndicator() {
        const percent = this.video.currentTime / this.video.duration;
        this.progressEl.style.transform = `scaleX(${percent})`;
    }

    updateCurrentTime() {
        const current = this.video.currentTime;
        const time = PlayerTimeline.formatTime(current);

        this.currentEl.innerText = time;
    }
}
