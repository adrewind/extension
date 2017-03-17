


class Player {

    constructor() {
        this.skip = [];
        this.findVideoTag();
        this.handleEvents();
    }

    findVideoTag() {
        this.video = document.getElementsByTagName('video')[0];
    }

    seekTo(position) {
        // console.log("SEEKING to " + position)
        this.video.currentTime = position;
    }

    skipFragmet(from, to) {
        this.skip.push([from, to]);
    }

    handleEvents() {
        this.video.addEventListener("timeupdate", () => this.onTimeUpdate(), false);
    }

    onTimeUpdate() {
        const current = this.video.currentTime;


        for(let i=0; i < this.skip.length; ++i) {
            const [start, end] = this.skip[i];

            if(start > current || current > end)
                continue;

            return this.seekTo(end);
        }
    }
}


chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

        const conts = new AdditionalControls();
        const player = new Player();
        player.skipFragmet(30, 60);

	}
	}, 10);
});
