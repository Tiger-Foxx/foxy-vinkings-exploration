import Item from "./Item";
import Mob from "../entity/mob/Mob";
import LevelTile from "../level/LevelTile";
import BucketType from "./BucketType";
import Tiles from "../level/tile/Tiles";

export default class BucketItem extends Item {

    private content: BucketType;

    constructor(tag: string, content = BucketType.EMPTY) {
        super(tag);
        this.setContent(content);
    }

    public static create({tag}: { tag: string }): BucketItem {
        return super.create({tag}) as BucketItem;
    }

    public canAttack(): boolean {
        return true;
    }

    public isStackable(): boolean {
        return false;
    }

    public toBSON(): any {
        return {
            ...super.toBSON(),
        };
    }

    public useOn(levelTile: LevelTile, mob: Mob): boolean {
        if (this.content === BucketType.EMPTY) {
            if (levelTile.is(BucketType.WATER.tile)) {
                this.setContent(BucketType.WATER);
                levelTile.setTile(Tiles.HOLE);
            } else if (levelTile.is(BucketType.LAVA.tile)) {
                this.setContent(BucketType.LAVA);
                levelTile.setTile(Tiles.HOLE);
            }
        } else {
            if (levelTile.is(Tiles.HOLE) && this.content.tile) {
                levelTile.setTile(this.content.tile);
                this.setContent(BucketType.EMPTY);
            }
        }
        return false;
    }

    private setContent(content = BucketType.EMPTY): void {
        this.content = content;
        this.texture = content.texture;
    }

}
