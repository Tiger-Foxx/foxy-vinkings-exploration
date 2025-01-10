import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Mob} from "../../entity";
import Entity from "../../entity/Entity";
import Item from "../../item/Item";
import Tile from "./Tile";
import Tiles from "./Tiles";
import Renderer from "../../core/Renderer";

export default class BushTile extends Tile {
    public static readonly COLOR: number = 0x94785c;
    public static readonly TAG = "bush";
    public anchor = 0.9;

    private sprite?: PIXI.Sprite;
    private wiggleDelay = 0;

    public init(): void {
        super.init();
        this.groundTile = new (Tiles.GRASS.tile)(this.levelTile);
        this.container.addChild(this.groundTile.container);
        this.groundTile.init();
        const texture = PIXI.BaseTexture.from(System.getResource("tile", "bush.png"));
        this.sprite = new PIXI.Sprite(new PIXI.Texture(texture, new PIXI.Rectangle(0, 0, 16, 16)));
        const shadow = new PIXI.Sprite(new PIXI.Texture(texture, new PIXI.Rectangle(16, 0, 16, 16)));
        this.sprite.anchor.set(0.5);
        this.sprite.position.set(8, 8);
        this.sortableContainer.addChild(this.sprite);
        this.container.addChild(shadow);
    }

    public mayPass(e: Entity): boolean {
        return true;
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        this.setTile(Tiles.GRASS);
        return true;
    }

    public onTick(): void {
        super.onTick();
        if (this.wiggleDelay > 0) {
            this.wiggleDelay--;
            this.sprite.rotation = Math.sin(Renderer.ticks / 3) / 10;
            this.sprite.scale.set(
                1 + Math.sin(this.wiggleDelay) / 20,
                1 + Math.cos(this.wiggleDelay) / 20,
            );
        } else {
            this.sprite.rotation = 0;
            this.sprite.scale.set(1, 1);
        }
    }

    public steppedOn(entity: Entity): void {
        this.wiggleDelay = 5;
    }
}
