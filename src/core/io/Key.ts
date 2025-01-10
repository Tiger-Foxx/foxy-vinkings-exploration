export default class Key {
    public clicked = false;

    public down = false;
    public sticky = false;
    private absorbs = 0;
    private presses = 0;
    private stayDown = false;

    constructor(stayDown = false) {
        this.stayDown = stayDown;
    }

    public onTick(): void {
        if (this.absorbs < this.presses) {
            this.absorbs++;
            if (this.presses - this.absorbs > 3) {
                this.absorbs = this.presses - 3;
            }
            this.clicked = true;
        } else {
            if (!this.sticky) {
                this.sticky = this.presses > 3;
            } else {
                this.sticky = this.down;
            }
            this.clicked = this.sticky;
            this.presses = 0;
            this.absorbs = 0;
        }
    }

    public release(): void {
        this.down = false;
        this.clicked = false;
        this.presses = 0;
        this.absorbs = 0;
        this.sticky = false;
    }

    public toggle(pressed: boolean): void {
        this.down = pressed;
        if (pressed && !this.sticky) {
            this.presses++;
        }
    }

    public toString(): string {
        return `down: ${this.down}; clicked: ${this.clicked}; presses=${this.presses}; absorbs=${this.absorbs};`;
    }
}
