import Furniture from "./Furniture";
import * as PIXI from "pixi.js";
import System from "../../core/System";

export default class Bed extends Furniture {
    private static baseTexture = PIXI.BaseTexture.from(System.getResource("furniture", "bed.png"));

    constructor() {
        super();
        this.hitbox.set(0, 3, 16, 10);
    }

    public static create({id, x, y}: { id: string, x: number, y: number }): Bed {
        return super.create({id, x, y}) as Bed;
    }

    protected init(): void {
        const sprite = new PIXI.Sprite(new PIXI.Texture(Bed.baseTexture));
        sprite.anchor.set(0.5);
        this.container.addChild(sprite);
    }
}
