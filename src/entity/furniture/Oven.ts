import * as PIXI from "pixi.js";
import System from "../../core/System";
import Craftable from "./Craftable";
import Crafting from "../../crafting/Crafting";

export default class Oven extends Craftable {

    private static baseTexture = PIXI.BaseTexture.from(System.getResource("furniture", "oven.png"));

    constructor() {
        super(Crafting.ovenRecipes);
    }

    public static create({id, x, y}: { id: string, x: number, y: number }): Oven {
        return super.create({id, x, y}) as Oven;
    }

    public toBSON(): any {
        return {
            ...super.toBSON(),
        };
    }

    protected init(): void {
        const sprite = new PIXI.Sprite(new PIXI.Texture(Oven.baseTexture, new PIXI.Rectangle(0, 0, 16, 16)));
        sprite.anchor.set(0.5);
        this.container.addChild(sprite);
    }
}
