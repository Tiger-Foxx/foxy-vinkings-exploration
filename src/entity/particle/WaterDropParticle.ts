import Particle from "./Particle";
import Random from "../../utility/Random";
import System from "../../core/System";
import * as PIXI from "pixi.js";
import SpriteSheet from "../../gfx/SpriteSheet";

export default class WaterDropParticle extends Particle {

    private readonly sprite: PIXI.AnimatedSprite;

    constructor(x: number, y: number, startFrame = 0) {
        super(x, y);
        this.lifeDuration = Random.int(10) + 20;
        this.x += Random.int(-4, 4);
        this.y += Random.int(-4, 4);
        this.a.z = 0.1;
        this.gravity = 0;
        this.sprite = new PIXI.AnimatedSprite(
            SpriteSheet.loadTextures(System.getResource("particle", "bubble.png"), 3, 8),
        );
        this.sprite.alpha = 0.8;
        this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.1;
        this.sprite.loop = false;
        this.sprite.gotoAndPlay(startFrame);
        this.sprite.scale.set(Random.number(0.3, 0.75));
        this.sprite.onComplete = () => {
            this.delete();
        };
        this.addChild(this.sprite);
    }
}
