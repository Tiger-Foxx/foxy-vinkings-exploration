import * as PIXI from "pixi.js";

export default class Hitbox extends PIXI.Sprite {
    public height = 0;
    public width = 0;
    public x = 0;
    public y = 0;

    constructor(x = 0, y = 0, width = 0, height = 0) {
        super(PIXI.Texture.WHITE);
        this.set(x, y, width, height);
        this.anchor.set(0.5);
        this.alpha = 0.5;
        this.visible = false;
    }

    public collision(hb: Hitbox): boolean {
        return !((hb.x >= this.x + this.width)
            || (hb.x + hb.width <= this.x)
            || (hb.y >= this.y + this.height)
            || (hb.y + hb.height <= this.y));
    }

    public set(x: number, y: number, width: number, height: number): void {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
}
