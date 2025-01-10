import * as PIXI from "pixi.js";
import Renderer from "../core/Renderer";
import System from "../core/System";
import Updater from "../core/Updater";
import {Entity, Player, Zombie} from "../entity/";
import Random from "../utility/Random";
import Chunk from "./Chunk";
import LevelGen from "./levelGen/LevelGen";
import LevelTile from "./LevelTile";
import Tile from "./tile/Tile";
import rimraf from "rimraf";
import Tickable from "../entity/Tickable";
import Weather from "../gfx/weather/Weather";
import LightFilter from "../gfx/LightFilter";
import Game from "../core/Game";
import LevelGenOverworld from "./levelGen/LevelGenOverworld";
import * as events from "events";
import {TileRegister} from "./tile/Tiles";
import Time from "../core/Time";

export default class Level {
    public container: PIXI.Container = new PIXI.Container();
    public gravity = 0.4;
    public groundContainer: PIXI.Container = new PIXI.Container();
    public levelGen: LevelGen;
    public lightFilter: LightFilter;
    public readonly seed: number;
    public sortableContainer: PIXI.Container = new PIXI.Container();
    public weather?: Weather;
    private chunks = new Map<string, Chunk>();
    private chunksToRemove: string[] = [];
    private eventEmitter = new events.EventEmitter();
    private loadedChunks: Chunk[] = [];
    private players: Player[] = [];
    private tickablesToAdd: Tickable[] = [];
    private tickablesToRemove: Tickable[] = [];

    constructor(seed: number, generator: typeof LevelGen = LevelGenOverworld) {
        this.seed = seed;
        // @ts-ignore
        this.levelGen = new generator(this.seed);
        this.sortableContainer.sortableChildren = true;
        this.container.addChild(this.groundContainer, this.sortableContainer);
        this.lightFilter = new LightFilter(this);
        // this.weather = new RainWeather();
    }

    public add(tickable?: Tickable, x?: number, y?: number, tileCoords = false): boolean {
        if (!tickable) return false;
        if (x === undefined || y === undefined) {
            x = tickable.x;
            y = tickable.y;
        }
        if (tileCoords) {
            x = (x << 4) + 8;
            y = (y << 4) + 8;
        }
        tickable.setLevel(this, x, y);
        this.tickablesToRemove = this.tickablesToRemove.filter((item) => item !== tickable);
        if (!this.tickablesToAdd.includes(tickable)) {
            this.tickablesToAdd.push(tickable);
            return true;
        }
        return false;
    }

    public deleteChunk(chunk: Chunk): void {
        this.chunksToRemove.push(chunk.x + ":" + chunk.y);
    }

    public deleteTempDir(): void {
        rimraf.sync(System.getAppData("tmp"));
    }

    public findEntities(predicate: (value: Entity) => boolean): Promise<Entity[]> {
        const chunksId = Array.from(this.chunks.keys());
        const result: Array<Promise<Entity[]>> = [];
        return new Promise((resolve) => {
            const action = () => {
                const chunk = this.chunks.get(chunksId.shift() ?? "");
                if (chunk) result.push(chunk.findEntities(predicate));
                if (chunksId.length > 0) return process.nextTick(action);
                Promise.all(result).then((value) => {
                    resolve(value.flat());
                });
            };
            process.nextTick(action);
        });
    }

    public findEntitiesInRadius(
        predicate: (value: Entity) => boolean,
        x: number,
        y: number,
        radius: number,
    ): Promise<Entity[]> {
        const result: Array<Promise<Entity[]>> = [];
        const chunks: Chunk[] = [];
        for (let cx = (x - radius) >> 4; cx <= (x + radius) >> 4; cx++) {
            for (let cy = (y - radius) >> 4; cy <= (y + radius) >> 4; cy++) {
                const chunk = this.getChunk(cx, cy, false);
                if (chunk) chunks.push(chunk);
            }
        }
        return new Promise((resolve) => {
            const action = () => {
                const chunk = chunks.shift();
                if (chunk) {
                    result.push(
                        chunk.findEntities(
                            (e) => predicate(e) && Math.hypot((e.x >> 4) - x, (e.y >> 4) - y) < radius,
                        ),
                    );
                }
                if (chunks.length > 0) return process.nextTick(action);
                Promise.all(result).then((value) => {
                    resolve(value.flat());
                });
            };
            process.nextTick(action);
        });
    }

