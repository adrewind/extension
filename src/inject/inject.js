
let adManager = null;

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

        adManager = new ADManager();

    }, 10);
});
