import * as PIXI from "pixi.js";
import FarmlandTile from "./FarmlandTile";
import {Entity} from "../../entity";

export default abstract class CropTile extends FarmlandTile {

    public static readonly TAG: string = "crop";
    protected sprite?: PIXI.Sprite;
    private wiggleDelay = 0;

    public init(): void {
        super.init();
        this.initCrop();
    }

    public onRender(): void {
        super.onRender();
    }

    public onTick(): void {
        super.onTick();
        if (this.growthRate(100)) {
            if (this.states.age < 50) {
                this.states.age++;
            }
        }

        if (this.sprite?.texture.valid) {
            this.sprite.texture.frame = new PIXI.Rectangle(~~(this.states.age / 50 * 4) * 16, 0, 16, 16);
        }

        if (this.wiggleDelay > 0) {
            this.wiggleDelay--;
            this.sprite.scale.set(
                1 + Math.sin(this.wiggleDelay) / 10,
                1 + Math.cos(this.wiggleDelay) / 10,
            );
        } else {
            this.sprite.scale.set(1, 1);
        }
    }

    public steppedOn(entity: Entity): void {
        this.wiggleDelay = 5;
    }

    protected harvest(): void {
    }

    protected initCrop(): void {
    }

}
