import System from "../../core/System";
import {Mob} from "../../entity";
import Item from "../../item/Item";
import Items from "../../item/Items";
import AutoTilingTile from "./AutoTilingTile";
import Tiles from "./Tiles";
import ToolItem from "../../item/ToolItem";
import ToolType from "../../item/ToolType";
import DamageParticle from "../../entity/particle/DamageParticle";
import HurtParticle from "../../entity/particle/HurtParticle";
import * as PIXI from "pixi.js";

export default class RockTile extends AutoTilingTile {
    public static readonly COLOR: number = 0x888888;
    public static readonly TAG = "rock";
    protected static autoTileTextures = RockTile.loadMaskTextures(System.getResource("tile", "rock_mask.png"));
    private static tileTextures = RockTile.loadTextures(System.getResource("tile", "rock.png"), 3);
    private damage = 0;

    public init(): void {
        super.init();
        this.container.addChild(
            new PIXI.Sprite(RockTile.tileTextures[this.random.int(RockTile.tileTextures.length)]),
        );
        this.initAutoTile();
    }

    public mayPass(): boolean {
        return false;
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        if (item instanceof ToolItem) {
            const hurt = item.getAttackDamageBonus();
            switch (item.type) {
            case ToolType.PICKAXE:
                this.damage += hurt;
                this.levelTile.level.add(
                    new DamageParticle(this.levelTile.x + 8, this.levelTile.y + 8, -hurt, 0xc80000),
                );
                this.levelTile.level.add(new HurtParticle(this.levelTile.x + 8, this.levelTile.y + 8));
                if (this.damage >= 15) {
                    this.setTile(Tiles.DIRT);
                    this.addItemEntity(Items.STONE, 2);
                }
                return true;
            }
        }
    }

    public onTick(): void {
        super.onTick();
    }

}
