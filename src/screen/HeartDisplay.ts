import * as PIXI from "pixi.js";
import Display from "./Display";
import SpriteSheet from "../gfx/SpriteSheet";
import System from "../core/System";
import Game from "../core/Game";

export default class HeartDisplay extends Display {
    private static textures = SpriteSheet.loadTextures(System.getResource("screen", "heart.png"), 3, 8);
    private health: number;
    private hearts: PIXI.Sprite[] = [];

    constructor() {
        super();
        this.init();
    }

    public onRender(): void {
        super.onRender();
        // for (const heart of this.hearts) heart.pivot.y = Math.sin((System.milliTime()) / 80 + heart.x);
    }

    public onTick(): void {
        super.onTick();
        this.updateHeartBar();
    }

    private addHeart(): void {
        const h = new PIXI.Sprite(HeartDisplay.textures[0]);
        this.hearts.push(h);
        this.addChild(h);
    }

    private init(): void {
        this.scale.set(4);
    }

    private removeHeart(): void {
        const h = this.hearts.pop();
        h?.parent.removeChild(h);
    }

    private updateHeartBar(): void {
        if (this.health === Game.player.health) {
            return;
        }
        this.health = Game.player.health;
        let max = Game.player.maxHealth;
        if (max < Game.player.health) max = Game.player.health;
        const nbHeart = Math.ceil(max / 2);
        while (this.hearts.length !== nbHeart) {
            if (this.hearts.length > nbHeart) this.removeHeart();
            if (this.hearts.length < nbHeart) this.addHeart();
        }
        this.hearts.forEach((heart, i) => {
            const x = (i % 10) * 8;
            const y = ~~(i / 10) * 8;
            const num = Math.ceil(nbHeart * 2 / max * Game.player.health) / 2;
            if ((i + 1) === Math.ceil(nbHeart / max * Game.player.health) && !Number.isInteger(num)) {
                heart.texture = HeartDisplay.textures[1];
            } else if (i >= Math.ceil(nbHeart / max * Game.player.health)) {
                heart.texture = HeartDisplay.textures[2];
            } else {
                heart.texture = HeartDisplay.textures[0];
            }
            heart.position.set(x, y);
        });
    }
}
