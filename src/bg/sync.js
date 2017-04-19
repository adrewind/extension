import xhrRequest from './xhr';
import { localStorage } from '../common/storage';
import { API_ENDPOINT_REPORTS, SYNC_MATURITY_TRESHOLD } from './config';
// TODO: check if there is not enough storage, delete old synced items

// TODO: move it to helpers
Promise.sequentially = iterable =>
    iterable.reduce((p, fn) =>
        p.then(fn), Promise.resolve());


export default class Sync {

    constructor() {
        this.storage = localStorage;
        this.urlAuth = `${API_ENDPOINT_REPORTS}/auth/`;
        this.urlReport = `${API_ENDPOINT_REPORTS}/ad-report/`;
    }

    async findUnsynced() {
        const treshold = SYNC_MATURITY_TRESHOLD * 60; // minutes to seconds
        const provenUntil = new Date() - treshold;

        const isTimeProven = ([, info]) => info.updated < provenUntil;
        const isNotSubmitted = ([, info]) => !info.submitted;

        const all = await this.storage.get(null);

        return Object.entries(all)
            .filter(isNotSubmitted)
            .filter(isTimeProven);
    }

    async run() {
        const found = await this.findUnsynced();
        if (found.length < 1) {
            return null;
        }
        const channel = await this.findChannelId();
        const authenticated = await this.auth(channel);
        if (!authenticated) {
            return null;
        }
        return this.sendToServer(found);
    }

    async auth(channel) {
        const params = channel ? { channel } : { anonymous: true };
        const { status, data } = await xhrRequest('POST', this.urlAuth, params);
        if (status !== 200) {
            console.log('AuthError: status != 200');
            return false;
        }
        if (!data.authenticated) {
            console.log('AuthError: not authenticated');
            return false;
        }
        return true;
    }

    async findChannelId() {
        const found = await this.storage.get('##ytchan');
        return found['##ytchan'] || null;
    }

    async sendInfo([videoID, info]) {
        const url = `${this.urlReport}${videoID}/`;
        const { status, data } = await xhrRequest('PUT', url, info.fragments);

        if (status === 200 && data && data.updated) {
            await this.markAsSubmitted(videoID, info);
        }
        if (status === 200 && data && data.error) {
            await this.deleteVideo(videoID);
        }
    }

    sendToServer(items) {
        console.log('SENDING TO SERVER');
        const sendInfo = i => this.sendInfo(i);

        return Promise.sequentially(items.map(sendInfo));
    }

    async markAsSubmitted(videoID, info) {
        const data = await this.storage.get(videoID);
        const found = data[videoID];
        if (String(info.fragments) !== String(found.fragments)) {
            return null;
        }
        return this.storage.set({
            [videoID]: Object.assign({}, info, { submitted: true }),
        });
    }

    deleteVideo(videoID) {
        return this.storage.remove(videoID);
    }

}
