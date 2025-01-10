import System from "../../core/System";
import {Mob} from "../../entity";
import Item from "../../item/Item";
import Items from "../../item/Items";
import ToolItem from "../../item/ToolItem";
import ToolType from "../../item/ToolType";
import Random from "../../utility/Random";
import AutoTilingTile from "./AutoTilingTile";
import Tiles from "./Tiles";

export default class DarkGrassTile extends AutoTilingTile {
    public static readonly COLOR: number = 0x35a541;
    public static readonly TAG = "grass";
    protected static autoTileTextures = DarkGrassTile.loadMaskTextures(
        System.getResource("tile", "dark_grass_mask.png"),
    );

    public init(): void {
        super.init();
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

}
