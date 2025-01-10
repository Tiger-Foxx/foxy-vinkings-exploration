import * as PIXI from "pixi.js";
import System from "../../core/System";
import Tile from "./Tile";

export default class PlankTile extends Tile {
    public static readonly COLOR: number = 0x94785c;
    public static readonly TAG = "plank";

    public init(): void {
        super.init();
        this.container.addChild(
            new PIXI.Sprite(PIXI.Texture.from(System.getResource("tile", "plank.png"))),
        );
    }
}
