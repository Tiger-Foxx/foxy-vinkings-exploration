import Items from "../item/Items";
import Recipe from "./Recipe";

export default class Crafting {
    public static alembicRecipes: Recipe[] = [];
    public static allRecipes: Recipe[] = [];
    public static anvilRecipes: Recipe[] = [];
    public static furnaceRecipes: Recipe[] = [];
    public static handRecipes: Recipe[] = [];
    public static ovenRecipes: Recipe[] = [];
    public static workbenchRecipes: Recipe[] = [];

    public static initRecipes(): void {
        this.handRecipes = [
            new Recipe(Items.FISHING_ROD)
                .addCost(Items.STICK, 3),
            new Recipe(Items.CHEST)
                .addCost(Items.WOOD, 8),
            new Recipe(Items.BED)
                .addCost(Items.WOOD, 8),
            new Recipe(Items.OVEN)
                .addCost(Items.WOOD, 8),
            new Recipe(Items.FURNACE)
                .addCost(Items.WOOD, 8),
            new Recipe(Items.CAMP)
                .addCost(Items.WOOD, 4)
                .addCost(Items.STICK, 8),
            new Recipe(Items.MUSIC_PLAYER)
                .addCost(Items.WOOD, 8),
        ];

        this.workbenchRecipes = [
            new Recipe(Items.WOOD_SHOVEL)
                .addCost(Items.STICK, 3)
                .addCost(Items.WOOD, 1),
            new Recipe(Items.WOOD_HOE)
                .addCost(Items.STICK, 3)
                .addCost(Items.WOOD, 2),
            new Recipe(Items.WOOD_SWORD)
                .addCost(Items.STICK, 3)
                .addCost(Items.WOOD, 2),
            new Recipe(Items.WOOD_AXE)
                .addCost(Items.STICK, 3)
                .addCost(Items.WOOD, 3),
            new Recipe(Items.WOOD_PICKAXE)
                .addCost(Items.STICK, 3)
                .addCost(Items.WOOD, 3),

            new Recipe(Items.STONE_SHOVEL)
                .addCost(Items.STICK, 3)
                .addCost(Items.WOOD, 1),
            new Recipe(Items.STONE_HOE)
                .addCost(Items.STICK, 3)
                .addCost(Items.STONE, 2),
            new Recipe(Items.STONE_SWORD)
                .addCost(Items.STICK, 3)
                .addCost(Items.STONE, 2),
            new Recipe(Items.STONE_AXE)
                .addCost(Items.STICK, 3)
                .addCost(Items.STONE, 3),
            new Recipe(Items.STONE_PICKAXE)
                .addCost(Items.STICK, 3)
                .addCost(Items.STONE, 3),
        ];

        this.anvilRecipes = [
            new Recipe(Items.IRON_SHOVEL)
                .addCost(Items.STICK, 3)
                .addCost(Items.IRON, 1),
            new Recipe(Items.IRON_HOE)
                .addCost(Items.STICK, 3)
                .addCost(Items.IRON, 2),
            new Recipe(Items.IRON_SWORD)
                .addCost(Items.STICK, 3)
                .addCost(Items.IRON, 2),
            new Recipe(Items.IRON_AXE)
                .addCost(Items.STICK, 3)
                .addCost(Items.IRON, 3),
            new Recipe(Items.IRON_PICKAXE)
                .addCost(Items.STICK, 3)
                .addCost(Items.IRON, 3),

            new Recipe(Items.GOLD_SHOVEL)
                .addCost(Items.STICK, 3)
                .addCost(Items.GOLD, 1),
            new Recipe(Items.GOLD_HOE)
                .addCost(Items.STICK, 3)
                .addCost(Items.GOLD, 2),
            new Recipe(Items.GOLD_SWORD)
                .addCost(Items.STICK, 3)
                .addCost(Items.GOLD, 2),
            new Recipe(Items.GOLD_AXE)
                .addCost(Items.STICK, 3)
                .addCost(Items.GOLD, 3),
            new Recipe(Items.GOLD_PICKAXE)
                .addCost(Items.STICK, 3)
                .addCost(Items.GOLD, 3),

            new Recipe(Items.DIAMOND_SHOVEL)
                .addCost(Items.STICK, 3)
                .addCost(Items.DIAMOND, 1),
            new Recipe(Items.DIAMOND_HOE)
                .addCost(Items.STICK, 3)
                .addCost(Items.DIAMOND, 2),
            new Recipe(Items.DIAMOND_SWORD)
                .addCost(Items.STICK, 3)
                .addCost(Items.DIAMOND, 2),
            new Recipe(Items.DIAMOND_AXE)
                .addCost(Items.STICK, 3)
                .addCost(Items.DIAMOND, 3),
            new Recipe(Items.DIAMOND_PICKAXE)
                .addCost(Items.STICK, 3)
                .addCost(Items.DIAMOND, 3),
        ];

        this.ovenRecipes = [
            new Recipe(Items.BREAD)
                .addCost(Items.WHEAT, 3),
            new Recipe(Items.CAKE)
                .addCost(Items.WHEAT, 3)
                .addCost(Items.EGG, 3)
                .addCost(Items.BUCKET_MILK, 1),
        ];

        this.furnaceRecipes = [
            new Recipe(Items.GLASS)
                .addCost(Items.SAND, 1),
            new Recipe(Items.COAL)
                .addCost(Items.WOOD, 1),
        ];

        this.alembicRecipes = [
            new Recipe(Items.POTION_HEAL)
                .addCost(Items.FLASK, 1),
            new Recipe(Items.POTION_HUNGER)
                .addCost(Items.FLASK, 1),
            new Recipe(Items.POTION_POWER)
                .addCost(Items.FLASK, 1),
            new Recipe(Items.POTION_SLOW)
                .addCost(Items.FLASK, 1),
            new Recipe(Items.POTION_SPEED)
                .addCost(Items.FLASK, 1),
        ];

        this.allRecipes = Items.ALL.map((item) => new Recipe(item));
    }
}
