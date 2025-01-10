import * as PIXI from "pixi.js";
import System from "../../core/System";
import Vector from "../../utility/Vector";
import AquaticMob from "./AquaticMob";
import {Hook} from "../index";
import WaterDropParticle from "../particle/WaterDropParticle";

export default class Fish extends AquaticMob {
    protected speedMax = 1;
    private fishSprite: PIXI.Sprite;
    private hooked?: Hook;
    private hookedAt = 0;
    private lifeDuration = 0;
    private points?: PIXI.Point[];
    private shadowSprite: PIXI.SimpleRope;
    private vector: Vector = new Vector();

    constructor() {
        super();
        this.useMask = false;
        this.lifeDuration = 1000;
    }

    public canSwim(): boolean {
        return true;
    }

    public die(): void {
    }

    public onRender(): void {
        super.onRender();

        if (this.a.magnitude > 0.5) {
            this.vector.x -= (this.vector.x - this.a.x) / 30;
            this.vector.y -= (this.vector.y - this.a.y) / 30;
        }
        const isSwimming = this.isSwimming();
        this.fishSprite.visible = !isSwimming;
        this.shadowSprite.visible = isSwimming;

        if (isSwimming) {
            this.shadowSprite.rotation = -this.vector.rotation - Math.PI / 2;
            if (this.points) {
                this.points[2].y = Math.sin(this.ticks) * this.a.get2dMagnitude() * 2;
            }
        } else {
            this.jump(2);
        }
    }

    public onTick(): void {
        super.onTick();
        if (!this.hooked && --this.lifeDuration <= 0) {
            this.delete();
        }

        if (this.target instanceof Hook && this.target.isHooked() && this.target.getFish() !== this) {
            this.newTarget();
        }

        if (this.target instanceof Hook && !this.target.isHooked() && this.getDistance(this.target) < 8) {
            this.hooked = this.target as Hook;
            this.hooked.hookFish(this);
            this.hookedAt = this.ticks;
        }

        if (this.hooked && (this.ticks - this.hookedAt > 20) && this.random.probability(40)) {
            this.hooked.unHookFish();
            this.hooked = undefined;
            this.newTarget();
        }

        if (this.random.probability(800)) {
            for (let i = 0; i < this.random.number(1, 4); ++i) {
                this.level?.add(new WaterDropParticle(this.x, this.y));
            }
        }
    }

    protected calculateZIndex(): number {
        return this.isSwimming() ? -Infinity : super.calculateZIndex();
    }

    protected init(): void {
        super.init();
        this.container.scale.set(this.random.number(0.25, 1));
        this.hitbox.set(0, 0, 8 * this.container.scale.x, 8 * this.container.scale.y);
        this.points = [];
        this.points.push(new PIXI.Point(0, 0));
        this.points.push(new PIXI.Point(8, 0));
        this.points.push(new PIXI.Point(16, 0));
        this.shadowSprite = new PIXI.SimpleRope(
            PIXI.Texture.from(System.getResource("entity", "fish_shadow.png")),
            this.points,
        );
        this.shadowSprite.pivot.x = 5;
        this.shadowSprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        this.fishSprite = new PIXI.Sprite(PIXI.Texture.from(System.getResource("entity", "fish.png")));
        this.fishSprite.anchor.set(0.5);
        this.container.addChild(this.shadowSprite, this.fishSprite);
    }

    protected newTarget(): void {
        if (!this.level || this.hooked) return;
        if (this.random.probability(8)) {
            this.level.findEntity(Hook, (hook) => Boolean(hook.isSwimming() && !hook.getRemoved() && !hook.isHooked()))
                .then((hook) => {
                    this.target = hook;
                });
        } else {
            super.newTarget();
        }
    }
}
