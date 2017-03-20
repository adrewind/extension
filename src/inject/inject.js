
function getVideoID() {
    function youtubeUrlParser(url) {
        const exp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&\?]*).*/;
        const match = url.match(exp);
        return (match && match[7].length === 11) ? match[7] : null;
    }

    return youtubeUrlParser(document.URL);
}


chrome.extension.sendMessage({}, () => {
    const readyStateCheckInterval = setInterval(() => {
        if (document.readyState !== 'complete') {
            return;
        }

        clearInterval(readyStateCheckInterval);

        // ----------------------------------------------------------
        // This part of the script triggers when page is done loading
        console.log('Hello. This message was sent from scripts/inject.js');
        // ----------------------------------------------------------

        const info = new ADInfo();
        const jumper = new ADJumper();
        const conts = new AdditionalControls();
        const bar = new FragmentSelectionBar();

        bar.onchanged = () => {
            console.log(bar);
            console.log(info);
            const videoID = getVideoID();
            const fragments = bar.exportFragments();
            info.update(videoID, fragments);
        }

        conts.button.addEventListener('click', () => {
            jumper.disable();

            const shown = bar.toggle();
            if (!shown) {
                return;
            }

            const videoID = getVideoID();
            const fragments = bar.exportFragments();
            info.update(videoID, fragments);
            jumper.updateFragments(fragments);
            jumper.enable();
        });

        const loadData = () => {
            const videoID = getVideoID();
            if (videoID === null) {
                return;
            }

            bar.removeAllFragments();
            jumper.updateFragments([]);

            console.log("LOADING", videoID);
            info.load(videoID).then(({ fragments }) => {
                console.log('LOAD', videoID, fragments);
                if (!fragments) {
                    return;
                }
                bar.loadNewFragments(fragments);
                jumper.updateFragments(fragments);
                jumper.enable();
            });
        };

        loadData();

        adrObserver.onSRCChanged(loadData);

        // window.addEventListener('popstate', () => console.log('popstate', document.URL));
        // window.addEventListener('popstate', () => console.log('duck', document.URL));
    }, 10);
});
