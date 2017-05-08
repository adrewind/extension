import ADRGuideViewer from './guide-stickers';

const STEP_HELLO = 0;
const STEP_AD_PULSE = 1;
const STEP_PLAYHEAD = 2;
const STEP_COMPLETE = 3;

class ADRGuide {

    constructor(player) {
        this.storage = chrome.storage.local;
        this.locale = ADRGuide.getLocale();
        this.video = player.video;
        this.viewer = new ADRGuideViewer();

        this.viewer.hide();
        this.findElements();

        this.storage.get('###guide', (found) => {
            const step = found['###guide'] || 0;
            this.showStep(step);
        });
    }

    showStep(step) {
        this.storage.set({ '###guide': step }, () => null);

        if (step === STEP_HELLO) {
            return this.showHello();
        }

        if (step === STEP_AD_PULSE) {
            return this.showButtonPulse();
        }

        if (step === STEP_PLAYHEAD) {
            this.showPlayheadHelp();
        }
        return null;
    }

    static getLocale() {
        const accepted = ['ru', 'en'];
        const actual = navigator.language;

        if (accepted.includes(actual)) {
            return actual;
        }
        return 'en';
    }

    findElements() {
        this.menu = document.getElementsByClassName('adr-ad-sel-menu')[0];
        this.helpText = document.getElementsByClassName('adr-ad-help-text')[0];
        this.adButton = document.getElementsByClassName('adr-mark-ad-button')[0];
    }

    showHello() {
        this.viewer.showScreen('guide-hello', this.locale);

        const showpulse = () => {
            this.showStep(STEP_AD_PULSE);
            this.viewer.element.removeEventListener('click', showpulse);
        };
        this.viewer.element.addEventListener('click', showpulse);
    }

    showButtonPulse() {
        this.adButton.classList.add('adr-pulse');

        const removePulse = () => {
            this.adButton.classList.remove('adr-pulse');
            this.adButton.removeEventListener('adr-click', removePulse);

            this.highlightBar(); // TODO: Find better place for it
        };
        this.adButton.addEventListener('click', removePulse);
    }

    highlightBar() {
        // FIXME: why it doesn't work?
        this.helpText.classList.add('highlight');
        this.helpText.classList.add('inactive');

        setTimeout(() => this.helpText.classList.remove('inactive'), 60);
        setTimeout(() => this.helpText.classList.add('inactive'), 2500);

        this.showStep(STEP_PLAYHEAD);
    }

    showPlayheadHelp() {
        const showRemovingHelp = (e) => {
            e.preventDefault();
            e.stopPropagation();

            const selection = document.getElementsByClassName('adr-sel-bg')[0];
            if (!selection) {
                return;
            }
            this.viewer.showHint('guide-removal', this.locale);
            this.viewer.stickTo(selection);

            this.showStep(STEP_COMPLETE);
            this.viewer.element.removeEventListener('click', showRemovingHelp);
        };

        const showPlayheadHint = () => {
            const playhead = document.getElementsByClassName('adr-playhead-right')[0];
            if (!playhead) {
                return;
            }
            this.viewer.showHint('guide-playhead', this.locale);
            this.viewer.stickTo(playhead);
            this.video.pause();

            this.viewer.element.addEventListener('click', showRemovingHelp);
        };

        const showHintAndOmitEvent = (e) => {
            e.preventDefault();
            e.stopPropagation();

            showPlayheadHint();
            this.helpText.removeEventListener('click', showHintAndOmitEvent);
        };

        const waitRecordingEnds = () => {
            // TODO: Do not trust first and second click, use
            this.helpText.addEventListener('click', showHintAndOmitEvent);
            this.helpText.removeEventListener('click', waitRecordingEnds);
        };

        this.helpText.addEventListener('click', waitRecordingEnds);
    }

}


// TODO: use it in future to close ad before opening fragments bar
// TODO: also this selector must be more specific
// document.getElementsByClassName('close-button')[0].click()

export default async function showGuide(player) {
    await player.ads.untilEnds();
    chrome.adrGuide = new ADRGuide(player);
}
