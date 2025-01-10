import * as PIXI from "pixi.js";
import System from "../core/System";
import Display from "./Display";
import Texture = PIXI.Texture;

export default class BackgroundDisplay extends Display {

    constructor() {
        super();
        const container = new PIXI.Container();
        const baseTexture = PIXI.BaseTexture.from(System.getResource("gui_window.png"));
        this.addChild(container);
        baseTexture.once("loaded", () => {
            const w = baseTexture.width / 3;
            const h = baseTexture.height / 3;
            const textures = [];
            for (let y = 0; y < 3; y++) {
                for (let x = 0; x < 3; x++) {
                    textures.push(new Texture(baseTexture, new PIXI.Rectangle(x * w, y * h, w, h)));
                }
            }
            const width = this._width / this.scale.x;
            const height = this._height / this.scale.y;

            const sprites = [
                new PIXI.Sprite(textures[0]),
                new PIXI.TilingSprite(textures[1], width, h),
                new PIXI.Sprite(textures[2]),
                new PIXI.TilingSprite(textures[3], w, height),
                new PIXI.TilingSprite(textures[4], width, height),
                new PIXI.TilingSprite(textures[5], w, height),
                new PIXI.Sprite(textures[6]),
                new PIXI.TilingSprite(textures[7], width, h),
                new PIXI.Sprite(textures[8]),
            ];
            sprites[0].position.set(-w, -h);
            sprites[1].position.set(0, -h);
            sprites[2].position.set(width, -h);
            sprites[3].position.set(-w, 0);
            sprites[5].position.set(width, 0);
            sprites[6].position.set(-w, height);
            sprites[7].position.set(0, height);
            sprites[8].position.set(width, height);
            container.addChild(...sprites);
        });
    }

    private _height = 0;

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    private _width = 0;

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }


}
