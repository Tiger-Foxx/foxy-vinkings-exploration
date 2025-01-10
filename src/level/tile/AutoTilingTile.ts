import * as PIXI from "pixi.js";
import {Container} from "pixi.js";
import Tile from "./Tile";
import Tiles from "./Tiles";

export default abstract class AutoTilingTile extends Tile {
    protected static autoTileTextures: PIXI.Texture[];

    protected static canConnectTo: string[] = [];
    public ["constructor"]: typeof AutoTilingTile;
    private sprites: PIXI.Sprite[] = [];
    private tilesContainer: PIXI.Container;

    protected static loadMaskTextures(path: string): PIXI.Texture[] {
        const textures = [];
        const baseTexture = PIXI.BaseTexture.from(path);
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                textures.push(new PIXI.Texture(baseTexture, new PIXI.Rectangle(x * 8, y * 8, 8, 8)));
            }
        }
        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < 2; x++) {
                textures.push(new PIXI.Texture(baseTexture, new PIXI.Rectangle(24 + x * 8, y * 8, 8, 8)));
            }
        }
        return textures;
    }

    public autoTiling(): void {
        this.tilesContainer.cacheAsBitmap = false;
        const test = (x: number, y: number) => {
            const t = this.levelTile.getRelativeTile(x, y, false);
            return !(t && t.instanceOf(...[this.getClass(), ...Tiles.getSome(...this.constructor.canConnectTo)]));
        };
        const u = test(0, -1);
        const d = test(0, 1);
        const l = test(-1, 0);
        const r = test(1, 0);

        const ul = test(-1, -1);
        const ur = test(1, -1);
        const dl = test(-1, 1);
        const dr = test(1, 1);

        this.sprites[0].texture = this.constructor.autoTileTextures[!u && !l ? !ul ? 4 : 12 : u && l ? 0 : u ? 1 : 3];
        this.sprites[1].texture = this.constructor.autoTileTextures[!u && !r ? !ur ? 4 : 11 : u && r ? 2 : u ? 1 : 5];
        this.sprites[2].texture = this.constructor.autoTileTextures[!d && !l ? !dl ? 4 : 10 : d && l ? 6 : d ? 7 : 3];
        this.sprites[3].texture = this.constructor.autoTileTextures[!d && !r ? !dr ? 4 : 9 : d && r ? 8 : d ? 7 : 5];
        this.tilesContainer.cacheAsBitmap = true;
    }

    public onUpdate(): void {
        super.onUpdate();
        this.autoTiling();
    }

    protected initAutoTile(): void {
        this.sprites = [new PIXI.Sprite(), new PIXI.Sprite(), new PIXI.Sprite(), new PIXI.Sprite()];
        this.tilesContainer = new Container();
        this.sprites[0].position.set(0, 0);
        this.sprites[1].position.set(8, 0);
        this.sprites[2].position.set(0, 8);
        this.sprites[3].position.set(8, 8);
        this.tilesContainer.addChild(...this.sprites);
        this.container.addChild(this.tilesContainer);
        this.autoTiling();
    }
}
