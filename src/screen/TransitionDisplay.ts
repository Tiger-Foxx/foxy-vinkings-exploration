import * as PIXI from "pixi.js";
import Display from "./Display";
import Renderer from "../core/Renderer";
import Color from "../utility/Color";

export default class TransitionDisplay extends Display {

    private readonly graphics: PIXI.Graphics;
    private percent = 0;
    private readonly speed: number;
    private readonly transitionOut: boolean;

    constructor(out = false) {
        super();
        this.transitionOut = out;
        if (this.transitionOut) {
            this.percent = 1;
            this.speed = -0.02;
        } else {
            this.percent = 0;
            this.speed = 0.02;
        }
        this.graphics = new PIXI.Graphics();
        this.graphics.scale.set(1.2);
        this.addChild(this.graphics);
    }

    public onRender(): void {
        super.onRender();
        this.drawHole(this.percent);
        this.percent += this.speed;
        if (!this.transitionOut && this.percent >= 1 || this.transitionOut && this.percent <= 0) {
            console.log("hide");
            this.hide();
        }
    }

    private drawHole(percent: number): void {
        if (!this.graphics || percent <= 0 || percent > 1) return;
        this.graphics.pivot.set(Renderer.getScreen().width / 2, Renderer.getScreen().height / 2);
        this.graphics.position.set(Renderer.getScreen().width / 2, Renderer.getScreen().height / 2);
        const max = Math.max(Renderer.getScreen().width, Renderer.getScreen().height) / 2;
        const radius = percent * max;
        this.graphics.clear();
        this.graphics.beginFill(Color.black.getInt());
        this.graphics.drawRect(0, 0, Renderer.getScreen().width, Renderer.getScreen().height);
        this.graphics.beginHole();
        this.graphics.drawCircle(Renderer.getScreen().width / 2, Renderer.getScreen().height / 2, radius);
        this.graphics.endHole();
        this.graphics.endFill();
    }

}
