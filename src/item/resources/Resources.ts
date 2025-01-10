import Tiles from "../../level/tile/Tiles";
import FarmResource from "./FarmResource";
import Resource from "./Resource";
import TileResource from "./TileResource";

export default class Resources {

    public static readonly APPLE = new Resource("apple.png");

    public static readonly BREAD = new Resource("bread.png");

    public static readonly CACTUS_FLOWER = new TileResource("cactus_flower.png", Tiles.CACTUS,
        [Tiles.SAND]);

    public static readonly CAKE = new Resource("cake.png");

    public static readonly CARROT = new FarmResource("carrot.png", Tiles.CARROT);

    public static readonly COAL = new Resource("coal.png");

    public static readonly CORN = new FarmResource("corn.png", Tiles.CORN);

    public static readonly DIAMOND = new Resource("diamond.png");

    public static readonly DIRT = new TileResource("dirt.png", Tiles.DIRT,
        [Tiles.HOLE, Tiles.WATER, Tiles.LAVA]);

    public static readonly EGG = new Resource("egg.png");

    public static readonly FENCE = new TileResource("fence.png", Tiles.FENCE,
        [Tiles.GRASS, Tiles.DIRT, Tiles.SAND, Tiles.SNOW]);

    public static readonly FENCE_GATE = new TileResource("fenceGate.png", Tiles.FENCE_GATE,
        [Tiles.GRASS, Tiles.DIRT, Tiles.SAND, Tiles.SNOW]);

    public static readonly FISH = new Resource("fish_salmon_raw.png");

    public static readonly FLASK = new Resource("potion.png");

    public static readonly FLINT = new Resource("flint.png");

    public static readonly GLASS = new Resource("glass.png");

    public static readonly GOLD = new Resource("gold.png");

    public static readonly ICE = new TileResource("ice.png", Tiles.ICE,
        [Tiles.WATER]);

    public static readonly IRON = new Resource("iron.png");

    public static readonly LILYPAD = new TileResource("lilypad.png", Tiles.LILYPAD,
        [Tiles.WATER]);

    public static readonly POTATO = new FarmResource("potato.png", Tiles.POTATO);

    public static readonly RAIL = new TileResource("rail.png", Tiles.RAIL,
        [Tiles.GRASS, Tiles.DIRT, Tiles.SAND, Tiles.SNOW]);

    public static readonly SAND = new TileResource("sand.png", Tiles.SAND,
        [Tiles.HOLE, Tiles.WATER, Tiles.LAVA]);

    public static readonly SEED_WHEAT = new FarmResource("seeds_wheat.png", Tiles.WHEAT);

    public static readonly SNOWBALL = new Resource("snowball.png");

    public static readonly STICK = new Resource("stick.png");

    public static readonly STONE = new Resource("stone.png");
    public static readonly WHEAT = new Resource("wheat.png");

    public static readonly WOOD = new TileResource("wood.png", Tiles.PLANK,
        [Tiles.HOLE]);
}
