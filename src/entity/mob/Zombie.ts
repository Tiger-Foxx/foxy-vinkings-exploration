import {AnimatedSprite, Texture} from "pixi.js";
import SpriteSheet from "../../gfx/SpriteSheet";
import HostileMob from "./HostileMob";
import Tiles from "../../level/tile/Tiles";

export default class Zombie extends HostileMob {
    private static spriteSheet = new SpriteSheet("zombie.json");
    protected speedMax = 0.25;
    private sprite?: AnimatedSprite;

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
        if (this.getLevel().getAmbientLightLevel() > 12) {
            this.burn();
        }
    }

    protected init(): void {
        super.init();
        this.sprite = new AnimatedSprite([Texture.EMPTY], true);
        this.sprite.anchor.set(0.5);
        this.container.addChild(this.sprite);
        this.playAnimation("walk");
    }

    protected newTarget(): void {
        super.newTarget();
        if (this.isOnFire) {
            const result = this.level?.findRandomTileInEntityRadius([Tiles.WATER], this, 20);
            if (result) {
                this.target = result;
            }
        }
    }

    private playAnimation(name: string, loop = true): AnimatedSprite | undefined {
        const a = Zombie.spriteSheet.getAnimation(name, this.dir);
        if (!this.sprite || this.sprite.textures === a) return;
        this.sprite.textures = a;
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();
        this.sprite.loop = loop;
        return this.sprite;
    }
}
