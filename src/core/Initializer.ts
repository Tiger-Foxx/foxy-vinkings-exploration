import * as PIXI from "pixi.js";
import Game from "./Game";
import Renderer from "./Renderer";
import Updater from "./Updater";

export default class Initializer {

    private static tickerRender: PIXI.Ticker = new PIXI.Ticker();
    private static tickerUpdater: PIXI.Ticker = new PIXI.Ticker();

    public static createAndDisplayFrame(): void {
        Game.isFocus = true;
        window.onblur = () => Game.isFocus = false;
        window.onfocus = () => Game.isFocus = true;
        document.title = Game.NAME + " v" + Game.version.toString();
        Renderer.init();
    }

    public static getCurFps(): number {
        return this.tickerRender.FPS;
    }

    public static run(): void {
        this.tickerRender.add((dlt: number) => Renderer.onRender(dlt), PIXI.UPDATE_PRIORITY.INTERACTION);
        this.tickerUpdater.add((dlt: number) => Updater.onTick(dlt), PIXI.UPDATE_PRIORITY.LOW);
        this.tickerUpdater.minFPS = 20;
        this.tickerUpdater.maxFPS = 20;
        this.tickerRender.start();
        this.tickerUpdater.start();
    }

    public static setSpeed(speed: number): void {
        this.tickerUpdater.speed = speed;
    }
}


