const chai = require('chai');
const PlayerTimeline = require('../src/inject/yt-api/player-timline').default;


chai.should();


describe('PlayerTimeline time formatting', () => {
    it('should return 0:20 if totalSeconds === 20', async () => {
        const result = PlayerTimeline.formatTime(20);
        result.should.be.equal('0:20');
    });

    it('should return 2:31 if totalSeconds === 151', async () => {
        const result = PlayerTimeline.formatTime(151);
        result.should.be.equal('2:31');
    });

    it('should return 1:04:16 if totalSeconds === 3856', async () => {
        const result = PlayerTimeline.formatTime(3856);
        result.should.be.equal('1:04:16');
    });
});
