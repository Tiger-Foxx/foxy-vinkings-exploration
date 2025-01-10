import * as PIXI from "pixi.js";
import uniqid from "uniqid";
import Renderer from "../core/Renderer";
import Updater from "../core/Updater";
import Chunk from "../level/Chunk";
import Level from "../level/Level";
import LevelTile from "../level/LevelTile";
import Tiles, {TileRegister} from "../level/tile/Tiles";
import Hitbox from "../utility/Hitbox";
import Maths from "../utility/Maths";
import Random from "../utility/Random";
import Vector3D from "../utility/Vector3D";
import Entities from "./Entities";
import Tickable from "./Tickable";
import SpriteSheet from "../gfx/SpriteSheet";
import System from "../core/System";
import Tile from "../level/tile/Tile";
import DustParticle from "./particle/DustParticle";
import WaterDropParticle from "./particle/WaterDropParticle";
import SmokeParticle from "./particle/SmokeParticle";

export default abstract class Entity extends PIXI.Container implements Tickable {
    protected static fireFrames = SpriteSheet.loadTextures(System.getResource("fire.png"), 32, 16);
    private static random = new Random();
    public ["constructor"]: typeof Entity;
    public a: Vector3D = new Vector3D();
    public hitbox: Hitbox = new Hitbox();
    public isInteractive = false;
    public offset = new PIXI.Point();
    public ticks = 0;
    public x = 0;
    public y = 0;
    public z = 0;
    protected container = new PIXI.Container();
    protected deleted = false;
    protected fireDelay: number;
    protected fireSprite: PIXI.AnimatedSprite;
    protected isMoving = false;
    protected isOnFire = false;
    protected level?: Level;
    protected random = this.constructor.random;
    private lastTick: number = Updater.ticks;
    private uid: string = uniqid();

    protected constructor() {
        super();
        this.fireSprite = new PIXI.AnimatedSprite(Entity.fireFrames);
        this.fireSprite.anchor.set(0.5);
        this.fireSprite.animationSpeed = 0.5;
        this.fireSprite.visible = false;

        this.fireSprite.play();

        this.hitbox.set(0, 4, 8, 8);
        this.addChild(this.container, this.hitbox);
        this.init();
        this.container.addChild(this.fireSprite);
    }

    protected get aSpeed(): number {
        return Math.hypot(this.a.x, this.a.y);
    }

    public static create({id, x, y}: { id: string, x: number, y: number }): Entity | undefined {
        const EntityClass = Entities.getByTag(id);
        if (!EntityClass) return;
        const e = new EntityClass();
        e.x = x;
        e.y = y;
        return e;
    }

    public add(): void {
        if (this.parent) this.parent.removeChild(this);
        this.level?.sortableContainer.addChild(this);
    }

    public blocks(entity: Entity): boolean {
        return false;
    }

    public canBurn(): boolean {
        return true;
    }

    public canFly(): boolean {
        return false;
    }

    public canSwim(): boolean {
        return false;
    }

    public collision(e: Entity, xa = 0, ya = 0): boolean {
        const aX0 = (this.x + xa) - this.hitbox.width * 0.5 + this.hitbox.x;
        const aY0 = (this.y + ya) - this.hitbox.height * 0.5 + this.hitbox.y;
        const aX1 = (this.x + xa) + this.hitbox.width * 0.5 + this.hitbox.x;
        const aY1 = (this.y + ya) + this.hitbox.height * 0.5 + this.hitbox.y;

        const bX0 = e.x - e.hitbox.width * 0.5 + e.hitbox.x;
        const bY0 = e.y - e.hitbox.height * 0.5 + e.hitbox.y;
        const bX1 = e.x + e.hitbox.width * 0.5 + e.hitbox.x;
        const bY1 = e.y + e.hitbox.height * 0.5 + e.hitbox.y;

        return !((bX0 >= aX1)
            || (bX1 <= aX0)
            || (bY0 >= aY1)
            || (bY1 <= aY0));
    }

