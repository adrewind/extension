
class FakeChromeStorage {

    constructor() {
        this.storage = {}
    }

    getFilter(raw) {
        if (raw === null) {
            return k => true;
        }

        if (typeof raw === 'string') {
            return k => k === raw;
        }

        if (Array.isArray(raw)) {
            console.log("INCLUDES")
            return k => raw.includes(k);
        } else {
            return k => Object.keys(raw).includes(k);
        }
        return k => false;
    }

    get(key, callback) {
        const result = {};
        const allowed = this.getFilter(key);

        Object.keys(this.storage)
              .filter(allowed)
              .forEach((k) => { result[k] = this.storage[k] });
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
    }

    flush() {
        this.storage = {};
    }

}

module.exports = FakeChromeStorage;
