
class FakeChromeStorage {

    constructor() {
        this.storage = {};
    }

    static getFilter(raw) {
        if (raw === null) {
            return () => true;
        }

        if (typeof raw === 'string') {
            return k => k === raw;
        }

        if (Array.isArray(raw)) {
            return k => raw.includes(k);
        }

        if (Object.keys(raw).length > 0) {
            return k => Object.keys(raw).includes(k);
        }
        return () => false;
    }

    get(key, callback) {
        const result = {};
        const allowed = FakeChromeStorage.getFilter(key);

        Object.keys(this.storage)
              .filter(allowed)
              .forEach((k) => { result[k] = this.storage[k]; });
        callback(result);
    }

    set(data, callback) {
        this.storage = Object.assign({}, this.storage, data);
        if (callback) {
            callback();
        }
    }

    delete(key, callback) {
        const allowed = this.getFilter(key);
        Object.keys(this.storage)
              .filter(allowed)
              .forEach((k) => { delete this.storage[k]; });
        // TODO: check if original function sends something to callback
        callback();
    }

    flush() {
        this.storage = {};
    }

}

module.exports = FakeChromeStorage;
