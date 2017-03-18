
class AdditionalControls {

    constructor() {
        const svg = `
            <svg id="Mark_AD" data-name="Mark AD" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
                <defs><style>.mrkad-1{fill:#fff;}.mrkad-2{fill:none;stroke:#f12b24;stroke-miterlimit:10;stroke-width:2px;}</style></defs>
                <title>32cursor-ad</title>
                <path class="mrkad-1" d="M18.07,23.29H15.2L14.74,22h-3l-.46,1.31H8.43L11.85,14h2.81ZM13.62,18.4a12.31,12.31,0,0,1-.35-1.4c-.16.64-.21.85-.39,1.42,0,0-.2.64-.51,1.57h1.74Z"/>
                <path class="mrkad-1" d="M22.9,14a4.3,4.3,0,0,1,4.67,4.6c0,3.08-1.69,4.66-4.72,4.66H18.76V14Zm-1.35,6.92h1.12c1.39,0,2.08-.87,2.08-2.26a2.11,2.11,0,0,0-2.35-2.33h-.85Z"/>
                <line class="mrkad-2" x1="6.81" y1="12.69" x2="6.81" y2="25.38"/><line class="mrkad-2" x1="10.04" y1="12.69" x2="3.58" y2="12.69"/>
                <line class="mrkad-2" x1="10.04" y1="25.38" x2="3.58" y2="25.38"/>
            </svg>`;


        this.controls = this.findPlayerControls();
        this.button = this.addPlayerButton("Отметить рекламу", svg);  // TODO: i18n

        this.addSelections();
    }

    findPlayerControls() {
        return document.getElementsByClassName('ytp-right-controls')[0];
    }

    addPlayerButton(title, svg) {
        const button = document.createElement("button");
        button.classList.add("ytp-button");
        button.classList.add("adr-mark-ad-button");
        button.setAttribute('title', title);

        button.innerHTML = svg;

        this.controls.insertBefore(button, this.controls.childNodes[0]);
        return button;
    }


    addSelections() {

    }
}


chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

        const conts = new AdditionalControls();
        const player = new Player();
        const bar = new FragmentSelectionBar();
        player.skipFragmet(50, 52);


        conts.button.addEventListener('click', () => bar.toggle())

        window.addEventListener("popstate", () => console.log("popstate", document.URL));
        window.addEventListener("popstate", () => console.log("duck", document.URL));



	}
	}, 10);
});
