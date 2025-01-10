import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Entity, Fish} from "../../entity/";
import Random from "../../utility/Random";
import AutoTilingTile from "./AutoTilingTile";
import TileStates from "./TileStates";

export default class WaterTile extends AutoTilingTile {
    public static readonly COLOR: number = 0x1e7cb8;
    public static DEFAULT_STATES: { level?: number } = {level: 10};
    public static readonly TAG = "water";
    protected static autoTileTextures = WaterTile.loadMaskTextures(System.getResource("tile", "water_mask.png"));
    protected static canConnectTo = ["lava", "hole", "ice"];
    protected static tileTextures = WaterTile.loadTextures(System.getResource("tile", "water.png"), 10);
    public friction = 0.01;
    public states = TileStates.create(WaterTile.DEFAULT_STATES);
    public z = -5;
    private animSprite?: PIXI.AnimatedSprite;

    public init(): void {
        super.init();
        this.animSprite = new PIXI.AnimatedSprite(WaterTile.tileTextures);
        this.animSprite.loop = false;
        this.animSprite.animationSpeed = 0.1;
        this.container.addChild(
            this.animSprite,
        );
        this.initAutoTile();
    }

    public mayPass(e: Entity): boolean {
        return e.canSwim() || e.canFly() || e.isSwimming();
    }

    public onTick(): void {
        super.onTick();
        if (this.animSprite && !this.animSprite.playing && Random.probability(1000)) {
            this.animSprite.gotoAndPlay(1);
        }
        if (Random.probability(100000)) {
            this.levelTile.level.add(new Fish(), this.levelTile.getLocalX(), this.levelTile.getLocalY(), true);
        }
    }

    public onUpdate(): void {
        super.onUpdate();
        let levelMax = 0;
        let nbNeighbour = 0;
        this.levelTile.getDirectNeighbourTiles(false).forEach((t) => {
            if (t.tile instanceof WaterTile) {
                nbNeighbour++;
                levelMax = Math.max(levelMax, t.tile.states.level);
            }
        });
        if (nbNeighbour > 0 && nbNeighbour < 4) levelMax--;
        this.states.level = levelMax;
    }


}
