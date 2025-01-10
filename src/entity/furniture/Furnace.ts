import * as PIXI from "pixi.js";
import System from "../../core/System";
import Craftable from "./Craftable";
import Crafting from "../../crafting/Crafting";
import Rectangle = PIXI.Rectangle;

export default class Furnace extends Craftable {

    private static baseTexture = PIXI.BaseTexture.from(System.getResource("furniture", "furnace.png"));

    constructor() {
        super(Crafting.furnaceRecipes);
    }

    public static create({id, x, y}: { id: string, x: number, y: number }): Furnace {
        return super.create({id, x, y}) as Furnace;
    }

    public toBSON(): any {
        return {
            ...super.toBSON(),
        };
    }

    protected init(): void {
        const sprite = new PIXI.Sprite(new PIXI.Texture(Furnace.baseTexture, new Rectangle(0, 0, 16, 16)));
        sprite.anchor.set(0.5);
        this.container.addChild(sprite);
    }
}
