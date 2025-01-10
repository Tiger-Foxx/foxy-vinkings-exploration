import Item from "./Item";
import LevelTile from "../level/LevelTile";
import {Hook, Mob} from "../entity";
import * as PIXI from "pixi.js";
import System from "../core/System";

export default class FishingRodItem extends Item {

    private durability: number;
    private readonly durabilityMax: number = 50;
    private hook?: Hook;

    constructor() {
        super("fishing_rod");
        this.durability = this.durabilityMax;
        this.texture = PIXI.Texture.from(System.getResource("items", "fishing_rod.png"));
    }

    public static create({tag, durability}: { tag: string, durability: number }): FishingRodItem {
        const item = super.create({tag}) as FishingRodItem;
        item.durability = durability;
        return item;
    }

    public clearHook(): void {
        this.hook = undefined;
    }

    public fix(amount: number): void {
        this.durability = Math.min(this.durability + amount, this.durabilityMax);
    }

    public isStackable(): boolean {
        return false;
    }

    public toBSON(): any {
        return {
            ...super.toBSON(),
            durability: this.durability,
        };
    }

    public useOn(levelTile: LevelTile, mob: Mob): boolean {
        if (this.getCooldownTime() <= 5) return false;
        super.useOn(levelTile, mob);
        if (this.hook) return this.hook.pull();
        this.hook = new Hook(mob, this);
        this.hook.a.x = mob.getDir().getX();
        this.hook.a.y = mob.getDir().getY();
        this.hook.a.z = 2;
        mob.getLevel()?.add(this.hook, mob.x + mob.getDir().getX() * 10, mob.y + mob.getDir().getY() * 10);
        return true;
    }
}
