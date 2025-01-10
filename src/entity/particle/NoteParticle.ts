import Particle from "./Particle";
import Random from "../../utility/Random";
import System from "../../core/System";
import * as PIXI from "pixi.js";
import SpriteSheet from "../../gfx/SpriteSheet";
import Color from "../../utility/Color";

export default class NoteParticle extends Particle {
    private static colors = [
        Color.red.getInt(),
        Color.green.getInt(),
        Color.blue.getInt(),
        Color.yellow.getInt(),
        Color.black.getInt(),
    ];
    private static frames = SpriteSheet.loadTextures(System.getResource("particle", "note.png"), 4, 8);
    private readonly sprite: PIXI.Sprite;

    constructor(x: number, y: number) {
        super(x, y);
        this.lifeDuration = Random.int(10) + 20;

        this.a.x = Random.gaussian() * 0.1;
        this.a.y = Random.gaussian() * 0.1;
        this.a.z = 0.1;
        this.gravity = -0.01;
        this.sprite = new PIXI.Sprite(NoteParticle.frames[Random.int(NoteParticle.frames.length)]);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(Random.number(0.5, 1));
        this.sprite.tint = NoteParticle.colors[Random.int(NoteParticle.colors.length)];
        this.sprite.angle = Random.number(-25, 25);
        this.addChild(this.sprite);
    }

    public onRender(): void {
        super.onRender();
        if (this.z < 0) {
            this.z = 0;
            this.a.z *= -0.5;
            this.a.x *= 0.6;
            this.a.y *= 0.6;
        }
        this.a.z -= this.gravity;
        this.sprite.alpha = 1 - this.lifePercent() * this.lifePercent() * this.lifePercent();
    }

}