    public findEntity<T extends Entity>(
        entityClass: new (...args: any) => T, predicate?: (value: T) => boolean): Promise<T> {
        const chunksId = Array.from(this.chunks.keys());
        return new Promise((resolve) => {
            const action = () => {
                this.chunks.get(chunksId.shift() ?? "")?.findEntity(entityClass, predicate)
                    .then((entity) => resolve(entity as T));
                if (chunksId.length > 0) process.nextTick(action);
            };
            process.nextTick(action);
        });
    }

    public findRandomTileInEntityRadius(
        tiles: Array<TileRegister<typeof Tile>>,
        entity: Entity,
        radiusEnd: number,
        radiusStart = 0,
    ): LevelTile | false {
        if (!(entity instanceof Entity) || radiusStart >= radiusEnd) {
            return false;
        }

        const i = performance.now();
        while (true) {
            const rx = Random.int(radiusEnd * 2) - radiusEnd;
            const ry = Random.int(radiusEnd * 2) - radiusEnd;
            if (Math.abs(rx) < radiusStart || Math.abs(ry) < radiusStart) {
                continue;
            }
            const x = (entity.x >> 4) + rx;
            const y = (entity.y >> 4) + ry;

            const lt = this.getTile(x, y, false);
            if (lt) {
                if (lt.instanceOf(...tiles)) {
                    return lt;
                }
            }

            if ((performance.now() - i) > 5) {
                return false;
            }
        }
    }

    public flushChunks(): Promise<number> {
        this.chunksToRemove.push(...this.chunks.keys());
        return new Promise((resolve) => {
            this.eventEmitter.once("deleteQueuedChunk", resolve);
        });
    }

    public flushInactiveChunks(): Promise<number> {
        this.chunks.forEach((chunk) => {
            if (!chunk.isActive()) {
                this.deleteChunk(chunk);
            }
        });
        return new Promise((resolve) => {
            this.eventEmitter.once("deleteQueuedChunk", resolve);
        });
    }

    public getAmbientLightLevel(): number {
        const ease = (x: number) => x * x * (3 - 2 * x);
        if (this.levelGen instanceof LevelGenOverworld) {
            const r = Updater.time.ratio();
            switch (Updater.time) {
            case Time.MORNING:
                return ease(r) * 20;
            case Time.DAY:
                return 20;
            case Time.EVENING:
                return (1 - ease(r)) * 20;
            case Time.NIGHT:
                return 0;
            }
        } else {
            return 0;
        }
    }

    public getChunk(x: number, y: number, generate = true): Chunk | undefined {
        x = ~~x;
        y = ~~y;
        const id = x + ":" + y;
        if (!this.chunks.has(id)) {
            if (!generate) return undefined;
            const chunk = Chunk.empty(this, x, y);
            Chunk.fileExist(this, x, y)
                .then(() => {
                    return chunk.fromFile().catch((e) => console.error(e));
                })
                .catch(() => chunk.generate());
            this.chunks.set(id, chunk);
        }
        return this.chunks.get(id);
    }

    public getChunkNeighbour(x: number, y: number): Chunk[] {
        x = ~~x;
        y = ~~y;
        const chunks = [];
        for (let i = x - 1; i < x + 1; i++) {
            for (let j = y - 1; j < y + 1; j++) {
                const chunk = this.getChunk(i, j);
                if (chunk) chunks.push(chunk);
            }
        }
        return chunks;
    }

    public getChunks(): Chunk[] {
        return Array.from(this.chunks.values());
    }

    public getChunksRadius(r = 1): Chunk[] {
        const chunks = [];
        for (let x = -r; x < r; x++) {
            for (let y = -r; y < r; y++) {
                const chunk = this.getChunk(
                    x + ((Renderer.camera.x + 16 * 8) >> 8),
                    y + ((Renderer.camera.y + 16 * 8) >> 8));
                if (chunk && chunk.isGenerated() && chunk.isActive()) {
                    chunks.push(chunk);
                }
            }
        }
        return chunks;
    }

