
export default class User {

    constructor() {
        this.userID = null;
        this.scriptContainer = document.head;

        this.addIDScript();
    }

    getID() {
        if (this.userID === 'null') {
            return null;
        }

        if (this.userID) {
            return this.userID;
        }

        const div = document.getElementById('adr-youtube-channel-id');

        if (!div || !div.dataset || !div.dataset.channel) {
            return null;
        }

        this.userID = div.dataset.channel;
        return this.userID;
    }

    addIDScript() {
        const script = document.createElement('script');
        script.innerHTML = `(function() {
            function getUserID() {
                let params;
                let ghelp;
                let chanid;

                try {
                    params = window.ytInitialData.responseContext.serviceTrackingParams;
                    ghelp = params.filter(i => i.service === "GUIDED_HELP")[0];
                    chanid = ghelp.params.filter(i => i.key === "creator_channel_id")[0];
                } catch (e) {
                    return null;
                }

                return chanid.value || null;
            }
            const body = document.getElementsByTagName('body')[0];
            const div = document.createElement('div');

            div.id = 'adr-youtube-channel-id';
            div.dataset.channel = getUserID();

            body.appendChild(div);
        })();`;
        this.scriptContainer.appendChild(script);
    }

}
