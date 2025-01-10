import Level from "../level/Level";
import Chunk from "../level/Chunk";
import * as PIXI from "pixi.js";

export default interface Tickable extends PIXI.Container {
    ticks: number;
    x: number;
    y: number;
    z: number;

    add(): void;

    delete(level?: Level): void;

    getChunk(): Chunk | undefined;

    getLevel(): Level | undefined;

    getRemoved(): boolean;

    onRender(): void;

    onTick(): void;

    remove(): void;

    setLevel(level: Level, x: number, y: number): void;
}
