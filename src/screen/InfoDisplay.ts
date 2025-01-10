import * as PIXI from "pixi.js";
import Game from "../core/Game";
import Initializer from "../core/Initializer";
import Renderer from "../core/Renderer";
import Updater from "../core/Updater";
import Color from "../utility/Color";
import Display from "./Display";

export default class InfoDisplay extends Display {

    private nbContainer = 0;
    private readonly textArea: PIXI.BitmapText;
    private readonly textBg = new PIXI.Sprite(PIXI.Texture.WHITE);

    constructor() {
        super();
        this.textArea = new PIXI.BitmapText("", {
            fontName: "Epic",
            fontSize: 16,
            tint: Color.white.getInt(),
        });

        this.textArea.x = 0;
        this.textArea.y = 0;

        this.textBg.tint = Color.black.getInt();
        this.textBg.alpha = 0.5;

        this.addChild(this.textBg, this.textArea);
    }

    public onRender(): void {
    }

    public onTick(): void {
        if (Updater.every(20)) {
            this.nbContainer = Renderer.getNbChildren();
        }
        const text = this.text();
        if (this.textArea.text === text) return;
        this.textArea.text = text;
        this.textBg.x = this.textArea.x;
        this.textBg.y = this.textArea.y;
        this.textBg.width = this.textArea.width;
        this.textBg.height = this.textArea.height;
    }

    private text(): string {
        const tile = Game.player.getInteractTile();
        return [
            `v${Game.version.toString()}`,
            `fps : ${Math.round(Initializer.getCurFps())}`,
            `tUpdater : ${Updater.getTickTime().toFixed(2)}ms (${Updater.getPercentUsage()}%)`,
            `tRenderer : ${Renderer.getTickTime().toFixed(2)}ms`,
            `time : ${Updater.ticks} (${Updater.time.id})`,
            `seed : ${Game.level?.seed}`,
            `cx : ${Game.player.x >> 8}`,
            `cy : ${Game.player.y >> 8}`,
            `x : ${(Game.player.x / 16).toFixed(2)}`,
            `y : ${(Game.player.y / 16).toFixed(2)}`,
            `z : ${(Game.player.z).toFixed(2)}`,
            `biome : ${tile?.biome.getDisplayName()}`,
            `tile : ${tile?.tile?.getDisplayName()}`,
            `l : ${tile?.getLightLevel()}`,
            `tile data : ${JSON.stringify(tile?.tile?.states.getStates(), null, 4)}`,
            `containers : ${this.nbContainer}`,
            `chunks loaded : ${Game.level?.getNbChunks()}`,
            `memory : ${process.memoryUsage().heapTotal >> 20} MB`,
        ].join("\n");
    }
}
