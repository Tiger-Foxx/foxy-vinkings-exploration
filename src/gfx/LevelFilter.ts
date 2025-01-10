import * as PIXI from "pixi.js";
import Renderer from "../core/Renderer";

export default abstract class LevelFilter extends PIXI.Container {

    constructor() {
        super();
        this.init();
    }

    protected get cameraX(): number {
        return Renderer.camera.x * Renderer.camera.zoom;
    }

    protected get cameraY(): number {
        return Renderer.camera.y * Renderer.camera.zoom;
    }

    public onRender(): void {

    }

    protected init(): void {

    }
}
