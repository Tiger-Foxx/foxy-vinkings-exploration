import Localization from "../core/io/Localization";
import Item from "./Item";
import ResourceItem from "./ResourceItem";
import Resources from "./resources/Resources";
import Tiers from "./Tiers";
import ToolItem from "./ToolItem";
import ToolType from "./ToolType";
import FishingRodItem from "./FishingRodItem";
import FurnitureItem from "./FurnitureItem";
import {Chest, Camp, Bed, MusicPlayer, Oven, Furnace, Alembic, Anvil, Workbench} from "../entity";
import PotionItem from "./PotionItem";
import PotionType from "./PotionType";
import BucketItem from "./BucketItem";
import BucketType from "./BucketType";

type Type<T> = new (...args: any[]) => T;

export class ItemRegister<T extends Item> {

    private static items = new Map<string, ItemRegister<Item>>();
    public readonly args: any;
    public readonly itemClass: Type<T>;
    public readonly tag: string;

    protected constructor(tag: string, itemClass: Type<T>, ...args: unknown[]) {
        this.tag = tag;
        this.itemClass = itemClass;
        this.args = args;
        ItemRegister.items.set(tag, this);
        console.log(`adding ${itemClass.name} to item list with tag "${tag}"`);
    }

    public static get ALL(): Array<ItemRegister<Item>> {
        return Array.from(this.items.values());
    }

    public get item(): T {
        return new this.itemClass(this.tag, ...this.args);
    }

    public static add<T extends Item>(tag: string, itemClass: Type<T>, ...args: unknown[]): ItemRegister<T> {
        return new ItemRegister(tag, itemClass, ...args);
    }

    public static get(tag: string): ItemRegister<Item> | undefined {
        return this.items.get(tag);
    }

    public static verifyTag(): void {
        this.items.forEach((item) => {
            if (!Item.verifyTag(item.tag)) {
                console.warn(`'${item.tag}' didnt exist on ${Localization.getCurrent()?.getPath()}`);
            }
        });
    }

    public instanceOf(item: Item): boolean {
        if (!(item instanceof Item)) return false;
        return item.tag === this.tag;
    }
}

export default class Items extends ItemRegister<Item> {
    public static readonly ALEMBIC = Items.add("alembic", FurnitureItem, Alembic);
    public static readonly ANVIL = Items.add("anvil", FurnitureItem, Anvil);
    public static readonly APPLE = Items.add("apple", ResourceItem, Resources.APPLE);
    public static readonly BED = Items.add("bed", FurnitureItem, Bed);
    public static readonly BREAD = Items.add("bread", ResourceItem, Resources.BREAD);

    public static readonly BUCKET_EMPTY = Items.add("bucket_empty", BucketItem, BucketType.EMPTY);
    public static readonly BUCKET_LAVA = Items.add("bucket_lava", BucketItem, BucketType.LAVA);
    public static readonly BUCKET_MILK = Items.add("bucket_milk", BucketItem, BucketType.MILK);
    public static readonly BUCKET_WATER = Items.add("bucket_water", BucketItem, BucketType.WATER);
    public static readonly CACTUS_FLOWER = Items.add("cactus_flower", ResourceItem, Resources.CACTUS_FLOWER);
    public static readonly CAKE = Items.add("cake", ResourceItem, Resources.CAKE);
    public static readonly CAMP = Items.add("camp", FurnitureItem, Camp);
    public static readonly CARROT = Items.add("carrot", ResourceItem, Resources.CARROT);

    public static readonly CHEST = Items.add("chest", FurnitureItem, Chest);
    public static readonly COAL = Items.add("coal", ResourceItem, Resources.COAL);
    public static readonly CORN = Items.add("corn", ResourceItem, Resources.CORN);
    public static readonly DIAMOND = Items.add("diamond", ResourceItem, Resources.DIAMOND);

    public static readonly DIAMOND_AXE = Items.add("diamond_axe", ToolItem, ToolType.AXE, Tiers.DIAMOND);
    public static readonly DIAMOND_HOE = Items.add("diamond_hoe", ToolItem, ToolType.HOE, Tiers.DIAMOND);
    public static readonly DIAMOND_PICKAXE = Items.add("diamond_pickaxe", ToolItem, ToolType.PICKAXE, Tiers.DIAMOND);
    public static readonly DIAMOND_SHOVEL = Items.add("diamond_shovel", ToolItem, ToolType.SHOVEL, Tiers.DIAMOND);
    public static readonly DIAMOND_SWORD = Items.add("diamond_sword", ToolItem, ToolType.SWORD, Tiers.DIAMOND);
    public static readonly DIRT = Items.add("dirt", ResourceItem, Resources.DIRT);
    public static readonly EGG = Items.add("egg", ResourceItem, Resources.EGG);
    public static readonly FENCE = Items.add("fence", ResourceItem, Resources.FENCE);
    public static readonly FENCE_GATE = Items.add("fence_gate", ResourceItem, Resources.FENCE_GATE);
    public static readonly FISH = Items.add("fish", ResourceItem, Resources.FISH);

    public static readonly FISHING_ROD = Items.add("fishing_rod", FishingRodItem);

