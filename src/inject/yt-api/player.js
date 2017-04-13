import PlayerEvents from './player-events';
import { untilLocated } from './helpers';


export default class Player {
    /*
     * Wait for init before use, for ex:
     *
     * const player = new Player();
     * await player.init();
     *
     */
    async init() {
        // FIXME: VideoLink appears after 1.5 seconds, it's too slow, find better way
        this.video = await Player.untilVideoAppears();
        this.vidlink = await Player.untilVideoLinkAppears();

        this.events = new PlayerEvents(this.video);
    }

    static findVideoTag() {
        return document.getElementsByTagName('video')[0] || null;
    }

    static untilVideoAppears() {
        return untilLocated(Player.findVideoTag);
    }

    static getVideoLink() {
        return document.querySelector('[data-sessionlink="feature=player-title"][href]');
    }

    static untilVideoLinkAppears() {
        return untilLocated(Player.getVideoLink);
    }

    getVideoID() {
        function parseYouTubeID(address) {
            const url = new URL(address);
            return url.searchParams.get('v');
        }

        const videoUrl = this.vidlink.href;
        return parseYouTubeID(videoUrl);
    }

}
