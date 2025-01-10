import System from "../../core/System";
import Tiles from "./Tiles";
import TreeTile from "./TreeTile";

export default class SwampTreeTile extends TreeTile {
    public static readonly COLOR: number = 0x108a4d;
    public static readonly TAG: string = "swamp_tree";

    public onTick(): void {
        super.onTick();
    }

    public onUpdate(): void {
        super.onUpdate();
        const n = this.levelTile.getDirectNeighbourTiles(false);
        [Tiles.DIRT,Tiles.DARK_GRASS,Tiles.WATER,Tiles.GRASS].forEach((t)=>{
            if (n.some((l) => !l.skipTick && l.instanceOf(t))) {
                this.setGroundTile(t);
            }
        });
    }

    protected initTree(): void {
        this.setGroundTile(Tiles.DARK_GRASS.tile);
        this.treeTilingInit(System.getResource("tile", "swamp_tree.png"));
    }
}
