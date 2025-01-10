import System from "../../core/System";
import Tiles from "./Tiles";
import TreeTile from "./TreeTile";

export default class SpruceTreeTile extends TreeTile {
    public static readonly COLOR: number = 0x108a4d;
    public static readonly TAG: string = "spruce";

    public onTick(): void {
        super.onTick();
    }

    public onUpdate(): void {
        super.onUpdate();
        const n = this.levelTile.getDirectNeighbourTiles(false);
        [Tiles.DIRT,Tiles.DARK_GRASS,Tiles.SNOW,Tiles.GRASS].forEach((t)=>{
            if (n.some((l) => !l.skipTick && l.instanceOf(t))) {
                this.setGroundTile(t);
            }
        });
    }

    protected initTree(): void {
        this.setGroundTile(Tiles.GRASS.tile);
        this.treeTilingInit(System.getResource("tile", "spruce.png"));
    }
}
