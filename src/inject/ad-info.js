import proxyXHR from './xhr';
import { API_ENDPOINT_VIDEOS } from '../config';


// TODO: Use async / await
export default class ADInfo {

    constructor(player) {
        this.user = player.user;
        this.storage = chrome.storage.local;
    }

    update(videoID, fragments) {
        const data = {
            fragments,
            updated: +new Date(),
            submitted: false,
        };
        this.storage.set({
            [videoID]: data,
        });
        this.updateChannel();
    }

    load(videoID) {
        return new Promise((resolve) => {
            this.storage.get(videoID, data => resolve(data[videoID]));
        }).then((data) => {
            if (data) {
                return data.fragments;
            }

            return ADInfo.loadFragments(videoID);
        });
    }

    static loadFragments(videoID) {
        return proxyXHR(`${API_ENDPOINT_VIDEOS}/video/${videoID}/`).then(({ data, status }) => {
            if (status === 200) {
                return data;
            }
            // TODO: send it to sentry
            console.log(status);
            return [];
        });
    }

    updateChannel() {
        const userid = this.user.getID();
        if (!userid) {
            return;
        }
        this.storage.set({ '##ytchan': userid });
    }
}
