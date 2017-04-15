const sinon = require('sinon');


const requests = [];
const xhr = sinon.useFakeXMLHttpRequest();

xhr.onCreate = request =>
    requests.push(request);

module.exports = { xhr, requests };
