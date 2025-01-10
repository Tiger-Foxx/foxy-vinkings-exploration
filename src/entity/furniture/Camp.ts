import Furniture from "./Furniture";
import * as PIXI from "pixi.js";
import System from "../../core/System";
import SmokeParticle from "../particle/SmokeParticle";
import SpriteSheet from "../../gfx/SpriteSheet";
import {Mob} from "../index";
import Item from "../../item/Item";
import Items from "../../item/Items";
import Entity from "../Entity";

export default class Camp extends Furniture {

    private static baseTexture = PIXI.BaseTexture.from(System.getResource("furniture", "camp.png"));
    private static frames = SpriteSheet.loadTextures(System.getResource("fire.png"), 32, 16);
    private active = false;
    private campFire: PIXI.AnimatedSprite;

    constructor() {
        super();
        this.hitbox.set(0, 3, 16, 10);
    }

    public static create({id, x, y, active}: { id: string, x: number, y: number, active: boolean }): Camp {
        const e = super.create({id, x, y}) as Camp;
        e.active = active;
        return e;
    }

    public onRender(): void {
        super.onRender();
        this.campFire.visible = this.active;
        if (this.active) {
            this.level?.add(new SmokeParticle(this.x, this.y - 4));
        }
    }

    public onTick(): void {
        super.onTick();
        if (this.active) {
            this.getTile()?.setLight(15);
        }
    }

    public onUse(mob: Mob, item?: Item): boolean {
        if (Items.FLINT.instanceOf(item)) {
            this.active = true;
        }
        return true;
    }

    public toBSON(): any {
        return {
            ...super.toBSON(),
            active: this.active,
        };
    }

    public touchedBy(entity: Entity): void {
        super.touchedBy(entity);
        if (this.active && entity instanceof Mob) {
            entity.burn();
        }
    }

    protected init(): void {
        const sprite = new PIXI.Sprite(new PIXI.Texture(Camp.baseTexture));
        sprite.anchor.set(0.5);
        this.campFire = new PIXI.AnimatedSprite(Camp.frames);
        this.campFire.play();
        this.campFire.animationSpeed = 0.5;
        this.campFire.y = -6;
        this.campFire.anchor.set(0.5);
        this.campFire.visible = this.active;
        this.container.addChild(sprite, this.campFire);
    }
}
