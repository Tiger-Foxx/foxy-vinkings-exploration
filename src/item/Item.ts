import * as PIXI from "pixi.js";
import uniqid from "uniqid";
import Localization from "../core/io/Localization";
import {Entity, Player} from "../entity/";
import Mob from "../entity/mob/Mob";
import LevelTile from "../level/LevelTile";
import Items from "./Items";
import Updater from "../core/Updater";
import System from "../core/System";

export default class Item {

    public craftedBy?: Mob;
    public tag: string;
    public uid: string = uniqid();
    protected texture: PIXI.Texture = PIXI.Texture.from(System.getResource("no_texture.png"));
    private cooldownTime = 0;

    constructor(tag: string) {
        this.tag = tag;
    }

    public static create({tag}: { tag: string }): Item | undefined {
        return Items.get(tag)?.item;
    }

    public static verifyTag(tag: string): boolean {
        return Localization.verify(`item.${tag}`);
    }

    public canAttack(): boolean {
        return false;
    }

    public destroy(mob: Mob): void {
        mob.inventory.removeThisItem(this);
    }

    public getDisplayName(): string {
        return Localization.get(`item.${this.tag}`);
    }

    public getSprite(centred = false): PIXI.Sprite {
        const texture = (!this.texture.valid) ? PIXI.Texture.from(System.getResource("no_texture.png")) : this.texture;
        const sprite = new PIXI.Sprite(texture);
        if (centred) {
            sprite.anchor.set(0.5);
        }
        return sprite;
    }

    public getTexture(): PIXI.Texture {
        return this.texture;
    }

    public interact(player: Player, entity: Entity): boolean {
        return false;
    }

    public isStackable(): boolean {
        return false;
    }

    public toBSON(): any {
        return {
            tag: this.tag,
        };
    }

    public toString(): string {
        return `${this.tag}#${this.uid}`;
    }

    public useOn(levelTile: LevelTile, mob: Mob): boolean {
        this.cooldownTime = Updater.ticks;
        return levelTile.onInteract(mob, this);
    }

    protected getCooldownTime(): number {
        return (Updater.ticks - this.cooldownTime);
    }
}
