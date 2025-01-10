import * as PIXI from "pixi.js";
import System from "../../core/System";
import Craftable from "./Craftable";
import Crafting from "../../crafting/Crafting";

export default class Anvil extends Craftable {

    private static baseTexture = PIXI.BaseTexture.from(System.getResource("furniture", "anvil.png"));

    constructor() {
        super(Crafting.anvilRecipes);
    }

    public static create({id, x, y}: { id: string, x: number, y: number }): Anvil {
        return super.create({id, x, y}) as Anvil;
    }

    public toBSON(): any {
        return {
            ...super.toBSON(),
        };
    }

    protected init(): void {
        const sprite = new PIXI.Sprite(new PIXI.Texture(Anvil.baseTexture, new PIXI.Rectangle(0, 0, 16, 16)));
        sprite.anchor.set(0.5);
        this.container.addChild(sprite);
    }
}
