import * as PIXI from "pixi.js";
import Game from "../core/Game";
import Renderer from "../core/Renderer";

export default abstract class Display extends PIXI.Container {
    public active = false;
    public hasCommand = false;

    protected constructor() {
        super();
    }

    public hide(): void {
        this.active = false;
        this.parent.removeChild(this);
        Game.GUI.removeDisplay(this);
    }

    public isBlocking(): boolean {
        return false;
    }

    public onCommand(): void {

    }

    public onRender(): void {

    }

    public onResize(): void {

    }

    public onTick(): void {

    }

    public show(): void {
        this.active = true;
        Renderer.addDisplay(this);
        Game.GUI.addDisplay(this);
    }

    public toggle(): void {
        if (this.active) {
            this.hide();
        } else {
            this.show();
        }
    }
}
