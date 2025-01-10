export default class MouseHandler {
    public deltaX = 0;
    public deltaY = 0;
    public deltaZ = 0;

    constructor() {
        document.addEventListener("wheel", (e) => this.onwheel(e), {passive: false});
    }

    public onTick(): void {
        this.deltaX = 0;
        this.deltaY = 0;
        this.deltaZ = 0;
    }

    private onwheel(e: WheelEvent): void {
        e.preventDefault();
        this.deltaX = e.deltaX;
        this.deltaY = e.deltaY;
        this.deltaZ = e.deltaZ;
    }
}

