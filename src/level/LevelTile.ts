import * as PIXI from "pixi.js";
import Entity from "../entity/Entity";
import TileRandom from "../utility/TileRandom";
import Biome from "./biome/Biome";
import Level from "./Level";
import Tile from "./tile/Tile";
import {TileRegister} from "./tile/Tiles";
import Light from "../gfx/Light";
import Renderer from "../core/Renderer";
import {Mob} from "../entity";
import Item from "../item/Item";
import Chunk from "./Chunk";
import {StateType} from "./tile/TileStates";

interface LevelTileConstructor {
    biome: Biome;
    elevation: number;
    level: Level;
    moisture: number;
    temperature: number;
    tileClass?: typeof Tile;
    tileStates?: StateType;
    x: number;
    y: number;
}

export default class LevelTile {
    public static SIZE = 16;
    public biome: Biome;
    public readonly elevation: number;
    public level: Level;
    public readonly light = new Light();
    public readonly moisture: number;
    public random: TileRandom = new TileRandom(this);
    public skipTick = false;
    public readonly temperature: number;
    protected lightLevel = 0;
    private groundContainer = new PIXI.Container();
    private initByEntity?: Entity;
    private isInitiated = false;
    private needToUpdate = true;
    private sortableContainer = new PIXI.Container();
    private tileClass?: typeof Tile;
    private tileStates?: StateType;
    private visible: boolean;

    constructor({level, x, y, biome, temperature, elevation, moisture, tileClass, tileStates}: LevelTileConstructor) {
        this.biome = biome;
        this.temperature = temperature;
        this.elevation = elevation;
        this.moisture = moisture;
        this.x = x << 4;
        this.y = y << 4;
        this.level = level;
        this.tileClass = tileClass;
        this.tileStates = tileStates;
    }

    private _tile?: Tile;

    get tile(): Tile | undefined {
        return this._tile;
    }

    private _x: number;

    public get x(): number {
        return this._x;
    }

    public set x(value: number) {
        this._x = value;
        this.groundContainer.x = this._x;
        this.sortableContainer.x = this._x;
        this.light.x = this._x;
        this.sort();
    }

    private _y: number;

    public get y(): number {
        return this._y;
    }

    public set y(value: number) {
        this._y = value;
        this.groundContainer.y = this._y;
        this.sortableContainer.y = this._y;
        this.light.y = this._y;
        this.sort();
    }

    public get z(): number {
        return this.tile?.z ?? 0;
    }

    public add(): void {
        if (!this.level) {
            return;
        }
        this.level.groundContainer.addChild(this.groundContainer);
        this.level.sortableContainer.addChild(this.sortableContainer);
        this.level.lightFilter.lightContainer.addChild(this.light);
    }

    public bumpedInto(entity: Entity): void {
        return this._tile?.bumpedInto(entity);
    }

    public destroy(): void {
        this.groundContainer.destroy({children: true});
        this.sortableContainer.destroy({children: true});
        this.light.destroy({children: true});
    }

    public findTileRadius(radius: number, ...tiles: Array<typeof Tile>): boolean {
        for (let x = -radius; x < radius; x++) {
            const height = ~~(Math.sqrt(radius * radius - x * x));
            for (let y = -height; y < height; y++) {
                const lt = this.getRelativeTile(x, y, false);
                if (lt && lt.instanceOf(...tiles)) return true;
            }
        }
        return false;
    }

    public getChunk(generate = true): Chunk | undefined {
        return this.level.getChunk(this.getLocalX() >> 4, this.getLocalY() >> 4, generate);
    }

    public getColor(): number {
        return this.tileClass?.COLOR ?? 0;
    }

