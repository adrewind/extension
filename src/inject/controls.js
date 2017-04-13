import { adrElements, NoElementError } from './adr-state';


export default class AdditionalControls {

    constructor() {
        const svg = `
            <svg id="Mark_AD" data-name="Mark AD" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
                <defs><style>.mrkad-1{fill:#fff;}.mrkad-2{fill:none;stroke:#f12b24;stroke-miterlimit:10;stroke-width:2px;}</style></defs>
                <path class="mrkad-1" d="M20.5,22.4H17.62l-.46-1.31h-3l-.46,1.31H10.86l3.42-9.26h2.81ZM16,17.51a12.31,12.31,0,0,1-.35-1.4c-.16.64-.21.85-.39,1.42,0,0-.2.64-.51,1.57h1.74Z"/>
                <path class="mrkad-1" d="M25.32,13.14A4.3,4.3,0,0,1,30,17.74c0,3.08-1.69,4.66-4.72,4.66H21.19V13.14ZM24,20.06h1.12c1.39,0,2.08-.87,2.08-2.26a2.11,2.11,0,0,0-2.35-2.33H24Z"/>
                <line class="mrkad-2" x1="9.24" y1="11.79" x2="9.24" y2="24.49"/>
                <line class="mrkad-2" x1="12.46" y1="11.79" x2="6.01" y2="11.79"/>
                <line class="mrkad-2" x1="12.46" y1="24.49" x2="6.01" y2="24.49"/>
            </svg>`;


        const found = adrElements.findRightControls();
        if (!found) {
            throw new NoElementError('Right control panel is not found');
        }

        window.adr = adrElements;
        console.log(found);

        this.controls = found;
        this.button = this.addPlayerButton('Отметить рекламу', svg);  // TODO: i18n
    }

    // TODO: show ytp-tooltip on mouseover
    addPlayerButton(title, svg) {
        const button = document.createElement('button');
        button.classList.add('ytp-button');
        button.classList.add('adr-mark-ad-button');
        button.setAttribute('title', title);

        button.innerHTML = svg;

        this.controls.insertBefore(button, this.controls.childNodes[0]);
        return button;
    }
}
