import Furniture from "./Furniture";
import Inventory from "../../item/Inventory";
import {Mob} from "../index";
import * as PIXI from "pixi.js";
import System from "../../core/System";
import ContainerDisplay from "../../screen/ContainerDisplay";
import Game from "../../core/Game";
import Item from "../../item/Item";
import Rectangle = PIXI.Rectangle;

export default class Chest extends Furniture {
    private static baseTexture = PIXI.BaseTexture.from(System.getResource("furniture", "chest.png"));
    public inventory = new Inventory(16);

    public static create({id, inventory, x, y}: any): Chest {
        const e = super.create({id, x, y}) as Chest;
        e.inventory = Inventory.create(inventory);
        return e;
    }

    public onUse(mob: Mob, item?: Item): boolean {
        Game.GUI.setDisplay(new ContainerDisplay(mob, this.inventory));
        return false;
    }

    public toBSON(): any {
        return {
            ...super.toBSON(),
            inventory: this.inventory,
        };
    }

    protected init(): void {
        const sprite = new PIXI.Sprite(new PIXI.Texture(Chest.baseTexture, new Rectangle(0, 0, 16, 16)));
        sprite.anchor.set(0.5);
        this.container.addChild(sprite);
    }
}
