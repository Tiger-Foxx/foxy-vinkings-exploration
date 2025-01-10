import * as PIXI from "pixi.js";
import System from "../../core/System";
import Entity from "../../entity/Entity";
import Random from "../../utility/Random";
import AutoTilingTile from "./AutoTilingTile";
import Tiles from "./Tiles";
import TileStates from "./TileStates";

export default class LavaTile extends AutoTilingTile {
    public static readonly COLOR: number = 0xc83000;
    public static DEFAULT_STATES: { level?: number } = {level: 10};
    public static readonly TAG = "lava";
    protected static autoTileTextures = LavaTile.loadMaskTextures(System.getResource("tile", "lava_mask.png"));
    protected static canConnectTo = ["hole", "water"];
    private static tileTextures = LavaTile.loadTextures(System.getResource("tile", "lava.png"), 6);
    public light = 19;
    public states = TileStates.create(LavaTile.DEFAULT_STATES);
    public z = -5;
    private animSprite?: PIXI.AnimatedSprite;

    public init(): void {
        super.init();
        this.animSprite = new PIXI.AnimatedSprite(LavaTile.tileTextures);
        this.animSprite.animationSpeed = 0.1;
        this.container.addChild(
            this.animSprite,
        );
        this.initAutoTile();
    }

    public mayPass(e: Entity): boolean {
        return e.canSwim() || e.canFly();
    }

    public onTick(): void {
        super.onTick();
        if (this.animSprite && !this.animSprite.playing && Random.probability(1000)) {
            this.animSprite.gotoAndPlay(1);
        }
    }

    public onUpdate(): void {
        super.onUpdate();
        if (this.levelTile.getDirectNeighbourTiles(false).some((l) => l.instanceOf(Tiles.WATER.tile))) {
            this.setTile(Tiles.ROCK);
        }
    }

}
