
class ADInfo {

    constructor() {
        this.endpoint = API_ENDPOINT_VIDEOS;
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

            return this.loadFragments(videoID);
        });
    }

    loadFragments(videoID) {
        return proxyXHR(`${this.endpoint}/video/${videoID}/`).then(({data, status}) => {
            if (status === 200) {
                return data;
            } else {
                // TODO: send it to sentry
                console.log(status);
            }
            return [];
        })
    }

    updateChannel() {
        this.storage.set({ '##ytchan': adrElements.getUserID() });
    }
}
