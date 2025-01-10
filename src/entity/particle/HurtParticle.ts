import Particle from "./Particle";
import * as PIXI from "pixi.js";
import System from "../../core/System";

export default class HurtParticle extends Particle {

    private readonly sprite: PIXI.Sprite;

    constructor(x: number, y: number) {
        super(x, y);
        this.lifeDuration = 3;
        this.sprite = PIXI.Sprite.from(PIXI.Texture.from(System.getResource("particle", "hurt.png")));
        this.sprite.anchor.set(0.5);
        this.addChild(this.sprite);
    }

    protected getZIndex(): number {
        return this.y + this.z + 8;
    }
}
