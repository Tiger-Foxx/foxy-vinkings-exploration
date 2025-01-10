import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Entity, Mob} from "../../entity";
import Item from "../../item/Item";
import Tile from "./Tile";
import Tiles from "./Tiles";
import Items from "../../item/Items";
import HurtParticle from "../../entity/particle/HurtParticle";

/**
 * @TODO Damage
 */
export default class CactusTile extends Tile {
    public static readonly COLOR: number = 0x2a963c;
    public static readonly TAG = "cactus";
    private static tileTexture = PIXI.Texture.from(System.getResource("tile", "cactus.png"));
    private damage = 0;

    public bumpedInto(entity: Entity): void {
        if (entity instanceof Mob) {
            entity.hurt(1);
        }
    }

    public init(): void {
        super.init();
        this.groundTile = new (Tiles.SAND.tile)(this.levelTile);
        this.container.addChild(this.groundTile.container);
        this.groundTile.init();
        const sprite = new PIXI.Sprite(CactusTile.tileTexture);
        sprite.anchor.set(0, 1);
        sprite.position.y = 16;
        this.sortableContainer.addChild(sprite);
    }

    public mayPass(): boolean {
        return false;
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        this.setTileToGround();
        this.levelTile.level.add(new HurtParticle(this.levelTile.x + 8, this.levelTile.y + 8));
        this.addItemEntity(Items.CACTUS_FLOWER);
        return true;
    }
}
