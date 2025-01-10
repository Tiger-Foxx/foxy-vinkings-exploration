import * as PIXI from "pixi.js";
import Renderer from "../core/Renderer";
import Updater from "../core/Updater";
import Entity from "../entity/Entity";

export default class Camera {

    private containers: PIXI.Container[] = [];
    private cx = 0;
    private cy = 0;
    private follow?: { x: number; y: number; };
    private fx = 0;
    private fy = 0;

    constructor() {
    }

    private _zoom = 6;

    public get zoom(): number {
        return this._zoom;
    }

    public set zoom(value: number) {
        if (value < 0.5) {
            value = 0.5;
        }
        this._zoom = value;
    }

    public get x(): number {
        return (this.cx);
    }

    public get y(): number {
        return (this.cy);
    }

    public setContainer(...containers: PIXI.Container[]): void {
        this.containers = containers;
    }

    public setFollow(obj: Entity): void {
        this.follow = obj;
    }

    public setPos(x: number, y: number): void {
        this.fx = x;
        this.fy = y;
        this.follow = undefined;
    }

    public update(): void {
        this.move();
        this.containers.forEach((container) => {
            container.position.set(Renderer.getScreen().width >> 1, Renderer.getScreen().height >> 1);
            container.pivot.set(this.x, this.y);
            container.scale.set(this.zoom);
        });
    }

    private move() {
        if (this.follow instanceof Entity) {
            if ("x" in this.follow && "y" in this.follow) {
                this.fx = this.follow.x;
                this.fy = this.follow.y;
            }
        }
        const dX = this.cx - this.fx;
        const dY = this.cy - this.fy;
        const dist = Math.hypot(dX, dY);
        if (dist <= 0) {
            return;
        }
        let angle;
        if (dY < 0) {
            angle = Math.acos(dX / dist);
        } else {
            angle = Math.PI + Math.acos(-dX / dist);
        }
        const d = (Math.hypot((this.fx - this.cx), (this.fy - this.cy)));

        // console.log(d);
        const speed = d / (30 / this.zoom) * Updater.delta;

        this.cx += -speed * Math.cos(angle);
        this.cy += speed * Math.sin(angle);
    }
}
