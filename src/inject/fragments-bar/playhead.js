
class Playhead {

    constructor(side, callback) {
        this.side = side;
        this.body = adrElements.body;
        this.container = adrElements.controlsContainer;
        // this.locked = false;
        this.onchange = callback;
        this.onchanged = () => null;
        this.ondblclick = () => null;

        this.leftWall = 0;
        this.rightWall = 1;

        this.element = this.createElement();
        this.handleMove();
    }

    createElement() {
        const element = document.createElement('div');
        element.classList.add(`adr-playhead-${this.side}`);

        element.addEventListener('dblclick', (e) => this.ondblclick(e));

        return element;
    }

    handleMove() {
        function applyConstraints(value, min, max) {
            return Math.max(min, Math.min(max, value));
        }

        const mousemove = (e) => {
            e.preventDefault();

            const rect = this.container.getBoundingClientRect();
            const diff = e.clientX - rect.left;
            const percent = diff / rect.width;
            const value = applyConstraints(percent, this.leftWall, this.rightWall);

            this.onchange(value);
        };

        const mouseup = (e) => {
            e.preventDefault();

            this.onchanged();
            this.body.removeEventListener('mouseup', mouseup);
            this.body.removeEventListener('mousemove', mousemove);
        };

        this.element.addEventListener('mousedown', (e) => {
            e.preventDefault();

            this.body.addEventListener('mouseup', mouseup);
            this.body.addEventListener('mousemove', mousemove);
        });
    }

    setConstrains(left, right) {
        this.leftWall = Math.max(0, left);
        this.rightWall = Math.min(1, right);
    }
}