    public delete(level?: Level): void {
        this.remove();
        if (level === undefined) {
            this.deleted = true;
            if (this.level instanceof Level) this.level.remove(this);
            return;
        }
        if (level === this.level) {
            this.deleted = true;
            this.level = undefined;
        }
    }

    public die(): void {
        this.delete();
    }

    public getChunk(): Chunk | undefined {
        return this.level?.getChunk(this.x >> 8, this.y >> 8);
    }

    public getChunkNeighbour(): Chunk[] {
        return this.level?.getChunkNeighbour(this.x >> 8, this.y >> 8) ?? [];
    }

    public getClass(): any {
        return Object.getPrototypeOf(this).constructor;
    }

    public getDistance(entity: Entity): number {
        return Math.hypot(this.x - entity.x, this.y - entity.y);
    }

    public getKeys(): { idx: number | undefined; tag: string | undefined } {
        return Entities.getKeys(this.getClass());
    }

    public getLevel(): Level | undefined {
        return this.level;
    }

    public getLightRadius(): number {
        return 0;
    }

    public getName(): string {
        return this.constructor.name;
    }

    public getRemoved(): boolean {
        return this.deleted;
    }

    public getTile(): LevelTile | undefined {
        const {x, y} = this.getCentredPos();
        return this.level?.getTile(x >> 4, y >> 4);
    }

    public isActive(): boolean {
        return (Updater.ticks - this.lastTick) < 50;
    }

    public isOnTile(...tileClass: Array<typeof Tile | TileRegister<typeof Tile>>): boolean {
        if (this.canFly() || this.z > this.getTileZ()) return false;
        return this.getTile()?.instanceOf(...tileClass);
    }

    public isSwimming(): boolean {
        return this.isOnTile(Tiles.LAVA, Tiles.WATER);
    }

    public onGround(): boolean {
        return this.z <= this.getTileZ();
    }

    public onRender(): void {
        this.z += this.a.z;
        if (this.z < this.getTileZ()) {
            if (this.a.z < -2) {
                // this.dust.set();
                if (this.isSwimming()) {
                    for (let i = 0; i < this.random.number(1, 4); ++i) {
                        this.level?.add(new WaterDropParticle(this.x, this.y + 4));
                    }
                } else {
                    for (let i = 0; i < this.random.number(2, 4); ++i) {
                        this.level?.add(new DustParticle(this.x, this.y + 4));
                    }
                }
            }
            this.z = this.getTileZ();
            this.a.z *= -0.5;
        }
        this.friction();
        if (Maths.abs(this.a.x) < 0.05) {
            this.a.x = 0;
        }
        if (Maths.abs(this.a.y) < 0.05) {
            this.a.y = 0;
        }
        this.a.z -= this.level?.gravity ?? 0.5;

        if (!(this.a.x === 0 && this.a.y === 0)) {
            this.move(this.a.x, this.a.y);
        }

        this.zIndex = this.calculateZIndex();
        this.container.position.copyFrom(this.offset);
        this.container.position.y += -this.z;

    }

    public onTick(): void {
        this.lastTick = Updater.ticks;
        this.ticks++;
        this.fireSprite.visible = this.isOnFire;
        if (this.isOnFire) {
            const tile = this.getTile();
            tile?.setLight(20);
            if (Updater.every(5)) {
                this.level?.add(new SmokeParticle(this.x, this.y - 4));
            }
            this.onFire();
            if (this.fireDelay++ > 200 || this.isOnTile(Tiles.WATER)) {
                this.setOnFire(false);
            }
        } else {
            if (this.isOnTile(Tiles.LAVA)) {
                this.setOnFire(true);
            }
        }
    }

