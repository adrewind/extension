const sinon = require('sinon');


const requests = [];
const xhr = sinon.useFakeXMLHttpRequest();

xhr.onCreate = request =>
    requests.push(request);


requests.newRequests = timeout =>
    new Promise((resolve, reject) => {
        let interval = null;
        const start = +new Date();
        const before = requests.length;

        const check = () => {
            const after = requests.length;
            if (before !== after) {
                resolve();
            }
            const now = +new Date();
            const diff = now - start;
            if (diff > timeout) {
                reject(new Error('request wait timeout'));
                clearInterval(interval);
            }
        };

        interval = setInterval(check, 15);
    });

module.exports = { xhr, requests };
