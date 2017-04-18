
export default (url, params = {}) => new Promise((resolve) => {
    const port = chrome.extension.connect({ name: 'XHRProxy_' });

    const settings = {
        url,
        method: params.method,
    };

    port.onMessage.addListener((msg) => {
        let data;

        try {
            data = JSON.parse(msg.responseText);
        } catch (e) {
            data = { error: 'Error while parsing response' };
        }

        resolve({
            data,
            status: msg.status,
        });
    });

    port.postMessage(settings);
});
