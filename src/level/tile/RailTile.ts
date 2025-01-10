import * as PIXI from "pixi.js";
import Tile from "./Tile";
import SpriteSheet from "../../gfx/SpriteSheet";
import System from "../../core/System";
import {Mob, Entity} from "../../entity";
import TileStates from "./TileStates";
import Tiles from "./Tiles";

enum RailDirection {
    NS,
    EW,
    SE,
    SW,
    NE,
    NW,
}

export default class RailTile extends Tile {

    public static DEFAULT_STATES: { connected?: boolean; groundTile?: number; direction?: RailDirection } = {
        connected: false,
        direction: RailDirection.NS,
        groundTile: 0
    };
    public static readonly TAG = "rail";
    protected static textures = SpriteSheet.loadTextures(System.getResource("tile", "rail.png"), 6, 16);
    public states = TileStates.create(RailTile.DEFAULT_STATES);
    private sprite: PIXI.Sprite;

    public init(): void {
        super.init();
        this.sprite = new PIXI.Sprite();
        this.container.addChild(this.sprite);
        this.setGroundTile(Tiles.get(this.states.groundTile));
    }

    public onSetTile(oldTile: Tile, entity?: Entity): void {
        this.setGroundTile(oldTile);
        if (entity instanceof Mob) {
            this.states.direction = entity.getDir().isY() ? RailDirection.NS : RailDirection.EW;
        }
    }

    public onUpdate(): void {
        super.onUpdate();

        const test = (x: number, y: number) => {
            const t = this.levelTile.getRelativeTile(x, y, false);
            return t && t.instanceOf(RailTile) && !(t.tile as RailTile).states.connected;
        };
        const N = test(0, -1);
        const S = test(0, 1);
        const W = test(-1, 0);
        const E = test(1, 0);

        if (!this.states.connected &&
            this.states.direction === RailDirection.NS || this.states.direction === RailDirection.EW) {
            if (S && W) this.states.direction = RailDirection.SW;
            if (S && E) this.states.direction = RailDirection.SE;
            if (N && W) this.states.direction = RailDirection.NW;
            if (N && E) this.states.direction = RailDirection.NE;
        }
        this.states.connected = (S && N) || (E && W) || (S && W) || (S && E) || (N && W) || (N && E);
        this.sprite.texture = RailTile.textures[this.states.direction];
    }

    public setGroundTile(tile: typeof Tile | Tile): Tile | undefined {
        const t = super.setGroundTile(tile);
        if (!t) return undefined;
        this.states.groundTile = t.getKeys().idx;
        return t;
    }

}