    public getDirectNeighbourTiles(generate = true): LevelTile[] {
        const lt = [];
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (Math.abs(i) === Math.abs(j)) {
                    continue;
                }
                const t = this.getRelativeTile(i, j, generate);
                if (t) {
                    lt.push(t);
                }
            }
        }
        return lt;
    }

    public getFriction(): number {
        return this._tile?.friction ?? 1;
    }

    public getLightLevel(): number {
        const l = Math.round((this.lightLevel + this.level.getAmbientLightLevel()));
        return l > 20 ? 20 : l;
    }

    public getLocalX = (): number => this._x >> 4;

    public getLocalY = (): number => this._y >> 4;

    public getNeighbourTiles(radius = 1, generate = true): LevelTile[] {
        const lt = [];
        const x = this.getLocalX();
        const y = this.getLocalY();
        for (let i = x - radius; i <= x + radius; i++) {
            for (let j = y - radius; j <= y + radius; j++) {
                if (i === x && j === y) {
                    continue;
                }
                const t = this.level.getTile(i, j, generate);
                if (t) {
                    lt.push(t);
                }
            }
        }
        return lt;
    }

    public getRelativeTile(x: number, y: number, generate = true): LevelTile | undefined {
        if (x === 0 && y === 0) return this;
        return this.level.getTile(this.getLocalX() + x, this.getLocalY() + y, generate);
    }

    public getTileClass(): typeof Tile {
        return this.tileClass;
    }

    public hasEntity(): boolean {
        return this.getChunk()?.getEntities().some((e) => e.getTile() === this);
    }

    public init(): void {
        const oldTile = this._tile;
        // @ts-ignore
        this._tile = new this.tileClass(this);
        this._tile.states.set(this.tileStates);
        process.nextTick(() => {
            this.isInitiated = true;
            this.groundContainer.removeChildren();
            this.sortableContainer.removeChildren();

            if (this._tile) {
                this._tile.init();
                this.sort();
                if (this.initByEntity || oldTile) {
                    this._tile.onSetTile(oldTile, this.initByEntity);
                    this.initByEntity = undefined;
                }
                this.groundContainer.addChild(this._tile.container);
                this.sortableContainer.addChild(this._tile.sortableContainer);
            }
            this.update();
        });
    }

    public instanceOf(...tileClass: Array<typeof Tile | TileRegister<typeof Tile>>): boolean {
        return this._tile?.instanceOf(...tileClass);
    }

    public is(...tileClasses: Array<typeof Tile | TileRegister<typeof Tile>>): boolean {
        return tileClasses.some((tileClass) =>
            this._tile?.getClass() === ((tileClass instanceof TileRegister) ? tileClass.getClass() : tileClass));
    }

    public mayPass(entity: Entity): boolean {
        return this._tile?.mayPass(entity);
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        if (!this._tile) return false;
        return this._tile.onInteract(mob, item);
    }

    public onRender(): void {
        this.checkOnScreen();
        if (!this.isInitiated) {
            this.init();
        }
        if (this._tile?.isInit) {
            this._tile.onRender();
        }
        this.light.setBrightness(this.lightLevel / 20);
    }

    public onTick(): void {
        if (!this.isInitiated) {
            this.init();
        }
        if (this.skipTick) {
            this.skipTick = false;
            return;
        }
        if (this.needToUpdate) {
            this.needToUpdate = false;
            this.onUpdate();
        }
        if (this._tile?.isInit) {
            this._tile?.onTick();
        }
        this.updateLight();
    }

    public onUpdate(): void {
        if (this._tile?.isInit) {
            this._tile?.onUpdate();
        }
    }

    public remove(): void {
        if (this.groundContainer.parent) this.groundContainer.parent.removeChild(this.groundContainer);
        if (this.sortableContainer.parent) this.sortableContainer.parent.removeChild(this.sortableContainer);
        if (this.light.parent) this.light.parent.removeChild(this.light);
    }

    public setLight(value: number): void {
        if (value > this.lightLevel) {
            this.lightLevel = value;
        }
    }

    public setTile<T extends typeof Tile>(tile: T, states?: T["DEFAULT_STATES"], entity?: Entity): void;

    public setTile<T extends typeof Tile>(
        tile: TileRegister<T>, states?: T["DEFAULT_STATES"], entity?: Entity): void;

    public setTile<T extends typeof Tile>(tile: T | TileRegister<T>, states?: T["DEFAULT_STATES"], entity?: Entity): void {
        this.isInitiated = false;
        this.skipTick = true;
        this.tileClass = (tile instanceof TileRegister) ? tile.tile : tile;
        this.tileStates = states;
        this.initByEntity = entity;
    }

    public setVisible(value: boolean): void {
        this.visible = value;
        this.groundContainer.visible = this.visible;
        this.sortableContainer.visible = this.visible;
        this.light.visible = this.visible;
    }

    public steppedOn(entity: Entity): void {
        this._tile?.steppedOn(entity);
    }

    public update(): void {
        this.needToUpdate = true;
        this.getNeighbourTiles(1, false).forEach((levelTile) => {
            levelTile.needToUpdate = true;
        });
    }

    public updateLight(): void {
        if (!this.visible) return;
        let lightLevel = this._tile?.light;
        if (!lightLevel || lightLevel === 0) return;
        this.lightLevel -= 1;
        if (this.lightLevel > lightLevel) lightLevel = this.lightLevel;
        const radius = Math.round(Math.sqrt(lightLevel * 2));
        for (let x = -radius; x < radius; x++) {
            for (let y = -radius; y < radius; y++) {
                const tile = this.getRelativeTile(x, y);
                if (!tile || !tile._tile) continue;
                const value = (lightLevel * (1 - Math.hypot(x, y) / radius));
                if (value > tile.lightLevel) {
                    tile.lightLevel = value;
                }
            }
        }
    }

    private checkOnScreen(): void {
        const p = this.groundContainer.getGlobalPosition();
        const screen = Renderer.getScreen();
        const s = LevelTile.SIZE * Renderer.camera.zoom;
        const m = s;
        this.setVisible(!(p.x < -s - m || p.x > screen.width + m || p.y < -s - m || p.y > screen.height + m));
    }

    private sort(): void {
        if (!this._tile) return;
        this.sortableContainer.zIndex = this._y + LevelTile.SIZE * this._tile.anchor + this._tile.offset.y;
    }
}
