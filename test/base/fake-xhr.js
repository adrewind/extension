const sinon = require('sinon');


const requests = [];
const xhr = sinon.useFakeXMLHttpRequest();

xhr.onCreate = function (xhr) {
    requests.push(xhr);
};

module.exports = { xhr, requests };
