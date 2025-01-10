import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Mob} from "../../entity";
import Entity from "../../entity/Entity";
import Item from "../../item/Item";
import Tile from "./Tile";
import Tiles from "./Tiles";

export default class MushroomTile extends Tile {
    public static readonly COLOR: number = 0x0cb516;
    public static readonly TAG = "mushroom";
    private static tileTextures = MushroomTile.loadTextures(System.getResource("tile", "mushroom.png"), 3);
    public light = 10;
    private sprite?: PIXI.Sprite;

    public init(): void {
        super.init();
        this.setGroundTile(Tiles.DIRT.tile);
        this.sprite = new PIXI.Sprite(MushroomTile.tileTextures[this.random.int(MushroomTile.tileTextures.length)]);
        this.sortableContainer.addChild(this.sprite);
    }

    public mayPass(e: Entity): boolean {
        return true;
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        this.onDestroy();
        return true;
    }

    public onUpdate(): void {
        super.onUpdate();
        const n = this.levelTile.getDirectNeighbourTiles(false);
        [Tiles.DIRT, Tiles.GRASS].forEach((tile) => {
            if (n.some((l) => !l.skipTick && l.instanceOf(tile.tile))) {
                this.setGroundTile(tile.tile);
            }
        });
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.setTileToGround();
    }
}
