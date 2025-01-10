import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Mob} from "../../entity";
import Item from "../../item/Item";
import Items from "../../item/Items";
import ToolItem from "../../item/ToolItem";
import ToolType from "../../item/ToolType";
import Random from "../../utility/Random";
import Tile from "./Tile";
import Tiles from "./Tiles";

export default class DirtTile extends Tile {
    public static readonly COLOR: number = 0x94785c;
    public static readonly TAG = "dirt";
    private static tileTextures = DirtTile.loadTextures(System.getResource("tile", "dirt.png"), 4);

    public init(): void {
        super.init();
        this.container.addChild(
            new PIXI.Sprite(DirtTile.tileTextures[this.random.int(DirtTile.tileTextures.length)]),
        );
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        if (item instanceof ToolItem) {
            switch (item.type) {
            case ToolType.HOE:
                this.setTile(Tiles.FARMLAND);
                return true;
            case ToolType.SHOVEL:
                this.addItemEntity(Items.DIRT);
                this.setTile(Tiles.HOLE);
                return true;
            }
        }
        return false;
    }

    public onTick(): void {
        super.onTick();
        if (this.levelTile.biome.is("grassland") && Random.probability(500)) {
            const n = this.levelTile.getDirectNeighbourTiles(false);
            if (n.some((l) => !l.skipTick && l.instanceOf(Tiles.GRASS.tile))) {
                this.setTile(Tiles.GRASS);
            }
            if (n.some((l) => !l.skipTick && l.instanceOf(Tiles.SAND.tile))) {
                this.setTile(Tiles.SAND);
            }
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.setTile(Tiles.HOLE);
        this.addItemEntity(Items.DIRT);
    }

}
