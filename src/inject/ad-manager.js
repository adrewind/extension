
class ADManager {

    constructor() {
        this.videoID = null;
        this.controls = null;
        this.adJumper = null;
        this.selectionBar = null;

        this.adInfo = new ADInfo();

        this.handleVideoChange();
        adrObserver.onSRCChanged(() =>
            this.handleVideoChange());
    }

    getVideoID() {
        function youtubeUrlParser(url) {
            const exp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&\?]*).*/;
            const match = url.match(exp);
            return (match && match[7].length === 11) ? match[7] : null;
        }

        return youtubeUrlParser(document.URL);
    }

    toggleEditor() {
        const shown = this.selectionBar.toggle();

        if (shown) {
            this.adJumper.enable();
        } else {
            this.adJumper.disable();
        }
    }

    handleEdits() {
        const fragments = this.selectionBar.exportFragments();
        this.adJumper.updateFragments(fragments);
        this.adInfo.update(this.videoID, fragments);
    }

    handleVideoChange() {
        const videoID = this.getVideoID();

        if (this.videoID === videoID) {
            return;
        }

        this.videoID = videoID;

        if (!this.adJumper && !this.createADJumper()) {
            return;
        }

        this.createSelectionBar();
        this.loadInfo(videoID);

        if (!this.controls && !this.createControls()) {
            return;
        }
    }

    createControls() {
        try {
            this.controls = new AdditionalControls();
            this.controls.button.addEventListener('click', () => this.toggleEditor());
        } catch (e) {
            if (e instanceof NoElementError) {
                return false;
            } else {
                throw e;
            }
        }
        return true;
    }

    createADJumper() {
        try {
            this.adJumper = new ADJumper();
        } catch (e) {
            if (e instanceof NoElementError) {
                return false;
            } else {
                throw e;
            }
        }
        return true;
    }

    createSelectionBar() {
        if (this.selectionBar) {
            this.selectionBar.destroy();
        }

        this.selectionBar = new FragmentSelectionBar();
        this.selectionBar.onChange(() => this.handleEdits());
    }

    loadInfo(videoID) {
        this.adInfo.load(videoID).then((info) => {
            const fragments = info && info.fragments ? info.fragments : [];

            this.adJumper.updateFragments(fragments);
            this.selectionBar.loadFragments(fragments);
        });
    }
}
