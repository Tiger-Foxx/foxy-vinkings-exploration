import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Mob} from "../../entity";
import Entity from "../../entity/Entity";
import Item from "../../item/Item";
import Tile from "./Tile";
import Tiles from "./Tiles";
import TileStates from "./TileStates";
import Random from "../../utility/Random";

export default class SugarCaneTile extends Tile {
    public static readonly COLOR: number = 0x0cb516;
    public static readonly TAG = "sugar_cane";
    public static DEFAULT_STATES: { age?: number } = {age: 0};
    private static tileTextures = SugarCaneTile.loadTextures(System.getResource("tile", "sugar_cane.png"), 4);
    public states = TileStates.create(SugarCaneTile.DEFAULT_STATES);
    private sprite?: PIXI.Sprite;

    public init(): void {
        super.init();
        this.groundTile = new (Tiles.WATER.tile)(this.levelTile);
        this.container.addChild(this.groundTile.container);
        this.groundTile.init();
        this.sprite = new PIXI.Sprite(SugarCaneTile.tileTextures[this.random.int(SugarCaneTile.tileTextures.length)]);
        this.sortableContainer.addChild(this.sprite);
    }

    public mayPass(e: Entity): boolean {
        return false;
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        this.onDestroy();
        return true;
    }

    public onTick(): void {
        super.onTick();

        if (Random.probability(100)) {
            if (this.states.age < 50) {
                this.states.age++;
                this.updateSprite();
            }
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.setTile(Tiles.WATER);
    }

    private updateSprite() {
        const i = ~~(this.states.age / 50 * 4);
        this.sprite.texture = SugarCaneTile.tileTextures[i];
    }
}
