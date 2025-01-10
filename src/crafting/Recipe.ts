import {Mob} from "../entity";
import Item from "../item/Item";
import {ItemRegister} from "../item/Items";

export default class Recipe {
    public canCraft = false;
    public cost: Array<[ItemRegister<Item>, number]> = [];
    public readonly result: ItemRegister<Item>;
    private craftTime = 50;

    constructor(result: ItemRegister<Item>) {
        this.result = result;
    }

    public addCost(itemRegister: ItemRegister<Item>, count: number): this {
        this.cost.push([itemRegister, count]);
        return this;
    }

    public checkCanCraft(mob: Mob): void {
        for (const cost of this.cost) {
            const item = cost[0];
            const count = cost[1];
            if (item instanceof Item) {
                if (!mob.inventory.hasItem(item, count)) {
                    this.canCraft = false;
                    return;
                }
            }
        }
        this.canCraft = true;
    }

    public craft(mob: Mob): boolean {
        const item = this.result.item;
        item.craftedBy = mob;
        return mob.inventory.addItem(item);
    }

    public deductCost(mob: Mob): void {
        for (const cost of this.cost) {
            const item = cost[0];
            const count = cost[1];
            mob.inventory.removeItem(item, count);
        }
    }

    public setCraftTime(t: number): this {
        this.craftTime = t;
        return this;
    }
}
