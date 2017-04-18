import { localStorage } from '../../common/storage';

// TODO: Remove me 18.05.2017
export async function findBrokenRecords() {
    function sequentialPairs(array) {
        if (array.length < 2) {
            return [];
        }
        return array.slice(0, -1).map((t, i) => [t, array[i + 1]]);
    }

    function validateFragment(f) {
        return f.length === 2 &&
            f[0] < f[1] &&
            f[0] >= 0;
    }

    function isIntersects([a, b]) {
        const aEnd = a[1];
        const bStart = b[0];
        return aEnd > bStart;
    }

    function validateFragments(data) {
        const valid = data.map(validateFragment);
        if (valid.includes(false)) {
            return true;
        }

        const sorted = data.sort((a, b) => a[0] - b[0]);
        const intersects = sequentialPairs(sorted).map(isIntersects);

        if (intersects.includes(true)) {
            return true;
        }

        return null;
    }

    const broken = {};
    const allVideos = await localStorage.get(null);

    Object.entries(allVideos).forEach(([key, value]) => {
        if (key.startsWith('#')) {
            return;
        }
        if (!value.fragments) {
            return;
        }
        const error = validateFragments(value.fragments);
        if (error) {
            broken[key] = value;
        }
    });

    return broken;
}

export async function fixNegativeFragments(videos) {
    const fixed = {};
    Object.entries(videos).forEach(([key, value]) => {
        fixed[key] = value;
        fixed[key].submitted = false;
        fixed[key].fragments = value.fragments.map(
            ([start, end]) =>
                [Math.max(0, start), end]);
    });

    await localStorage.set(fixed);
}


(async () => {
    const found = await findBrokenRecords();
    await fixNegativeFragments(found);
})();
