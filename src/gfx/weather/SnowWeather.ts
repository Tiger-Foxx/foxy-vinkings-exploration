import Weather from "./Weather";
import * as PIXI from "pixi.js";
import System from "../../core/System";
import Renderer from "../../core/Renderer";

export default class SnowWeather extends Weather {
    private layers: PIXI.TilingSprite[];
    private offset: PIXI.Point;
    private tint: PIXI.Sprite;

    public onRender(): void {
        super.onRender();
        const x = this.cameraX;
        const y = this.cameraY;
        this.offset.y += Renderer.camera.zoom;
        this.offset.x = Math.sin(Renderer.ticks / 40) * (Renderer.camera.zoom * 25);
        for (const layer of this.layers) {
            layer.width = Renderer.getScreen().width;
            layer.height = Renderer.getScreen().height;
            layer.tilePosition.y = -y + this.offset.y / layer.zIndex;
            layer.tilePosition.x = -x + this.offset.x / layer.zIndex;
            layer.tileScale.set(Renderer.camera.zoom / layer.zIndex);
        }
    }

    protected init(): void {
        super.init();
        const texture = PIXI.Texture.from(System.getResource("weather", "snow.png"));
        this.layers = [
            new PIXI.TilingSprite(texture),
            new PIXI.TilingSprite(texture),
            new PIXI.TilingSprite(texture),
        ];
        this.tint = new PIXI.Sprite(PIXI.Texture.WHITE);

        this.layers[0].zIndex = 1;
        this.layers[1].zIndex = 1.5;
        this.layers[2].zIndex = 2;
        this.offset = new PIXI.Point();
        this.tint.width = Renderer.getScreen().width;
        this.tint.height = Renderer.getScreen().height;
        this.tint.blendMode = PIXI.BLEND_MODES.OVERLAY;
        this.tint.alpha = 0.3;
        this.tint.tint = 0x7dabff;
        this.addChild(this.tint, ...this.layers);
    }
}
