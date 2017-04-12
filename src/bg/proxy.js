
chrome.extension.onConnect.addListener((port) => {
    if (port.name !== 'XHRProxy_') {
        return;
    }

    // TODO: use xhrRequest
    port.onMessage.addListener((options) => {
        const xhr = new XMLHttpRequest();

        const { url } = options;
        const method = options.method || 'GET';

        xhr.open(method, url, true);

        xhr.onloadend = () => {
            port.postMessage({
                status: xhr.status,
                responseText: xhr.responseText,
            });
        };

        xhr.send();
    });
});
