import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Mob} from "../../entity";
import Entity from "../../entity/Entity";
import Item from "../../item/Item";
import Items from "../../item/Items";
import Tile from "./Tile";
import Tiles from "./Tiles";
import Renderer from "../../core/Renderer";

export default class LilyPadTile extends Tile {
    public static readonly COLOR: number = 0x0cb516;
    public static readonly TAG = "lilypad";

    private static tileTextures = LilyPadTile.loadTextures(System.getResource("tile", "lilypad.png"), 4);
    private sprite?: PIXI.Sprite;

    public init(): void {
        super.init();
        this.groundTile = new (Tiles.WATER.tile)(this.levelTile);
        this.container.addChild(this.groundTile.container);
        this.groundTile.init();
        this.sprite = new PIXI.Sprite(LilyPadTile.tileTextures[this.random.int(LilyPadTile.tileTextures.length)]);
        this.sortableContainer.addChild(this.sprite);
    }

    public mayPass(e: Entity): boolean {
        return true;
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        this.onDestroy();
        return true;
    }

    public onRender(): void {
        super.onRender();
        this.sprite?.pivot.set(0, Math.sin(Renderer.ticks / 6) / 4);
    }

    public onTick(): void {
        super.onTick();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.setTile(Tiles.WATER);
        this.addItemEntity(Items.LILYPAD);
    }
}
