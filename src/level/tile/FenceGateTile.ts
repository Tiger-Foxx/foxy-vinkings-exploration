import * as PIXI from "pixi.js";
import Tile from "./Tile";
import SpriteSheet from "../../gfx/SpriteSheet";
import System from "../../core/System";
import {Entity, Mob} from "../../entity";
import TileStates from "./TileStates";
import Tiles from "./Tiles";
import Item from "../../item/Item";
import ToolItem from "../../item/ToolItem";
import ToolType from "../../item/ToolType";
import Items from "../../item/Items";
import FenceTile from "./FenceTile";

export default class FenceGateTile extends Tile {
    public static DEFAULT_STATES: { groundTile?: number; open?: boolean } = {groundTile: 0, open: false};
    public static readonly TAG = "fence_gate";
    protected static textures = SpriteSheet.loadTextures(System.getResource("tile", "fence_gate.png"), 4, 16);
    public anchor = 0.75;
    public states = TileStates.create(FenceGateTile.DEFAULT_STATES);
    private sprite: PIXI.Sprite;

    public init(): void {
        super.init();
        this.sprite = new PIXI.Sprite(FenceGateTile.textures[0]);
        this.sprite.y = -4;
        this.sortableContainer.addChild(this.sprite);
        this.setGroundTile(Tiles.get(this.states.groundTile));
    }

    public mayPass(e: Entity): boolean {
        return this.states.open;
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        if (!item && !this.levelTile.hasEntity()) {
            this.states.open = !this.states.open;
            this.onUpdate();
            return true;
        }
        if (item instanceof ToolItem) {
            switch (item.type) {
            case ToolType.AXE:
                this.onDestroy();
                return true;
            }
        }
        return false;
    }

    public onSetTile(oldTile: Tile, entity?: Entity): void {
        this.setGroundTile(oldTile);
    }

    public onUpdate(): void {
        super.onUpdate();
        const test = (x: number, y: number) => {
            const t = this.levelTile.getRelativeTile(x, y, false);
            return t && t.instanceOf(FenceTile, FenceGateTile);
        };
        const N = test(0, -1) ? 1 : 0;
        const S = test(0, 1) ? 1 : 0;
        const W = test(-1, 0) ? 1 : 0;
        const E = test(1, 0) ? 1 : 0;
        let dir = false;
        if (N || S) dir = false;
        if (E || W) dir = true;
        if (N && S) dir = false;
        if (E && W) dir = true;
        const id = dir ? this.states.open ? 1 : 0 : this.states.open ? 3 : 2;
        this.sprite.texture = FenceGateTile.textures[id];
    }

    public setGroundTile(tile: typeof Tile | Tile): Tile | undefined {
        const t = super.setGroundTile(tile);
        if (!t) return undefined;
        this.states.groundTile = t.getKeys().idx;
        return t;
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.setTileToGround();
        this.addItemEntity(Items.FENCE_GATE);
    }

}
