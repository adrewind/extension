
export const ELEMENT_LOCATE_FREQ = 500; // ms
export const API_ENDPOINT_VIDEOS = environment === 'production' ?
    'https://gv.adrewind.net' : 'http://www.mocky.io/v2/58f7e7b21100001a02a172db';
export const API_ENDPOINT_REPORTS = environment === 'production' ?
    'https://tk.adrewind.net' : 'http://www.mocky.io/v2/58f7e7b21100001a02a172db';

export const SYNC_ALARM_PERIOD = 3; // minutes
export const SYNC_MATURITY_TRESHOLD = 5; // minutes. Items must be untouched 5 minutes or more
