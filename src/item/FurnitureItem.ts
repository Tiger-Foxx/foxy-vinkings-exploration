import Item from "./Item";
import {Furniture} from "../entity";
import LevelTile from "../level/LevelTile";
import Mob from "../entity/mob/Mob";
import * as PIXI from "pixi.js";
import System from "../core/System";

export default class FurnitureItem extends Item {

    private readonly furniture: Furniture;

    constructor(tag: string, furniture: typeof Furniture | Furniture) {
        super(tag);
        if (!(furniture instanceof Furniture)) {
            // @ts-ignore
            this.furniture = new furniture();
        } else {
            this.furniture = furniture;
        }
        this.texture = PIXI.Texture.from(System.getResource("items", `${tag}.png`));
    }

    public static create({tag}: { tag: string }): FurnitureItem {
        return super.create({tag}) as FurnitureItem;
    }

    public canAttack(): boolean {
        return true;
    }

    public getFurnitureSprite(): PIXI.DisplayObject {
        return this.furniture.getSprite();
    }

    public isStackable(): boolean {
        return false;
    }

    public toBSON(): any {
        return {
            ...super.toBSON(),
        };
    }

    public useOn(levelTile: LevelTile, mob: Mob): boolean {
        if (this.getCooldownTime() <= 5) return false;
        super.useOn(levelTile, mob);
        if (levelTile.tile?.mayPass(this.furniture) && !levelTile.hasEntity()) {
            if (levelTile.level.add(this.furniture, levelTile.x + 8, levelTile.y + 8)) {
                mob.inventory.removeItem(this, 1);
                return true;
            }
        }
        return false;
    }
}
