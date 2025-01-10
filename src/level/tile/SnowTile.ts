import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Mob} from "../../entity";
import Entity from "../../entity/Entity";
import Item from "../../item/Item";
import Items from "../../item/Items";
import ToolItem from "../../item/ToolItem";
import ToolType from "../../item/ToolType";
import AutoTilingTile from "./AutoTilingTile";
import Tiles from "./Tiles";

export default class SnowTile extends AutoTilingTile {
    public static readonly COLOR: number = 0xf0f0ff;
    public static readonly TAG = "snow";
    protected static autoTileTextures = SnowTile.loadMaskTextures(System.getResource("tile", "snow.png"));
    public friction = 0.25;
    public light = 3;
    private footprintSprite?: PIXI.Sprite;

    private step = 0;
    private stepDir = false;

    public init(): void {
        super.init();
        this.initAutoTile();
        const baseTexture = PIXI.BaseTexture.from(System.getResource("tile", "snow_footprint.png"));
        this.footprintSprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 16, 16)));
        this.footprintSprite.visible = false;
        this.container.addChild(this.footprintSprite);
    }

    public mayPass(): boolean {
        return true;
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        if (item instanceof ToolItem) {
            switch (item.type) {
            case ToolType.SHOVEL:
                this.onDestroy();
                return true;
            }
        }
        return false;
    }

    public onTick(): void {
        super.onTick();
        if (this.step > 0) {
            this.step--;
        }
        if (this.footprintSprite) {
            if (this.footprintSprite.texture.valid) {
                this.footprintSprite.texture.frame = new PIXI.Rectangle(this.stepDir ? 16 : 0, 0, 16, 16);
            }
            this.footprintSprite.visible = this.step > 0;
        }
    }

    public steppedOn(entity: Entity): void {
        if (this.step < 550 && entity instanceof Mob) {
            this.step = 600;
            this.stepDir = entity.getDir().isX();
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.addItemEntity(Items.SNOWBALL, [1, 3]);
        this.setTile(Tiles.DIRT);
    }

}
