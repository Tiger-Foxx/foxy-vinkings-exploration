import * as PIXI from "pixi.js";
import Tickable from "../Tickable";
import Random from "../../utility/Random";
import Vector3D from "../../utility/Vector3D";
import Level from "../../level/Level";
import Chunk from "../../level/Chunk";

export default class Particle extends PIXI.Container implements Tickable {
    private static random = new Random();
    public a: Vector3D = new Vector3D();
    public ticks = 0;
    public x = 0;
    public y = 0;
    public z = 0;
    protected deleted = false;
    protected gravity = 0;
    protected level?: Level;
    protected life = 0;
    protected lifeDuration = 5;
    protected random = Particle.random;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }

    public add(): void {
        this.level?.sortableContainer.addChild(this);
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
            this.destroy({children: true});
        }
    }

    public getChunk(): Chunk | undefined {
        return this.level?.getChunk(this.x >> 8, this.y >> 8);
    }

    public getLevel(): Level | undefined {
        return this.level;
    }

    public getRemoved(): boolean {
        return this.deleted;
    }

    public onRender(): void {
        this.x += this.a.x;
        this.y += this.a.y;
        this.z += this.a.z;
        this.pivot.y = this.z;
        this.zIndex = this.getZIndex();
    }

    public onTick(): void {
        if (this.life < this.lifeDuration) {
            ++this.life;
        } else {
            this.delete();
        }
    }

    public remove(): void {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    public setLevel(level: Level): void {
        this.level = level;
    }

    protected getZIndex(): number {
        return this.y + this.z;
    }

    protected lifePercent(): number {
        return this.life / this.lifeDuration;
    }
}
