import * as PIXI from "pixi.js";
import Localization from "../../core/io/Localization";
import {ItemEntity, Mob} from "../../entity";
import Entity from "../../entity/Entity";
import Item from "../../item/Item";
import {ItemRegister} from "../../item/Items";
import Random from "../../utility/Random";
import LevelTile from "../LevelTile";
import TileStates from "./TileStates";
import Tiles, {TileRegister} from "./Tiles";
import Level from "../Level";

export default abstract class Tile {
    public static readonly COLOR: number = 0x123456;
    public static DEFAULT_STATES = {};
    public static readonly TAG: string = "tile";
    public ["constructor"]: typeof Tile;
    public anchor = 0;
    public container = new PIXI.Container();
    public friction = 0.1;
    public isInit = false;
    public light = 1;
    public offset = new PIXI.Point();
    public sortableContainer = new PIXI.Container();
    public states = TileStates.create();
    public z = 0;
    protected groundContainer = new PIXI.Container();
    protected groundTile?: Tile;
    protected levelTile: LevelTile;
    protected random: Random;
    private isMainTile = true;

    constructor(levelTile: LevelTile) {
        this.levelTile = levelTile;
        this.random = levelTile.random;
        this.container.addChild(this.groundContainer);
    }

    protected get level(): Level {
        return this.levelTile.level;
    }

    protected get x(): number {
        return this.levelTile.getLocalX();
    }

    protected get y(): number {
        return this.levelTile.getLocalY();
    }

    protected static loadTextures(path: string, nb: number): PIXI.Texture[] {
        const bt = PIXI.BaseTexture.from(path);
        const textures = [];
        for (let x = 0; x < nb; x++) {
            textures.push(new PIXI.Texture(bt, new PIXI.Rectangle(x * 16, 0, 16, 16)));
        }
        return textures;
    }

    public bumpedInto(entity: Entity): void {
    }

    public getClass(): typeof Tile {
        return Object.getPrototypeOf(this).constructor;
    }

    public getDisplayName(): string {
        return Localization.get(`tile.${this.constructor.TAG}`);
    }

    public getKeys(): { idx: number | undefined; tag: string | undefined } {
        return Tiles.getKeys(this.getClass());
    }

    public init(): void {
        this.isInit = true;
    }

    public instanceOf(...tileClass: Array<typeof Tile | TileRegister<typeof Tile> | Tile>): boolean {
        const ground = this.groundTile;
        return tileClass.some((t) => {
            const c = t instanceof TileRegister ? t.tile : t instanceof Tile ? t.getClass() : t;
            return this instanceof c || ground instanceof c;
        });
    }

    public mayPass(e: Entity): boolean {
        return true;
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        return false;
    }

    public onRender(): void {
        if (this.groundTile) {
            this.groundTile.onRender();
        }
    }

    public onSetTile(oldTile: Tile, entity?: Entity): void {
    }

    public onTick(): void {
        if (this.groundTile) {
            this.groundTile.onTick();
        }
    }

    public onUpdate(): void {
        if (this.groundTile) {
            this.groundTile.onUpdate();
        }
    }

    public setGroundTile(tile: typeof Tile | Tile | TileRegister<typeof Tile>): Tile | undefined {
        if (this.groundTile?.instanceOf(tile)) return undefined;
        // @ts-ignore
        this.groundTile = tile instanceof Tile ? tile : tile instanceof TileRegister ? new tile.tile(this.levelTile) : new tile(this.levelTile);
        this.groundTile.isMainTile = false;
        if (this.groundTile.light > this.light) this.light = this.groundTile.light;
        this.groundContainer.removeChildren();
        this.levelTile.update();
        this.groundTile.init();
        this.groundContainer.addChild(this.groundTile.container);
        return this.groundTile;
    }


    public setTile<T extends typeof Tile>(tile: T, states?: T["DEFAULT_STATES"], entity?: Entity): void;
    public setTile<T extends typeof Tile>(
        tile: TileRegister<T>, states?: T["DEFAULT_STATES"], entity?: Entity): void;
    public setTile<T extends typeof Tile>(tile: T | TileRegister<T>, states?: T["DEFAULT_STATES"], entity?: Entity): void {
        if (this.isMainTile) {
            // @ts-ignore
            this.levelTile.setTile(tile, states, entity);
        } else {
            this.setGroundTile(tile);
        }
    }

    public steppedOn(entity: Entity): void {
    }

    protected addItemEntity(item: Item | ItemRegister<Item>, nb: number | [number, number] = 1): void {
        const x = Array.isArray(nb) ? this.random.int(nb[0], nb[1]) : nb;
        if (x <= 0) return;
        for (let i = 0; i < x; i++) {
            this.level.add(
                new ItemEntity(item,
                    (this.x << 4) + Random.int(16),
                    (this.y << 4) + Random.int(16),
                ),
            );
        }
    }

    protected onDestroy(): void {

    }

    protected setTileToGround(): void {
        if (this.groundTile) this.setTile(this.groundTile.getClass());
    }
}
