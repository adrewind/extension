const fakeXHR = require('./base/fake-xhr');
const FakeChromeStorage = require('./base/fake-chrome-storage');


global.chrome = {
    storage: { local: new FakeChromeStorage() },
};
global.environment = 'development';
global.XMLHttpRequest = fakeXHR.xhr;
