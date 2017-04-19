// if you checked 'fancy-settings' in extensionizr.com, uncomment this lines

// var settings = new Store('settings', {
//     'sample_setting': 'This is how you use Store.js to remember values'
// });

import './proxy';
import './bugfix/playhead-negative-time';  // TODO: Remove me 18.05.2017
import Sync from './sync';
import { SYNC_ALARM_PERIOD } from '../config';


chrome.alarms.create('sync', { periodInMinutes: SYNC_ALARM_PERIOD });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name !== 'sync') {
        return;
    }

    const sync = new Sync();
    sync.run();
});
