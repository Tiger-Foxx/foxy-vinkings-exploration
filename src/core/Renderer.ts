import * as PIXI from "pixi.js";
import Camera from "../gfx/Camera";
import Level from "../level/Level";
import Display from "../screen/Display";
import Color from "../utility/Color";
import Game from "./Game";
import System from "./System";
import {Readable} from "stream";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = true;

interface CanvasElement extends HTMLCanvasElement {
    captureStream(frameRate?: number): MediaStream;
}

export default class Renderer {
    public static camera: Camera = new Camera();
    public static readonly DEFAULT_HEIGHT: number = 160;
    public static readonly DEFAULT_WIDTH: number = 240;
    public static delta: number;
    public static HEIGHT: number = Renderer.DEFAULT_HEIGHT;
    public static ticks = 0;
    public static WIDTH: number = Renderer.DEFAULT_WIDTH;
    private static mainStage = new PIXI.Container();
    private static renderer = new PIXI.Renderer({
        width: 960 * 2,
        height: 540 * 2,
        backgroundColor: Color.black.getInt(),
        autoDensity: true,
        antialias: true,
        clearBeforeRender: false,
        powerPreference: "high-performance",
    });
    private static stages = {
        level: new PIXI.Container(),
        gui: new PIXI.Container(),
    };
    private static ticksTime: number[] = [];

    public static addDisplay(display: Display): void {
        this.stages.gui.addChild(display);
    }

    public static createStream(): Readable {
        // const audioStream = Howler.ctx.createMediaStreamDestination();
        // Howler.masterGain.disconnect();
        // Howler.masterGain.connect(audioStream);
        const reader = new Readable();
        const stream = (this.renderer.view as CanvasElement).captureStream();
        // stream.addTrack(audioStream.stream.getAudioTracks()[0]);
        // @ts-ignore
        const recorder = new MediaRecorder(stream);
        recorder.start(75);
        recorder.ondataavailable = (event: any) => {
            event.data.arrayBuffer().then((buffer: ArrayBuffer) => {
                reader.push(Buffer.from(buffer));
            });
        };
        return reader;
    }

    public static getNbChildren(): number {
        const f = (container: PIXI.Container): number => container.children.length === 0 ? 0 :
            container.children.filter((c) => c.isSprite && c.worldVisible).length +
            container.children.reduce((sum: number, c: PIXI.Container) => (sum + f(c)), 0);
        return f(this.mainStage);
    }

    public static getScreen(): PIXI.Rectangle {
        return this.renderer.screen;
    }

    public static getTickTime(): number {
        return this.ticksTime.reduce((p, c) => p + c, 0) / this.ticksTime.length;
    }

    public static init(): void {
        document.body.appendChild(this.renderer.view);
        this.mainStage.addChild(this.stages.level);
        this.mainStage.addChild(this.stages.gui);
        window.addEventListener("resize", () => this.onResize());
    }

    public static onRender(dlt: number): void {
        const t1 = System.milliTime();
        Renderer.delta = dlt;
        if (!Game.isFocus) {
            return;
        }
        Game.level?.onRender();
        Renderer.camera.update();
        Game.GUI.onRender();
        this.ticks += dlt;
        this.renderer.render(this.mainStage);
        this.ticksTime.unshift(System.milliTime() - t1);
        this.ticksTime.length = Math.min(this.ticksTime.length, 50);
    }

    public static resize(): void {
        this.renderer.resize(window.innerWidth, window.innerHeight);
    }

    public static setLevel(level: Level): void {
        this.stages.level.removeChildren();
        this.stages.level.addChild(level.container);
        if (level.weather) this.stages.level.addChild(level.weather);
        this.stages.level.addChild(level.lightFilter);
        Renderer.camera.setContainer(level.container, level.lightFilter.lightContainer);
    }

    private static onResize() {
        this.resize();
        Game.GUI.onResize();
    }
}
