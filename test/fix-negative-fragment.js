const chai = require('chai');
const fix = require('../src/bg/bugfix/playhead-negative-time');

chai.should();


// TODO: Remove me 18.05.2017
describe('Whole process', () => {
    before(() => chrome.storage.local.set({
        oAsUdzxBNJ1: { fragments: [[0, 27.2]], updated: 1491818311601, submitted: true },
        oAsUdzxBNJ2: { fragments: [[0, 15.7]], updated: 1490906673445, submitted: false },
        oAsUdzxBNJ3: { fragments: [[-0.3, 17.5]], updated: +new Date(), submitted: false },
        oAsUdzxBNJ4: { fragments: [[-0.6, 18.1]], updated: 1491818311601, submitted: false },
    }));

    after(() => {
        chrome.storage.local.flush();
    });

    it('should find all broken records', async () => {
        const found = await fix.findBrokenRecords();

        found.should.contains.key('oAsUdzxBNJ3');
        found.should.contains.key('oAsUdzxBNJ4');
        found.should.not.contains.key('oAsUdzxBNJ1');
        found.should.not.contains.key('oAsUdzxBNJ2');
    });

    it('should fix all broken records', async () => {
        const found = await fix.findBrokenRecords();
        await fix.fixNegativeFragments(found);

        const afterFix = await fix.findBrokenRecords();
        const broken = Object.keys(afterFix).length;
        broken.should.be.equal(0);
    });
});
