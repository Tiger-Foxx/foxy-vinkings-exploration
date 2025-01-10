import {Entity} from "../../entity";
import LevelTile from "../../level/LevelTile";
import Tile from "../../level/tile/Tile";
import {TileRegister} from "../../level/tile/Tiles";
import Resource from "./Resource";

export default class TileResource extends Resource {

    private readonly sourceTiles: Array<typeof Tile> = [];
    private readonly targetTile: typeof Tile;

    constructor(path: string, targetTile: TileRegister<typeof Tile>, sourceTiles: Array<TileRegister<typeof Tile>>) {
        super(path);
        this.targetTile = targetTile.tile;
        this.sourceTiles = sourceTiles.map((t) => t.tile);
    }

    public useOn(levelTile: LevelTile, entity: Entity): boolean {
        if (levelTile.is(...this.sourceTiles)) {
            levelTile.setTile(this.targetTile, {}, entity);
            return true;
        }
        return false;
    }
}
