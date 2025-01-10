import Particle from "./Particle";
import Random from "../../utility/Random";
import System from "../../core/System";
import * as PIXI from "pixi.js";
import SpriteSheet from "../../gfx/SpriteSheet";

export default class SmokeParticle extends Particle {

    private readonly sprite: PIXI.AnimatedSprite;

    constructor(x: number, y: number, startFrame = 0) {
        super(x, y);
        this.lifeDuration = Random.int(10) + 20;

        this.a.x = Random.gaussian() * 0.1;
        this.a.y = Random.gaussian() * 0.1;
        this.a.z = 0.1;
        this.gravity = -0.01;
        this.sprite = new PIXI.AnimatedSprite(
            SpriteSheet.loadTextures(System.getResource("particle", "dust.png"), 6, 8),
        );
        this.sprite.alpha = 0.8;
        this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.1;
        this.sprite.loop = false;
        this.sprite.gotoAndPlay(startFrame);
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
        this.sprite.rotation += 0.05;
        this.sprite.alpha = 1 - this.lifePercent() * this.lifePercent() * this.lifePercent();
    }

}
