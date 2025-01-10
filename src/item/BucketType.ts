import * as PIXI from "pixi.js";
import System from "../core/System";
import Tiles, {TileRegister} from "../level/tile/Tiles";
import Tile from "../level/tile/Tile";

export default class BucketType {
    public static readonly EMPTY = new BucketType("empty", "bucket_empty.png");
    public static readonly LAVA = new BucketType("lava", "bucket_lava.png", Tiles.LAVA);
    public static readonly MILK = new BucketType("milk", "bucket_milk.png");
    public static readonly WATER = new BucketType("water", "bucket_water.png", Tiles.WATER);

    public readonly name: string;
    public readonly texture: PIXI.Texture;
    public readonly tile?: typeof Tile;

    private constructor(name: string, path: string, tile?: TileRegister<typeof Tile>) {
        this.name = name;
        this.texture = PIXI.Texture.from(System.getResource("items", path));
        this.tile = tile?.tile;
    }
}