    public getChunksVisible(): Chunk[] {
        const s = Chunk.SIZE * LevelTile.SIZE;
        let {width, height} = Renderer.getScreen();
        width /= Renderer.camera.zoom;
        height /= Renderer.camera.zoom;
        const {x, y} = Renderer.camera;
        const x1 = Math.floor((x - width / 2) / s);
        const x2 = Math.ceil((x + width / 2) / s);
        const y1 = Math.floor((y - height / 2) / s);
        const y2 = Math.ceil((y + height / 2) / s);
        const chunks = [];
        for (let cx = x1; cx < x2; cx++) {
            for (let cy = y1; cy < y2; cy++) {
                const chunk = this.getChunk(cx, cy);
                if (chunk && chunk.isGenerated() && chunk.isActive()) {
                    chunks.push(chunk);
                }
            }
        }
        return chunks;
    }

    public getNbChunks(): number {
        return this.chunks.size;
    }

    public getTile(x: number, y: number, generate = true): LevelTile | undefined {
        const chunk = this.getChunk(x >> 4, y >> 4, generate);
        if (!chunk) return undefined;
        return chunk.getTile(((x % 16) + 16) % 16, ((y % 16) + 16) % 16);
    }

    public onRender(): void {
        if (!this.players[0]) return;
        this.weather?.onRender();
        this.lightFilter?.onRender();
        Renderer.camera.setFollow(Game.player);

        this.loadedChunks.forEach((chunk) => chunk.onRender());
    }

    public onTick(): void {
        if (Updater.every(50)) {
            this.flushInactiveChunks();
        }
        this.deleteQueuedChunk();
        const chunks = this.getChunksVisible();
        chunks.forEach((chunk) => {
            if (!this.loadedChunks.includes(chunk)) {
                chunk.load();
            }
            chunk.onTick();
        });
        this.loadedChunks.forEach((c) => {
            if (!chunks.includes(c)) {
                c.unload();
            }
        });
        this.loadedChunks = chunks;

        while (this.tickablesToAdd.length > 0) {
            const tickable: Tickable = this.tickablesToAdd[0];
            this.tickablesToAdd = this.tickablesToAdd.filter((item) => item !== tickable);
            if (!tickable) continue;
            tickable.getChunk()?.add(tickable);
            if (tickable instanceof Player && !this.players.includes(tickable)) {
                this.players.push(tickable as Player);
                Game.player = tickable;
            }
        }

        while (this.tickablesToRemove.length > 0) {
            const tickable: Tickable = this.tickablesToRemove[0];
            this.tickablesToRemove = this.tickablesToRemove.filter((item) => item !== tickable);
            if (!tickable) continue;
            tickable.getChunk()?.remove(tickable);
            tickable.delete(this);
            if (tickable instanceof Player) {
                this.players = this.players.filter((item) => item !== tickable);
            }
        }
        this.trySpawn();
    }

    public remove(t: Tickable): void {
        this.tickablesToAdd = this.tickablesToAdd.filter((item) => item !== t);
        if (!this.tickablesToRemove.includes(t)) {
            this.tickablesToRemove.push(t);
        }
    }

    public save(): Promise<void[]> {
        return Promise.all(Array.from(this.chunks).map(([id, chunk]) => chunk.save()));
    }

    public toString(): string {
        return "Level";
    }

    private async deleteQueuedChunk(): Promise<void> {
        let nb = 0;
        while (this.chunksToRemove.length > 0) {
            const chunkId = this.chunksToRemove[0];
            const chunk = this.chunks.get(chunkId);
            if (chunk) {
                await chunk.save();
                chunk.destroy();
                nb++;
            }
            this.chunks.delete(chunkId);
            this.chunksToRemove.splice(0, 1);
        }
        this.eventEmitter.emit("deleteQueuedChunk", nb);
    }

    private trySpawn(): void {
        const player = this.players[~~(Random.float() * this.players.length)];
        const radius = Random.int(8, 80);
        const angle = Random.number(Math.PI * 2);
        const x = (player.x >> 4) + ~~(radius * Math.cos(angle));
        const y = (player.y >> 4) + ~~(radius * Math.sin(angle));
        const tile = this.getTile(x, y, false);
        if (!tile) return;
        if (Zombie.spawnCondition(tile)) {
            this.add(new Zombie(), x, y, true);
        }
    }
}
