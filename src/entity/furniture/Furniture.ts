import Entity from "../Entity";
import {Player, Mob} from "../index";
import Direction from "../Direction";
import Item from "../../item/Item";

export default abstract class Furniture extends Entity {
    public isInteractive = true;
    private pushDir: Direction = Direction.NONE;
    private pushTime = 0;

    constructor() {
        super();
        this.hitbox.set(0, 0, 14, 14);
    }

    public blocks(entity: Entity): boolean {
        return true;
    }

    public getSprite(): PIXI.DisplayObject {
        return this;
    }

    public onTick(): void {
        super.onTick();
        this.move(this.pushDir.getX(), this.pushDir.getY());
        this.pushDir = Direction.NONE;
        if (this.pushTime > 0) this.pushTime--;
    }

    public onUse(mob: Mob, item?: Item): boolean {
        return false;
    }

    public touchedBy(entity: Entity): void {
        if (entity instanceof Player && this.pushTime === 0) {
            this.pushDir = entity.getDir();
            this.pushTime = 10;
        }
    }
}
