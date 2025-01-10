import System from "../../core/System";
import Tiles from "./Tiles";
import TreeTile from "./TreeTile";

export default class AcaciaTreeTile extends TreeTile {
    public static readonly COLOR: number = 0x969e41;
    public static readonly TAG: string = "acacia";

    protected initTree(): void {
        this.setGroundTile(Tiles.DIRT.tile);
        this.treeTilingInit(System.getResource("tile", "acacia.png"));
    }
}
