import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Mob} from "../../entity";
import Entity from "../../entity/Entity";
import Item from "../../item/Item";
import Tile from "./Tile";
import Tiles from "./Tiles";
import ToolItem from "../../item/ToolItem";
import ToolType from "../../item/ToolType";
import DamageParticle from "../../entity/particle/DamageParticle";
import HurtParticle from "../../entity/particle/HurtParticle";
import Items from "../../item/Items";

export default class StoneTile extends Tile {
    public static readonly COLOR: number = 0x0cb516;
    public static readonly TAG = "stone";

    private static tileTextures = StoneTile.loadTextures(System.getResource("tile", "stone.png"), 5);
    private damage = 0;
    private sprite?: PIXI.Sprite;

    public init(): void {
        super.init();
        this.setGroundTile(Tiles.DIRT.tile);
        this.sprite = new PIXI.Sprite(StoneTile.tileTextures[this.random.int(StoneTile.tileTextures.length)]);
        this.sortableContainer.addChild(this.sprite);
    }

    public mayPass(e: Entity): boolean {
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
                if (this.damage >= 5) {
                    if (this.groundTile) {
                        this.setTileToGround();
                    } else {
                        this.setTile(Tiles.DIRT);
                    }
                    this.addItemEntity(Items.STONE, 2);
                    if (this.random.probability(40)) this.addItemEntity(Items.DIAMOND, 1);
                    if (this.random.probability(30)) this.addItemEntity(Items.GOLD, 1);
                    if (this.random.probability(20)) this.addItemEntity(Items.IRON, 1);
                    if (this.random.probability(10)) this.addItemEntity(Items.COAL, 3);
                }
                return true;
            }
        }
    }

    public onUpdate(): void {
        super.onUpdate();
        const n = this.levelTile.getDirectNeighbourTiles(false);
        [Tiles.DIRT, Tiles.GRASS, Tiles.SAND, Tiles.SNOW, Tiles.DARK_GRASS].forEach((tile) => {
            if (n.some((l) => !l.skipTick && l.instanceOf(tile.tile))) {
                this.setGroundTile(tile.tile);
            }
        });
    }
}
