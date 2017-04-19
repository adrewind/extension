import { ELEMENT_LOCATE_FREQ } from '../../config';


export default async function untilLocated(locateFunc) {
    return new Promise((resolve) => {
        const wait = setInterval(() => {
            const found = locateFunc();
            if (!found) { return; }

            resolve(found);
            clearInterval(wait);
        }, ELEMENT_LOCATE_FREQ);
    });
}
