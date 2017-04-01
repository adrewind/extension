
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
        // TODO: Replace this function with url parsing and getting V parameter
        // because of urls like this https://www.youtube.com/watch?v=pS0GGcz7wN4&index=21&list=PLJ8cMiYb3G5eNMPb_MTRyLDzm_AOIk7UF
        function youtubeUrlParser(url) {
            const exp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&\?]*).*/;
            const match = url.match(exp);
            return (match && match[7].length === 11) ? match[7] : null;
        }

        return youtubeUrlParser(document.URL);
    }

    toggleEditor() {
        // We do not touch Youtube's pre-roll ads
        // user can skip it manually or find another extension
        if (adrElements.adIsShowing()) {
            this.selectionBar.hide();
            this.adJumper.disable();
            return;
        }

        if (this.selectionBar.isShown()) {
            this.adJumper.enable();
            this.selectionBar.hide();
        } else {
            this.adJumper.disable();
            this.selectionBar.show();
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

        this.adJumper.reset();
        this.createSelectionBar();
        this.loadInfo(videoID);

        if (!this.controls && !this.createControls()) {
            return;
        }

        // We do not touch Youtube's pre-roll ads
        // user can skip it manually or find another extension
        if (adrElements.adIsShowing()) {
            this.selectionBar.hide();
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
        this.adInfo.load(videoID).then((fragments) => {
            this.adJumper.updateFragments(fragments);
            this.selectionBar.loadFragments(fragments);
        });
    }
}