    public static readonly FLASK = Items.add("flask", ResourceItem, Resources.FLASK);
    public static readonly FLINT = Items.add("flint", ResourceItem, Resources.FLINT);
    public static readonly FURNACE = Items.add("furnace", FurnitureItem, Furnace);
    public static readonly GLASS = Items.add("glass", ResourceItem, Resources.GLASS);
    public static readonly GOLD = Items.add("gold", ResourceItem, Resources.GOLD);

    public static readonly GOLD_AXE = Items.add("gold_axe", ToolItem, ToolType.AXE, Tiers.GOLD);
    public static readonly GOLD_HOE = Items.add("gold_hoe", ToolItem, ToolType.HOE, Tiers.GOLD);
    public static readonly GOLD_PICKAXE = Items.add("gold_pickaxe", ToolItem, ToolType.PICKAXE, Tiers.GOLD);
    public static readonly GOLD_SHOVEL = Items.add("gold_shovel", ToolItem, ToolType.SHOVEL, Tiers.GOLD);
    public static readonly GOLD_SWORD = Items.add("gold_sword", ToolItem, ToolType.SWORD, Tiers.GOLD);
    public static readonly ICE = Items.add("ice", ResourceItem, Resources.ICE);
    public static readonly IRON = Items.add("iron", ResourceItem, Resources.IRON);

    public static readonly IRON_AXE = Items.add("iron_axe", ToolItem, ToolType.AXE, Tiers.IRON);
    public static readonly IRON_HOE = Items.add("iron_hoe", ToolItem, ToolType.HOE, Tiers.IRON);
    public static readonly IRON_PICKAXE = Items.add("iron_pickaxe", ToolItem, ToolType.PICKAXE, Tiers.IRON);
    public static readonly IRON_SHOVEL = Items.add("iron_shovel", ToolItem, ToolType.SHOVEL, Tiers.IRON);
    public static readonly IRON_SWORD = Items.add("iron_sword", ToolItem, ToolType.SWORD, Tiers.IRON);
    public static readonly LILYPAD = Items.add("lilypad", ResourceItem, Resources.LILYPAD);
    public static readonly MUSIC_PLAYER = Items.add("music_player", FurnitureItem, MusicPlayer);
    public static readonly OVEN = Items.add("oven", FurnitureItem, Oven);
    public static readonly POTATO = Items.add("potato", ResourceItem, Resources.POTATO);
    public static readonly POTION_HEAL = Items.add("potion_heal", PotionItem, PotionType.HEAL);
    public static readonly POTION_HUNGER = Items.add("potion_hunger", PotionItem, PotionType.HUNGER);
    public static readonly POTION_POWER = Items.add("potion_power", PotionItem, PotionType.POWER);
    public static readonly POTION_SLOW = Items.add("potion_slow", PotionItem, PotionType.SLOW);
    public static readonly POTION_SPEED = Items.add("potion_speed", PotionItem, PotionType.SPEED);
    public static readonly RAIL = Items.add("rail", ResourceItem, Resources.RAIL);

    public static readonly SAND = Items.add("sand", ResourceItem, Resources.SAND);
    public static readonly SEED_WHEAT = Items.add("seed_wheat", ResourceItem, Resources.SEED_WHEAT);

    public static readonly SNOWBALL = Items.add("snowball", ResourceItem, Resources.SNOWBALL);

    public static readonly STICK = Items.add("stick", ResourceItem, Resources.STICK);
    public static readonly STONE = Items.add("stone", ResourceItem, Resources.STONE);

    public static readonly STONE_AXE = Items.add("stone_axe", ToolItem, ToolType.AXE, Tiers.STONE);
    public static readonly STONE_HOE = Items.add("stone_hoe", ToolItem, ToolType.HOE, Tiers.STONE);
    public static readonly STONE_PICKAXE = Items.add("stone_pickaxe", ToolItem, ToolType.PICKAXE, Tiers.STONE);
    public static readonly STONE_SHOVEL = Items.add("stone_shovel", ToolItem, ToolType.SHOVEL, Tiers.STONE);
    public static readonly STONE_SWORD = Items.add("stone_sword", ToolItem, ToolType.SWORD, Tiers.STONE);

    public static readonly WHEAT = Items.add("wheat", ResourceItem, Resources.WHEAT);
    public static readonly WOOD = Items.add("wood", ResourceItem, Resources.WOOD);
    public static readonly WOOD_AXE = Items.add("wood_axe", ToolItem, ToolType.AXE, Tiers.WOOD);
    public static readonly WOOD_HOE = Items.add("wood_hoe", ToolItem, ToolType.HOE, Tiers.WOOD);
    public static readonly WOOD_PICKAXE = Items.add("wood_pickaxe", ToolItem, ToolType.PICKAXE, Tiers.WOOD);
    public static readonly WOOD_SHOVEL = Items.add("wood_shovel", ToolItem, ToolType.SHOVEL, Tiers.WOOD);
    public static readonly WOOD_SWORD = Items.add("wood_sword", ToolItem, ToolType.SWORD, Tiers.WOOD);
    public static readonly WORKBENCH = Items.add("workbench", FurnitureItem, Workbench);
}
