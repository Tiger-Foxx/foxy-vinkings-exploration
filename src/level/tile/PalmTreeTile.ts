import System from "../../core/System";
import Tiles from "./Tiles";
import TreeTile from "./TreeTile";

export default class PalmTreeTile extends TreeTile {
    public static readonly COLOR: number = 0x94785c;
    public static readonly TAG: string = "palm";

    protected initTree(): void {
        this.setGroundTile(Tiles.SAND.tile);
        this.treeTilingInit(System.getResource("tile", "palm.png"));
    }

}
