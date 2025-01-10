import {Entity} from "../../entity";
import LevelTile from "../../level/LevelTile";
import Tile from "../../level/tile/Tile";
import Tiles, {TileRegister} from "../../level/tile/Tiles";
import Resource from "./Resource";
import FarmlandTile from "../../level/tile/FarmlandTile";

export default class FarmResource extends Resource {

    private readonly targetTile: typeof Tile;

    constructor(path: string, targetTile: TileRegister<typeof Tile>) {
        super(path);
        this.targetTile = targetTile.tile;
    }

    public useOn(levelTile: LevelTile, entity: Entity): boolean {
        if (levelTile.is(Tiles.FARMLAND)) {
            levelTile.setTile(this.targetTile, {
                moisture: (levelTile.tile as FarmlandTile).states.moisture,
            }, entity);
            return true;
        }
        return false;
    }
}
