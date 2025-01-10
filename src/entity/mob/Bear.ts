import {AnimatedSprite, Texture} from "pixi.js";
import SpriteSheet from "../../gfx/SpriteSheet";
import HostileMob from "./HostileMob";

export default class Bear extends HostileMob {
    private static spriteSheet = new SpriteSheet("bear.json");
    protected speedMax = 1;
    private sprite?: AnimatedSprite;

    public canSwim(): boolean {
        return false;
    }

    public onRender(): void {
        super.onRender();
        if (Math.abs(this.a.get2dMagnitude()) > 0.1) {
            this.playAnimation("walk");
        } else {
            this.playAnimation("idle");
        }
    }

    public onTick(): void {
        super.onTick();
    }

    protected init(): void {
        super.init();
        this.sprite = new AnimatedSprite([Texture.EMPTY], true);
        this.sprite.anchor.set(0.5);
        this.container.addChild(this.sprite);
        this.playAnimation("walk");
    }

    private playAnimation(name: string, loop = true): AnimatedSprite | undefined {
        const a = Bear.spriteSheet.getAnimation(name, this.dir);
        if (!this.sprite || this.sprite.textures === a) return;
        this.sprite.textures = a;
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();
        this.sprite.loop = loop;
        return this.sprite;
    }
}
