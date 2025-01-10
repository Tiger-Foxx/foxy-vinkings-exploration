import Item from "./Item";
import PotionType from "./PotionType";
import {Mob} from "../entity";
import LevelTile from "../level/LevelTile";
import * as PIXI from "pixi.js";
import System from "../core/System";
import Items from "./Items";

export default class PotionItem extends Item {

    private readonly potion: PotionType;

    constructor(tag: string, type: PotionType) {
        super(tag);
        this.potion = type;
    }

    public getSprite(centred = false): PIXI.Sprite {
        const sprite = new PIXI.Sprite(PIXI.Texture.from(System.getResource("items", "potion.png")));
        const overlay = new PIXI.Sprite(PIXI.Texture.from(System.getResource("items", "potion_overlay.png")));
        overlay.tint = this.potion.color.getInt();
        sprite.addChild(overlay);
        if (centred) {
            sprite.anchor.set(0.5);
            overlay.anchor.set(0.5);
        }
        return sprite;
    }

    public useOn(levelTile: LevelTile, mob: Mob): boolean {
        if (mob.addPotionEffect(this.potion)) {
            mob.inventory.removeItem(this, 1);
            mob.inventory.addItem(Items.FLASK, 1);
            return true;
        }
        return false;
    }
}
