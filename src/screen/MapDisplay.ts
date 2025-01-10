import * as PIXI from "pixi.js";
import Display from "./Display";
import System from "../core/System";
import Renderer from "../core/Renderer";
import Game from "../core/Game";
import Color from "../utility/Color";

export default class MapDisplay extends Display {
    public hasCommand = true;
    private background: PIXI.Sprite;
    private container: PIXI.Container;
    private map: PIXI.Sprite;
    private marker: PIXI.Sprite;

    constructor() {
        super();
        this.init();
    }

    public onCommand(): void {
        super.onCommand();
        if (Game.input.getKey("EXIT").clicked) this.hide();
    }

    public onRender(): void {
        super.onRender();
        let x = (Game.player.x >> 4) * (96 / 128);
        let y = (Game.player.y >> 4) * (96 / 128);
        if (y < 0) y = 0;
        if (y > 96) y = 96;
        if (x < 0) x = 0;
        if (x > 96) x = 96;
        this.marker.position.set(x, y);
    }

    public onResize(): void {
        super.onResize();
        this.background.width = Renderer.getScreen().width;
        this.background.height = Renderer.getScreen().height;
        this.container.position.set(
            (Renderer.getScreen().width - this.container.width) / 2,
            (Renderer.getScreen().height - this.container.height) / 2,
        );
    }

    private drawMap(size = 128): void {
        const canvas = new OffscreenCanvas(size, size);
        const ctx = canvas.getContext("2d");
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const setPixel = (x: number, y: number, color: number) => {
            if (x < 0 || y < 0 || y > size || x > size) return;
            const i = (y * size + x) * 4;
            const c = Color.fromNumber(color);
            imageData.data[i] = c.r;
            imageData.data[i + 1] = c.g;
            imageData.data[i + 2] = c.b;
            imageData.data[i + 3] = 255;
        };
        const t = size >> 4;
        for (let xO = 0; xO < t; ++xO) {
            for (let yO = 0; yO < t; ++yO) {
                Game.level.levelGen.genChunk(xO, yO).forEach((lt) =>
                    setPixel(lt.x >> 4, lt.y >> 4, lt.getColor()));
            }
        }
        ctx.putImageData(imageData, 0, 0);
        this.map.texture = PIXI.Texture.from(canvas as unknown as HTMLCanvasElement);
    }

    private init(): void {
        this.container = new PIXI.Container();
        const baseTexture = PIXI.BaseTexture.from(System.getResource("screen", "map.png"));
        const sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 112, 112)));
        this.marker = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(112, 8, 8, 8)));
        this.marker.anchor.set(0.5);
        this.marker.pivot.set(-8, -8);
        this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.map = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.map.width = 96;
        this.map.height = 96;
        this.map.position.set(8, 8);
        this.background.tint = 0x000000;
        this.background.alpha = 0.75;
        this.container.addChild(sprite, this.map, this.marker);
        this.container.scale.set(4);
        this.addChild(this.background, this.container);
        this.drawMap();
        this.onResize();
    }
}
