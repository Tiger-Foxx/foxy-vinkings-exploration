import * as PIXI from "pixi.js";
import LevelFilter from "./LevelFilter";
import Renderer from "../core/Renderer";
import Level from "../level/Level";

export default class LightFilter extends LevelFilter {
    public lightContainer = new PIXI.Container();
    private readonly ambientLight: PIXI.Sprite;
    private readonly blendFilter: PIXI.filters.AlphaFilter;
    private level: Level;

    constructor(level: Level) {
        super();
        this.level = level;
        this.ambientLight = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.ambientLight.width = Renderer.getScreen().width;
        this.ambientLight.height = Renderer.getScreen().height;
        this.ambientLight.tint = 0x000000;

        this.addChild(this.ambientLight, this.lightContainer);

        this.blendFilter = new PIXI.filters.AlphaFilter();
        this.blendFilter.alpha = 0;
        this.blendFilter.blendMode = PIXI.BLEND_MODES.MULTIPLY;

        const blurFilter = new PIXI.filters.BlurFilter();
        blurFilter.blur = 15 * Renderer.camera.zoom;
        blurFilter.repeatEdgePixels = true;

        const blurFilter2 = new PIXI.filters.BlurFilter();
        blurFilter2.blur = 2 * Renderer.camera.zoom;
        blurFilter2.repeatEdgePixels = true;

        this.filters = [blurFilter, blurFilter2, this.blendFilter];
    }

    public onRender(): void {
        this.blendFilter.alpha = 1 - (this.level.getAmbientLightLevel() / 20);
    }
}
