
class ADInfo {

    update(videoID, fragments) {
        const data = {
            fragments,
            updated: +new Date,
            submitted: false,
        };
        chrome.storage.local.set({
            [videoID]: data,
        });
    }

    load(videoID) {
        return new Promise(resolve => {
            const onload = data => resolve(data[videoID]);
            chrome.storage.local.get(videoID, onload);
        })
    }
}
