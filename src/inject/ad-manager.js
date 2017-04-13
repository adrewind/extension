import ADInfo from './ad-info';
import ADJumper from './ad-jumper';
import AdditionalControls from './controls';
import Player from './yt-api/player';
import FragmentSelectionBar from './fragments-bar/bar';
import { adrElements, adrObserver, NoElementError } from './adr-state';


export default class ADManager {

    constructor() {
        this.paleyr = null;
        this.videoID = null;
        this.controls = null;
        this.adJumper = null;
        this.selectionBar = null;

        this.player = new Player();
        this.adInfo = new ADInfo();

        this.init();
    }

    async init() {
        await this.player.init();

        this.handleVideoChange();
        this.player.events.srcChanged(() =>
            this.handleVideoChange());
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
        const videoID = this.player.getVideoID();

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
            }
            throw e;
        }
        return true;
    }

    createADJumper() {
        try {
            this.adJumper = new ADJumper();
        } catch (e) {
            if (e instanceof NoElementError) {
                return false;
            }
            throw e;
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
