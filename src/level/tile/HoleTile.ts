import System from "../../core/System";
import Updater from "../../core/Updater";
import Entity from "../../entity/Entity";
import AutoTilingTile from "./AutoTilingTile";
import Tiles from "./Tiles";
import WaterTile from "./WaterTile";

export default class HoleTile extends AutoTilingTile {
    public static readonly COLOR: number = 0x402e29;
    public static readonly TAG = "hole";
    protected static autoTileTextures = HoleTile.loadMaskTextures(System.getResource("tile", "hole.png"));
    protected static canConnectTo = ["lava", "water"];

    public init(): void {
        super.init();
        this.initAutoTile();
    }

    public mayPass(e: Entity): boolean {
        return e.canSwim() || e.canFly();
    }

    public onTick(): void {
        super.onTick();

        if (Updater.every(10)) {
            const n = this.levelTile.getDirectNeighbourTiles(false);
            {
                const t = n.find((l) =>
                    !l.skipTick && l.instanceOf(Tiles.WATER.tile) && (l.tile as WaterTile).states.level > 0);
                if (t) {
                    this.setTile(Tiles.WATER, {level: (t.tile as WaterTile).states.level - 1});
                }
            }
            {
                const t = n.find((l) => !l.skipTick && l.instanceOf(Tiles.LAVA.tile))?.tile;
                if (t) {
                    this.setTile(Tiles.LAVA);
                }
            }
        }
    }

}
