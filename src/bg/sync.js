import xhrRequest from './xhr';
import { API_ENDPOINT_REPORTS, SYNC_MATURITY_TRESHOLD } from './config';
// TODO: check if there is not enough storage, delete old synced items

Promise.sequentially = iterable =>
    iterable.reduce((p, fn) =>
        p.then(fn), Promise.resolve());


class AuthError extends Error { }


export default class Sync {

    constructor() {
        this.storage = chrome.storage.local;
        this.urlAuth = `${API_ENDPOINT_REPORTS}/auth/`;
        this.urlReport = `${API_ENDPOINT_REPORTS}/ad-report/`;
    }

    findUnsynced() {
        const treshold = SYNC_MATURITY_TRESHOLD * 60; // minutes to seconds
        const provenUntil = new Date() - treshold;

        const isTimeProven = ([videoID, info]) => info.updated < provenUntil;
        const isNotSubmitted = ([videoID, info]) => !info.submitted;

        return new Promise((resolve) => {
            this.storage.get(null, data => resolve(Object.entries(data)
                                                         .filter(isNotSubmitted)
                                                         .filter(isTimeProven)));
        });
    }

    run() {
        // TODO: Automatic tests for sync
        // TODO: [^] Improve readability using asyc / await
        this.findUnsynced()
            .then((found) => {
                if (found.length < 1) {
                    return null;
                }
                return this.findChannelId()
                    .then(id => this.auth(id))
                    .then(auth => this.sendToServer(found))
                    .catch(e => e instanceof AuthError ? console.log(e) : e);
            });
    }

    auth(channel) {
        const params = channel ? { channel } : { anonymous: true };
        return xhrRequest('POST', this.urlAuth, params)
            .then(({ status, data }) => {
                if (status !== 200) {
                    throw new AuthError('status != 200');
                }
                if (!data.authenticated) {
                    throw new AuthError('not authenticated');
                }
                return true;
            });
    }

    findChannelId() {
        return new Promise(resolve =>
            this.storage.get('##ytchan', data =>
                resolve(data['##ytchan'] || null )));
    }

    sendInfo([videoID, info]) {
        const url = `${this.urlReport}${videoID}/`;

        return new Promise(resolve =>
            xhrRequest('PUT', url, info.fragments)
                .then(({ status, data }) => {
                    if (status === 200 && data && data.updated) {
                        this.markAsSubmitted(videoID, info);
                    }
                    return null;
                })
        );
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
