
class ChromeStorageWrapper {

    constructor(storage) {
        this.storage = storage;
    }

    get(key) {
        return new Promise(resolve =>
            this.storage.get(key, found => resolve(found)));
    }

    set(object) {
        return new Promise(resolve =>
            this.storage.set(object, () => resolve()));
    }

    remove(key) {
        return new Promise(resolve =>
            this.storage.remove(key, () => resolve()));
    }

}

export const syncStorage = new ChromeStorageWrapper(chrome.storage.sync);
export const localStorage = new ChromeStorageWrapper(chrome.storage.local);
