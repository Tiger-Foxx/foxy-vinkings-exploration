import Random from "../utility/Random";
import Item from "./Item";
import Tiers from "./Tiers";
import ToolType from "./ToolType";
import LevelTile from "../level/LevelTile";
import Mob from "../entity/mob/Mob";

export default class ToolItem extends Item {

    public readonly type: ToolType;
    private durability: number;
    private readonly durabilityMax: number;
    private readonly level: number;

    constructor(tag: string, type: ToolType, level = Tiers.WOOD) {
        super(tag);
        this.type = type;
        if (level > ToolType.nbLevel - 1) {
            level = ToolType.nbLevel - 1;
        }
        this.level = level;
        this.durabilityMax = 40 + level * 10;
        this.durability = this.durabilityMax;
        this.texture = type.textures[level];
        this.tag = ToolType.getLevelName(this.level) + "_" + this.type.name;
    }

    public static create(data: any): ToolItem {
        const item = super.create(data) as ToolItem;
        item.durability = data.durability;
        return item;
    }

    public canAttack(): boolean {
        return true;
    }

    public fix(amount: number): void {
        this.durability = Math.min(this.durability + amount, this.durabilityMax);
    }

    public getAttackDamageBonus(): number {
        if (this.type === ToolType.AXE) {
            return (this.level + 1) * 2 + Random.int(4);
        }
        if (this.type === ToolType.PICKAXE) {
            return (this.level + 1) * 2;
        }
        if (this.type === ToolType.SWORD) {
            return (this.level + 1) * 3 + Random.int(this.level * this.level);
        }
        return 1;
    }

    public getCooldown(): number {
        return ((ToolType.nbLevel - this.level) + 1) * 2;
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
        if (this.durability <= 0) {
            this.destroy(mob);
            return false;
        }
        if (this.getCooldownTime() <= this.getCooldown()) return false;
        if (super.useOn(levelTile, mob)) {
            this.durability--;
            return true;
        }
        return false;
    }
}
