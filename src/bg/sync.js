import xhrRequest from './xhr';
import { API_ENDPOINT_REPORTS, SYNC_MATURITY_TRESHOLD } from './config';
// TODO: check if there is not enough storage, delete old synced items

// TODO: move it to helpers
Promise.sequentially = iterable =>
    iterable.reduce((p, fn) =>
        p.then(fn), Promise.resolve());


export default class Sync {

    constructor() {
        this.storage = chrome.storage.local;
        this.urlAuth = `${API_ENDPOINT_REPORTS}/auth/`;
        this.urlReport = `${API_ENDPOINT_REPORTS}/ad-report/`;
    }

    findUnsynced() {
        const treshold = SYNC_MATURITY_TRESHOLD * 60; // minutes to seconds
        const provenUntil = new Date() - treshold;

        const isTimeProven = ([, info]) => info.updated < provenUntil;
        const isNotSubmitted = ([, info]) => !info.submitted;

        return new Promise((resolve) => {
            this.storage.get(null, data => resolve(Object.entries(data)
                                                         .filter(isNotSubmitted)
                                                         .filter(isTimeProven)));
        });
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

    findChannelId() {
        return new Promise(resolve =>
            this.storage.get('##ytchan', data =>
                resolve(data['##ytchan'] || null)));
    }

    async sendInfo([videoID, info]) {
        const url = `${this.urlReport}${videoID}/`;
        const { status, data } = await xhrRequest('PUT', url, info.fragments);

        if (status === 200 && data && data.updated) {
            this.markAsSubmitted(videoID, info);
        }
        return null;
    }

    sendToServer(items) {
        console.log('SENDING TO SERVER');
        const sendInfo = i => this.sendInfo(i);

        return Promise.sequentially(items.map(sendInfo));
    }

    markAsSubmitted(videoID, info) {
        this.storage.get(videoID, (data) => {
            const found = data[videoID];
            if (String(info.fragments) !== String(found.fragments)) {
                return;
            }
            this.storage.set({
                [videoID]: Object.assign({}, info, { submitted: true }),
            });
        });
    }

}
