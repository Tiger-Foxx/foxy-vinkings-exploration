import Recipe from "../../crafting/Recipe";
import {Mob, Furniture} from "../index";
import CraftingDisplay from "../../screen/CraftingDisplay";
import Item from "../../item/Item";
import Game from "../../core/Game";

export default abstract class Craftable extends Furniture {

    private craftRecipe?: Recipe;
    private craftTime = 0;
    private readonly recipes: Recipe[];

    protected constructor(recipes: Recipe[] = []) {
        super();
        this.recipes = recipes;
    }

    public isCrafting(): boolean {
        return (this.craftTime > 0);
    }

    public isDoneCrafting(): boolean {
        return this.craftTime === 0 && this.craftRecipe instanceof Recipe;
    }

    public onCraft(): void {
    }

    public onTick(): void {
        super.onTick();
        if (this.craft()) {
            this.onCraft();
        }
    }

    public onUse(mob: Mob, item?: Item): boolean {
        Game.GUI.setDisplay(new CraftingDisplay(this.recipes, mob));
        return true;
    }

    protected craft(): boolean {
        if (this.craftTime > 0) {
            this.craftTime--;
            return true;
        }
        return false;
    }
}
