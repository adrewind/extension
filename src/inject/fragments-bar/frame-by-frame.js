
export default class FrameByFrameControls {

    constructor(video, playheadEl) {
        this.createElements();
        this.video = video;
        this.onstep = () => null;

        playheadEl.appendChild(this.element);

        this.handleOut();
        this.passInteractions();
    }

    createElements() {
        this.element = document.createElement('div');

        this.elBack = document.createElement('div');
        this.elForward = document.createElement('div');

        this.element.classList.add('adr-frame-by-frame');
        this.elBack.classList.add('adr-frame-by-frame-left');
        this.elForward.classList.add('adr-frame-by-frame-right');

        this.elBack.innerText = '<<';
        this.elForward.innerText = '>>';
        this.hide();

        this.element.appendChild(this.elBack);
        this.element.appendChild(this.elForward);
    }

    show() {
        this.video.pause();
        this.element.style.display = '';
    }

    hide() {
        this.element.style.display = 'none';
    }

    passInteractions() {
        const omitEvent = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const click = (e, direction) => {
            omitEvent(e);
            this.onstep(direction);
        };

        // TODO: Better name for pass
        this.element.addEventListener('click', omitEvent);
        this.element.addEventListener('mousedown', omitEvent);

        this.elBack.addEventListener('click', e => click(e, 'back'));
        this.elBack.addEventListener('mousedown', omitEvent);
        this.elBack.addEventListener('dblclick', omitEvent);

        this.elForward.addEventListener('click', e => click(e, 'forth'));
        this.elForward.addEventListener('mousedown', omitEvent);
        this.elForward.addEventListener('dblclick', omitEvent);
    }

    handleOut() {
        let timeout = null;
        const wait = 1500; // ms

        this.element.addEventListener('mouseout', () => {
            timeout = setTimeout(() => this.hide(), wait);
        });

        this.element.addEventListener('mouseover', () => {
            clearTimeout(timeout);
        });
    }
}