    public remove(): void {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    public setLevel(level: Level, x: number, y: number): void {
        this.level = level;
        this.x = x;
        this.y = y;
    }

    public setOnFire(value: boolean): void {
        if (!value && this.isOnFire) {
            // fizz
        }
        this.isOnFire = value;
        this.fireDelay = 0;
    }

    public toBSON(): any {
        return {
            id: this.getKeys().tag,
            uid: this.uid,
            x: ~~this.x,
            y: ~~this.y,
        };
    }

    public toString(): string {
        return `${this.getName()}#${this.uid}`;
    }

    public touchedBy(entity: Entity): void {
        if (entity.isOnFire) {
            this.setOnFire(true);
        }
    }

    protected calculateZIndex(): number {
        return this.y + this.hitbox.y + this.hitbox.height / 2;
    }

    protected friction(): void {
        if (this.z <= this.getTileZ()) {
            const friction = this.getTile()?.getFriction() ?? 1;
            this.a.x -= this.a.x * friction;
            this.a.y -= this.a.y * friction;
        } else {
            this.a.x -= this.a.x * 0.01;
            this.a.y -= this.a.y * 0.01;
        }
    }

    protected getTileZ(): number {
        const tile = this.getTile();
        return tile?.z ?? 0;
    }

    protected init(): void {
    }

    protected move(xa: number, ya: number): boolean {
        xa *= Renderer.delta;
        ya *= Renderer.delta;
        let stopped = true;
        if (this.move2(xa, 0)) stopped = false;
        if (this.move2(0, ya)) stopped = false;
        if (!stopped) {
            this.isMoving = Math.hypot(xa, ya) > 0;
            if (this.isMoving) {
                this.steppedOn();
                return true;
            }
            return false;
        }
        return false;
    }

    protected move2(xa: number, ya: number): boolean {
        const xto0 = ((this.x) - this.hitbox.width * 0.5 + this.hitbox.x) >> 4;
        const yto0 = ((this.y) - this.hitbox.height * 0.5 + this.hitbox.y) >> 4;
        const xto1 = ((this.x) + this.hitbox.width * 0.5 + this.hitbox.x) >> 4;
        const yto1 = ((this.y) + this.hitbox.height * 0.5 + this.hitbox.y) >> 4;

        const xt0 = ((this.x + xa) - this.hitbox.width * 0.5 + this.hitbox.x) >> 4;
        const yt0 = ((this.y + ya) - this.hitbox.height * 0.5 + this.hitbox.y) >> 4;
        const xt1 = ((this.x + xa) + this.hitbox.width * 0.5 + this.hitbox.x) >> 4;
        const yt1 = ((this.y + ya) + this.hitbox.height * 0.5 + this.hitbox.y) >> 4;

        let blocked = false;
        for (let yt = yt0; yt <= yt1; yt++) {
            for (let xt = xt0; xt <= xt1; xt++) {
                if (xt >= xto0 && xt <= xto1 && yt >= yto0 && yt <= yto1) continue;
                const tile = this.level?.getTile(xt, yt);
                if (!tile) return false;
                tile.bumpedInto(this);

                if (this.getTile()?.mayPass(this) && !tile.mayPass(this)) {
                    blocked = true;
                    return false;
                }
                if (this.z < tile.z) {
                    blocked = true;
                    this.onTileTooHigh();
                    return false;
                }
            }
        }
        if (blocked) return false;
        const entities = this.getChunk()?.getEntities().filter((e) => e !== this && !e.deleted && e.blocks(this)) ?? [];
        for (const entity of entities) {
            if (!this.collision(entity) && this.collision(entity, xa, ya)) {
                entity.touchedBy(this);
                return false;
            }
        }
        this.x += xa;
        this.y += ya;
        return true;
    }

    protected onFire(): void {
    }

    protected onTileTooHigh(): void {
    }

    protected steppedOn(): void {
        if (this.z > this.getTileZ()) return;
        this.level?.getTile(this.x >> 4, this.y >> 4)?.steppedOn(this);
    }

    private getCentredPos(): { x: number; y: number } {
        return {
            x: this.x + this.hitbox.x,
            y: this.y + this.hitbox.y,
        };
    }
}
