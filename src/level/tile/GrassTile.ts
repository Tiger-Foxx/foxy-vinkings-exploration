import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Mob} from "../../entity";
import Item from "../../item/Item";
import Items from "../../item/Items";
import ToolItem from "../../item/ToolItem";
import ToolType from "../../item/ToolType";
import Random from "../../utility/Random";
import AutoTilingTile from "./AutoTilingTile";
import Tiles from "./Tiles";

export default class GrassTile extends AutoTilingTile {
    public static readonly COLOR: number = 0x3abe41;
    public static readonly TAG = "grass";
    protected static autoTileTextures = GrassTile.loadMaskTextures(System.getResource("tile", "grass_mask.png"));
    private static tileTextures = GrassTile.loadTextures(System.getResource("tile", "grass.png"), 6);

    public init(): void {
        super.init();
        this.container.addChild(
            new PIXI.Sprite(GrassTile.tileTextures[this.random.int(GrassTile.tileTextures.length)]),
        );
        this.initAutoTile();
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        if (item instanceof ToolItem) {
            switch (item.type) {
            case ToolType.HOE:
                if (Random.probability(5)) {
                    this.addItemEntity(Items.SEED_WHEAT);
                }
                this.setTile(Tiles.FARMLAND);
                return true;
            case ToolType.SHOVEL:
                if (Random.probability(5)) {
                    this.addItemEntity(Items.SEED_WHEAT);
                }
                this.setTile(Tiles.DIRT);
                return true;
            }
        }
        return false;
    }

    public onTick(): void {
        super.onTick();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.setTile(Tiles.HOLE);
        this.addItemEntity(Items.DIRT);
    }
}
