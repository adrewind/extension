
class ADInfo {

    constructor() {
        this.storage = chrome.storage.local;
    }

    update(videoID, fragments) {
        const data = {
            fragments,
            updated: +new Date,
            submitted: false,
        };
        this.storage.set({
            [videoID]: data,
        });
    }

    load(videoID) {
        return new Promise(resolve => {
            const onload = data => resolve(data[videoID]);
            this.storage.get(videoID, onload);
        })
    }
}
