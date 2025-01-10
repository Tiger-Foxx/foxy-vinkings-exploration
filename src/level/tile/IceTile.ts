import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Mob} from "../../entity";
import Item from "../../item/Item";
import Items from "../../item/Items";
import AutoTilingTile from "./AutoTilingTile";
import Tiles from "./Tiles";

export default class IceTile extends AutoTilingTile {
    public static readonly COLOR: number = 0xaac9ff;
    public static readonly TAG = "ice";
    protected static autoTileTextures = IceTile.loadMaskTextures(System.getResource("tile", "water_mask.png"));
    protected static canConnectTo = ["hole"];
    public friction = 0.01;

    public init(): void {
        super.init();
        this.container.addChild(
            new PIXI.Sprite(PIXI.Texture.from(System.getResource("tile", "ice.png"))),
        );
        this.initAutoTile();
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        this.onDestroy();
        return true;
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.setTile(Tiles.WATER);
        this.addItemEntity(Items.ICE);
    }
}
