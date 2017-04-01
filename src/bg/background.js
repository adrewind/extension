// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });


chrome.extension.onConnect.addListener((port) => {
    if (port.name != 'XHRProxy_') {
        return;
    }

    // TODO: use XHRRequest
    port.onMessage.addListener((options) => {
        const xhr = new XMLHttpRequest();

        const { url } = options;
        const method = options.method || "GET";

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
