
function XHRRequest(method, url, data = '') {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        const json = data === '' ? '' : JSON.stringify(data);

        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onloadend = () => {
            let data;
            try {
                data = JSON.parse(xhr.response);
            } catch (e) {
                data = new Error('incorrect data');
            }

            resolve({
                data: data,
                status: xhr.status,
            });
        }

        xhr.send(json);
    });
}
