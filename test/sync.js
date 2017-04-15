const chai = require('chai');
const requests = require('./base/fake-xhr').requests;
const Sync = require('../src/bg/sync').default;


chai.should();

const sync = new Sync();


describe('Whole process', () => {
    before(() => chrome.storage.local.set({
        oAsUdzxBNJ1: { fragments: [[0, 27.2]], updated: 1491818311601, submitted: true },
        oAsUdzxBNJ2: { fragments: [[0, 15.7]], updated: 1490906673445, submitted: false },
        oAsUdzxBNJ3: { fragments: [[0, 17.5]], updated: +new Date(), submitted: false },
        oAsUdzxBNJ4: { fragments: [[0, 18.1]], updated: 1491818311601, submitted: false },
    }));

    after(() => {
        requests.length = 0;
        chrome.storage.local.flush();
    });

    it('should request auth and put two reports', async () => {
        const process = sync.run();

        await requests.newRequests();
        requests.length.should.be.equal(1);
        requests[0].respond(200, { 'Content-Type': 'application/json' },
                                 '{ "authenticated": true }');

        await requests.newRequests();
        requests.length.should.be.equal(3);
        requests[1].respond(200, { 'Content-Type': 'application/json' },
                                 '{ "updated": true }');
        requests[2].respond(200, { 'Content-Type': 'application/json' },
                                 '{ "updated": true }');

        const urls = [requests[1].url, requests[2].url].sort();
        urls[0].should.includes('oAsUdzxBNJ2');
        urls[1].should.includes('oAsUdzxBNJ4');

        await process;
    });
});


describe('Find unsynced', () => {
    before(() => chrome.storage.local.set({
        oAsUdzxBNJ1: { fragments: [[0, 27.2]], updated: 1491818311601, submitted: true },
        oAsUdzxBNJ2: { fragments: [[0, 15.7]], updated: 1490906673445, submitted: false },
        oAsUdzxBNJ3: { fragments: [[0, 17.5]], updated: +new Date(), submitted: false },
    }));

    after(() => chrome.storage.local.flush());

    it('should return not submitted items', async () => {
        const found = await sync.findUnsynced();
        const keys = found.map(([k]) => k);
        keys.should.include('oAsUdzxBNJ2');
    });

    it('should not return submitted items', async () => {
        const found = await sync.findUnsynced();
        const keys = found.map(([k]) => k);
        keys.should.not.include('oAsUdzxBNJ1');
    });

    it('should not return recent items', async () => {
        const found = await sync.findUnsynced();
        const keys = found.map(([k]) => k);
        keys.should.not.include('oAsUdzxBNJ3');
    });
});


describe('auth function', () => {
    after(() => { requests.length = 0; });

    it('should return true if channel === null', async () => {
        const channel = null;
        const auth = sync.auth(channel);

        requests.length.should.equal(1);
        requests[0].respond(200, { 'Content-Type': 'application/json' },
                                 '{ "authenticated": true }');

        const response = await auth;
        response.should.be.equal(true);
    });
});
